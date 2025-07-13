// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IDarkPoolVerifier.sol";

/// @title ShadowSats Dark Pool
/// @notice Confidential BTC spot matching & atomic settlement on Citrea’s zkEVM
contract DarkPool is Ownable {
    IERC20 public immutable token;
    IDarkPoolVerifier public verifier;
    address    public matcher;
    bool       public paused;

    struct Order {
        address owner;
        bool    exists;
        bool    canceled;
    }

    mapping(bytes32 => Order)      public orders;
    mapping(address => uint256)    public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event OrderSubmitted(bytes32 indexed commitment, address indexed owner);
    event OrderCanceled(bytes32 indexed commitment, address indexed owner);
    event BatchExecuted(
        uint256 indexed batchId,
        bytes32[] commitments,
        address[] makers,
        address[] takers,
        uint256[] sizes,
        uint256[] prices
    );
    event VerifierUpdated(address indexed newVerifier);
    event MatcherUpdated(address indexed newMatcher);
    event Paused();
    event Unpaused();

    modifier onlyMatcher() {
        require(msg.sender == matcher, "DP: caller is not matcher");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "DP: paused");
        _;
    }

    /// @param _token    ERC-20 collateral token (e.g. wrapped BTC)
    /// @param _verifier Stub or Circom-generated verifier contract
    /// @param _matcher  Address allowed to call executeBatch()
    constructor(address _token, address _verifier, address _matcher) {
        token     = IERC20(_token);
        verifier  = IDarkPoolVerifier(_verifier);
        matcher   = _matcher;
    }

    /// @notice Owner can swap in a new verifier (e.g. after trusted setup)
    function setVerifier(address _verifier) external onlyOwner {
        verifier = IDarkPoolVerifier(_verifier);
        emit VerifierUpdated(_verifier);
    }

    /// @notice Owner designates who may call executeBatch()
    function setMatcher(address _matcher) external onlyOwner {
        matcher = _matcher;
        emit MatcherUpdated(_matcher);
    }

    /// @notice Pause all user-facing functions
    function pause() external onlyOwner {
        paused = true;
        emit Paused();
    }

    /// @notice Unpause the contract
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused();
    }

    /// @notice Deposit ERC-20 collateral into the pool
    function deposit(uint256 amount) external whenNotPaused {
        require(amount > 0, "DP: amount>0");
        balances[msg.sender] += amount;
        require(token.transferFrom(msg.sender, address(this), amount), "DP: transfer failed");
        emit Deposit(msg.sender, amount);
    }

    /// @notice Withdraw available collateral
    function withdraw(uint256 amount) external whenNotPaused {
        require(amount > 0, "DP: amount>0");
        require(balances[msg.sender] >= amount, "DP: insufficient balance");
        balances[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "DP: transfer failed");
        emit Withdraw(msg.sender, amount);
    }

    /// @notice Submit a blinded order commitment
    function submitOrder(bytes32 commitment) external whenNotPaused {
        Order storage ord = orders[commitment];
        require(!ord.exists, "DP: exists");
        orders[commitment] = Order({ owner: msg.sender, exists: true, canceled: false });
        emit OrderSubmitted(commitment, msg.sender);
    }

    /// @notice Cancel a previously submitted order
    function cancelOrder(bytes32 commitment) external whenNotPaused {
        Order storage ord = orders[commitment];
        require(ord.exists, "DP: not exists");
        require(ord.owner == msg.sender, "DP: not owner");
        require(!ord.canceled, "DP: already canceled");
        ord.canceled = true;
        emit OrderCanceled(commitment, msg.sender);
    }

    /// @notice Execute a batch of matched trades atomically
    /// @param batchId      Unique ID of this batch
    /// @param proof        ZK proof over the set of commitments
    /// @param commitments  Array of order commitments in this batch
    /// @param makers       Array of maker addresses (submitters)
    /// @param takers       Array of taker addresses
    /// @param sizes        Array of token amounts to transfer (in token decimals)
    /// @param prices       Array of execution prices (for on-chain logging)
    function executeBatch(
        uint256     batchId,
        bytes calldata      proof,
        bytes32[] calldata  commitments,
        address[] calldata  makers,
        address[] calldata  takers,
        uint256[] calldata  sizes,
        uint256[] calldata  prices
    )
        external
        onlyMatcher
        whenNotPaused
    {
        require(verifier.verifyProof(proof, commitments), "DP: invalid proof");

        uint256 n = commitments.length;
        require(
            makers.length   == n &&
            takers.length   == n &&
            sizes.length    == n &&
            prices.length   == n,
            "DP: length mismatch"
        );

        for (uint256 i = 0; i < n; i++) {
            Order storage ord = orders[commitments[i]];
            require(ord.exists && !ord.canceled, "DP: bad order");
            require(ord.owner == makers[i], "DP: maker mismatch");

            uint256 size  = sizes[i];
            address maker = makers[i];
            address taker = takers[i];

            require(balances[maker] >= size, "DP: maker balance");
            balances[maker] -= size;
            balances[taker] += size;
        }

        emit BatchExecuted(batchId, commitments, makers, takers, sizes, prices);
    }
}
