
# ShadowSats: On-Chain Dark Pool for Bitcoin Spot Trading

ShadowSats is a privacy-first dark pool built on Citrea’s zkEVM rollup. It enables high-volume BTC traders to submit blinded bids and asks off-chain, batch-match them privately, and settle atomically on-chain—preserving confidentiality until execution.


## Table of Contents

1. [Architecture Overview](#architecture-overview)  
2. [Smart Contracts](#smart-contracts)  
3. [ZK Proof Generation & On-Chain Verification](#zk-proof-generation--on-chain-verification)  
4. [Off-Chain Batch Matcher](#off-chain-batch-matcher)  
5. [Frontend Application](#frontend-application)  
6. [Testing](#testing)  
7. [Deployment](#deployment)  
8. [Roadmap & Future Waves](#roadmap--future-waves)  
9. [License](#license)


## Architecture Overview

ShadowSats comprises four coordinated layers:

- **Settlement Layer (On-Chain)**  
  - **DarkPool.sol**: ERC-20 collateral management, blinded-order registry, atomic batch settlement.  
  - **DarkPoolVerifier.sol**: On-chain SNARK/STARK verifier stub (to be replaced by production verifier).

- **Privacy Layer (ZK-Enabled)**  
  - Clients generate zero-knowledge proofs attesting to knowledge of hidden `(price, size, side, nonce)` and that batches correspond to committed orders.  
  - Proofs are verified on chain before any collateral movements.

- **Off-Chain Services**  
  - **Order API**: Receives order commitments (Pedersen/SHA-256), timestamps and stores them in a secure database.  
  - **Batch Matcher**: Periodically fetches pending commitments, runs a price-time priority matching engine, assembles trade batches.  
  - **Proof Tooling**: CLI and in-browser scripts (using `snarkjs`) compile circuits, compute witnesses, and produce ZK proofs and public signals.

- **User Interface**  
  - **Next.js + React + TypeScript**: Dashboard, trade forms, order-book view, history, and admin panel.  
  - **ethers.js + Web3Modal**: Wallet integration for MetaMask & WalletConnect on Citrea RPC.  
  - **React Query**: Efficient server-state synchronization for orders and batch statuses.

---

## Smart Contracts

### `DarkPool.sol`

```solidity
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IDarkPoolVerifier.sol";

contract DarkPool {
    IERC20 public immutable token;
    IDarkPoolVerifier public immutable verifier;

    struct Order { bytes32 commitment; address owner; }
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
        require(amount > 0, "DP: amount>0");
        balances[msg.sender] += amount;
        require(token.transferFrom(msg.sender, address(this), amount), "DP: transfer failed");
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "DP: amount>0");
        require(balances[msg.sender] >= amount, "DP: insufficient balance");
        balances[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "DP: transfer failed");
        emit Withdraw(msg.sender, amount);
    }

    function submitOrder(bytes32 commitment) external {
        require(orders[commitment].owner == address(0), "DP: exists");
        orders[commitment] = Order({ commitment: commitment, owner: msg.sender });
        emit OrderSubmitted(commitment, msg.sender);
    }

    function executeBatch(
        uint256 batchId,
        bytes calldata proof,
        bytes32[] calldata commitments,
        address[] calldata makers,
        address[] calldata takers
    ) external {
        require(verifier.verifyProof(proof, commitments), "DP: invalid proof");
        uint256 n = commitments.length;
        require(makers.length == n && takers.length == n, "DP: length mismatch");

        for (uint256 i = 0; i < n; i++) {
            Order storage ord = orders[commitments[i]];
            require(ord.owner == makers[i], "DP: bad maker");
            // collateral settlement logic:
            // balances[makers[i]] -= sizes[i];
            // balances[takers[i]] += sizes[i];
        }
        emit BatchExecuted(batchId, commitments, makers, takers);
    }
}
````

### `DarkPoolVerifier.sol`

```solidity
pragma solidity ^0.8.0;

import "./interfaces/IDarkPoolVerifier.sol";

contract DarkPoolVerifier is IDarkPoolVerifier {
    function verifyProof(bytes calldata proof, bytes32[] calldata commitments)
        external pure override returns (bool)
    {
        // Stubbed: accept any non-empty proof.
        return proof.length > 0 && commitments.length > 0;
    }
}
```

* **Key Interfaces**:

  * `IDarkPoolVerifier.verifyProof(bytes proof, bytes32[] commitments) → bool`

* **Security Notes**:

  * In production, use snarkjs to export the Circom-generated verifier and replace the stub.
  * All state changes are atomic within `executeBatch`, preventing partial fills.

## ZK Proof Generation & On-Chain Verification

1. **Trusted Setup (Groth16)**

   ```bash
   snarkjs groth16 setup order.r1cs pot12_final.ptau order.zkey
   snarkjs zkey export verificationkey order.zkey verification_key.json
   ```

2. **Client-Side / CLI Proof Generation**

   ```ts
   import { groth16 } from "snarkjs";
   const { proof, publicSignals } = await groth16.fullProve(
     { price, size, side, nonce },
     "order.wasm",
     "order.zkey"
   );
   // submit proof + publicSignals.commitment to on-chain
   ```

3. **On-Chain Verification**

   * Pack `proof` and `publicSignals` into calldata:

     ```js
     await verifier.verifyProof(proofBytes, [commitment]);
     ```
   * Circuit-generated Solidity verifier performs pairing checks in < 500 k gas.


## Off-Chain Batch Matcher

```ts
interface Batch {
  batchId: number;
  commitments: string[];
  makers: string[];
  takers: string[];
  prices: number[];
  sizes: number[];
}
```

* **Polling Loop**:

  * Every 30 s: `GET /api/orders/pending` → returns `commitment`, `owner`, `timestamp`.

* **Matching Algorithm**:

  * Sort bids descending, asks ascending.
  * Use price-time priority to maximize fill.
  * Allow partial fills by splitting commitments.

* **Batch Construction**:

  * Aggregate matched pairs into arrays.
  * Call `snarkjs` to generate a batch proof against all commitments.
  * Submit to smart contract:

    ```ts
    await darkPool.executeBatch(batchId, proof, commitments, makers, takers);
    ```


## Frontend Application

* **Architecture**: Next.js with file-based routing

* **Wallet Integration**: ethers.js + Web3Modal for Citrea RPC

* **State Management**: React Query for server data, Context for wallet/session

* **Key Pages**:

  * **Dashboard**: Deposit/Withdraw widget, balance & collateral.
  * **Trade**:

    * Order form → local proof generation → `POST /api/orders`.
    * Blurred order-book tiers via `GET /api/orders/book`.
  * **History**: User’s past orders & fills.
  * **Admin**: Fetch pending batches, trigger `executeBatch`, view gas estimates.

* **Error Handling & UX**:

  * Toast notifications for tx status and proof errors.
  * Loading spinners during proof generation and on-chain calls.
  * Responsive dark-theme layout with Tailwind CSS.


## License

Licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

