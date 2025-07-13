#!/bin/bash
# Perform trusted setup (Groth16) for the circuit
snarkjs groth16 setup circuits/order_commitment.r1cs pot12_final.ptau circuits/order_commitment.zkey
