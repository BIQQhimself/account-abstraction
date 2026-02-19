#!/bin/bash

# Zero-Gas Node for BIQQhimself
# Starts a local Hardhat node with free gas (0 transaction fees)

echo "🚀 Starting Zero-Gas Hardhat Node for BIQQhimself..."
echo "   All transactions are FREE - no gas fees required"
echo "   Network: http://localhost:8545"
echo ""

# Start the Hardhat node with unlimited accounts
npx hardhat node --no-deploy --host 0.0.0.0

