// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IDarkPoolVerifier.sol";

contract DarkPool {
    IERC20 public token;
    IDarkPoolVerifier public verifier;

    struct Order {
        bytes32 commitment;
        address owner;
        bool exists;
    }

    mapping(bytes32 => Order) public orders;
    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event OrderSubmitted(bytes32 indexed commitment, address indexed owner);
    event BatchExecuted(uint256 indexed batchId, bytes32[] commitments, address[] makers, address[] takers);

    constructor(address _token, address _verifier) {
        token = IERC20(_token);
        verifier = IDarkPoolVerifier(_verifier);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "amount>0");
        balances[msg.sender] += amount;
        require(token.transferFrom(msg.sender, address(this), amount), "transfer failed");
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "amount>0");
        require(balances[msg.sender] >= amount, "insufficient balance");
        balances[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "transfer failed");
        emit Withdraw(msg.sender, amount);
    }

    function submitOrder(bytes32 commitment) external {
        require(!orders[commitment].exists, "commitment exists");
        orders[commitment] = Order({commitment: commitment, owner: msg.sender, exists: true});
        emit OrderSubmitted(commitment, msg.sender);
    }

    function executeBatch(
        uint256 batchId,
        bytes calldata proof,
        bytes32[] calldata commitments,
        address[] calldata makers,
        address[] calldata takers
    ) external {
        require(verifier.verifyProof(proof, commitments), "invalid proof");
        require(
            makers.length == takers.length && takers.length == commitments.length,
            "array length mismatch"
        );
        for (uint256 i = 0; i < commitments.length; i++) {
            Order storage maker = orders[commitments[i]];
            require(maker.exists && maker.owner == makers[i], "invalid maker");
            // TODO: add settlement logic here
        }
        emit BatchExecuted(batchId, commitments, makers, takers);
    }
}
