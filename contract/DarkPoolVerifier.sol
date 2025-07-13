// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IDarkPoolVerifier.sol";

/// @dev Stub verifier. In production, replace this with the Circom-generated verifier contract.
contract DarkPoolVerifier is IDarkPoolVerifier {
    function verifyProof(bytes calldata proof, bytes32[] calldata commitments)
        external pure override returns (bool)
    {
        // Accept any non-empty proof and non-empty commitments
        return proof.length > 0 && commitments.length > 0;
    }
}
