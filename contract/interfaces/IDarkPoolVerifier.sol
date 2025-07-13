// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDarkPoolVerifier {
    /// @notice Verify a ZK proof attesting to a set of committed orders
    /// @param proof The serialized zkSNARK proof
    /// @param commitments The array of Pedersen commitment hashes
    /// @return valid True if the proof validates against the commitments
    function verifyProof(bytes calldata proof, bytes32[] calldata commitments) external view returns (bool valid);
}
