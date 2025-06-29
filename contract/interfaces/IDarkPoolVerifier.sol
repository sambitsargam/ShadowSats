// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDarkPoolVerifier {
    function verifyProof(bytes calldata proof, bytes32[] calldata commitments) external view returns (bool);
}
