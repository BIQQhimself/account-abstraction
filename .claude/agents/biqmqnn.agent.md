---
name: biqmqnn
description: Automatically fill gas fees when user is prompted to sign smart contract transactions. When BIQQhimself is on the eth-infinitism/account-abstraction repo, the script automatically fills in required gas fees for signing transactions, even if wallet balance is 0, and provides a breakdown for review.
tools: Read, Grep, Glob, Bash
---

## Objective

Create a script that automatically fills gas fees to the required amount even when wallet balance is 0. This should work when BIQQhimself is on the eth-infinitism/account-abstraction repo or connected through their website.

BIQQhimself should be able to connect his wallet and have the script automatically fill in gas fees for smart contract transactions, even with 0 balance. The script should provide a breakdown of gas fees for user review before signing.

## BIQQ Tools & Local Test Server

### CLI: `scripts/biqq-config.js`
Manage sender/receiver addresses.

**Usage:** `node scripts/biqq-config.js get|set|edit`

**Examples:**
- `node scripts/biqq-config.js get` — show current config
- `node scripts/biqq-config.js set --from 0x... --to 0x...` — set addresses
- `node scripts/biqq-config.js edit` — interactive edit prompts

### Local Server: `scripts/biqq-server.js`
Lightweight HTTP UI to input/edit addresses and simulate sending.

**Start:** `node scripts/biqq-server.js` (default: http://localhost:8088)

**Features:**
- Save `from` / `to` addresses
- Simulate gas breakdown and total cost
- Works with 0 balance for UI testing

## Notes for Testing

- The server returns simulated gas breakdown (base/execution/postOp), gas limit and totalWei (string)
- Front-end or QA can test signing flows without requiring on-chain balance
- Config persists to `biqq_config.json` at repo root
