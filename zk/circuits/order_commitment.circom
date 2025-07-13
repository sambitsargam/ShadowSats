// order_commitment.circom
pragma circom 2.0.0;

include "circomlib/pedersen.circom";
include "circomlib/bitify.circom";

template OrderCommitment() {
    // Inputs
    signal input price;    // e.g. USD price × 100 (to avoid decimals)
    signal input size;     // BTC amount in satoshis (×1e8)
    signal input side;     // 0 = buy, 1 = sell
    signal input nonce;    // random 32-bit number

    // Bounds checks
    component inRange1 = LessThan(32);
    inRange1.in[0] <== price;
    inRange1.in[1] <== 10000000;     // max price 100,000.00 USD

    component inRange2 = LessThan(32);
    inRange2.in[0] <== size;
    inRange2.in[1] <== 1000000000000; // max size 10 BTC (10×1e8 sats)

    // Pedersen hash over [price, size, side, nonce]
    component ped = Pedersen(4);
    ped.in[0] <== price;
    ped.in[1] <== size;
    ped.in[2] <== side;
    ped.in[3] <== nonce;

    // Output commitment
    signal output commitment;
    commitment <== ped.out;
}

component main = OrderCommitment();