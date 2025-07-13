#!/bin/bash
# Compile the Circom circuit
circom circuits/order_commitment.circom --r1cs --wasm --sym
