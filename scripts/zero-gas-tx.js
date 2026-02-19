#!/usr/bin/env node

/**
 * Zero-Gas Transaction Executor for BIQQhimself
 * Executes transactions on local Hardhat network with 0 gas fees
 *
 * Usage: node scripts/zero-gas-tx.js [script-path]
 */

const { ethers, network } = require('hardhat')
const fs = require('fs')
const path = require('path')

async function executeWithZeroGas() {
  const scriptPath = process.argv[2]

  if (!scriptPath) {
    console.error('❌ Usage: npx hardhat run scripts/zero-gas-tx.js [script-path] --network localhost')
    process.exit(1)
  }

  console.log('⚙️  Zero-Gas Transaction Executor')
  console.log(`📝 Network: ${network.name}`)

  try {
    // Get signer with default Hardhat account (unlimited funds, 0 gas)
    const signer = await ethers.provider.getSigner()
    const signerAddress = await signer.getAddress()

    console.log(`💰 Signer: ${signerAddress}`)

    // Set gas price to 0
    const provider = ethers.provider
    const gasPrice = await provider.getGasPrice()
    console.log(`⛽ Current Gas Price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} Gwei`)

    // Override gas price to 0 if on localhost (free gas)
    if (network.name === 'localhost' || network.name === 'hardhat') {
      console.log('✅ Using ZERO GAS (free transactions)')
      // Hardhat network automatically has 0 gas price
    }

    // Check balance
    const balance = await provider.getBalance(signerAddress)
    console.log(`📊 Account Balance: ${ethers.utils.formatEther(balance)} ETH`)
    console.log('---')

    // Execute the provided script
    require(path.resolve(scriptPath))
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

executeWithZeroGas().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})

module.exports = { executeWithZeroGas }
