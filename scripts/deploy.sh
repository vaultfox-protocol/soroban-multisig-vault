#!/usr/bin/env bash
set -euo pipefail
DEPLOYER_KEY="${DEPLOYER_KEY:-default}"

echo "▶ Building vault contract..."
stellar contract build

echo "▶ Deploying..."
VAULT_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/vault.wasm \
  --source "$DEPLOYER_KEY" --network testnet)

echo "✅ Vault deployed: $VAULT_ID"

cat > frontend/.env.local <<EOF
NEXT_PUBLIC_VAULT_CONTRACT_ID=$VAULT_ID
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
EOF

echo "✅ Done."
