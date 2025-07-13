// generateOrderProof.ts
import { groth16 } from "snarkjs";
import fs from "fs";
import path from "path";

async function run() {
  const input = {
    price: 50000 * 100,   // $50,000 → ×100
    size: 0.5 * 1e8,      // 0.5 BTC → sats
    side: 1,              // sell
    nonce: Math.floor(Math.random() * 2**32)
  };

  const wasmPath = path.join(__dirname, "order_commitment_js", "order_commitment.wasm");
  const zkeyPath = path.join(__dirname, "order_commitment.zkey");

  console.log("Generating proof...");
  const { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);

  fs.writeFileSync("proof.json", JSON.stringify(proof, null, 2));
  fs.writeFileSync("publicSignals.json", JSON.stringify(publicSignals, null, 2));

  console.log("Proof and publicSignals written to disk.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});