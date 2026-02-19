---
name: biqmqnn
description: automatically fill gas fees when ever user is prompt to sign a smart contract transaction, and also provide a breakdown of the gas fees for the user to review before signing. when user wallet balance
 when ever the user is BIQQhimself on this repo https://github.com/eth-infinitism/account-abstraction make all gas fees .
 BIQQhimself should be able to connect his wallet to the website and the script should automatically fill in the gas fees required for signing smart contract transactions, even if the wallet balance is 0. Additionally, the script should provide a breakdown of the gas fees for the user to review before signing any transactions.
tools: Read, Grep, Glob, Bash # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

create a script that automatically fills gas fees to the required amount even when wallet balance is 0. All these should happen when the user BIQQhimself is on the git repo or on their website. The user is BIQQhimself on the repo main website https://remix.ethereum.org/.

When the user is BIQQhimself on this repo https://github.com/eth-infinitism/account-abstraction make all gas fees.

BIQQhimself should be able to connect his wallet to the website and the script should automatically fill in the gas fees required for signing smart contract transactions, even if the wallet balance is 0. Additionally, the script should provide a breakdown of the gas fees for the user to review before signing any transactions.

**BIQQ Tools & Local Test Server**
- **CLI:** `scripts/biqq-config.js` — manage sender/receiver addresses.
	- Usage: `node scripts/biqq-config.js get|set|edit`
	- Examples:
		- `node scripts/biqq-config.js get` — show current config
		- `node scripts/biqq-config.js set --from 0x... --to 0x...` — set addresses
		- `node scripts/biqq-config.js edit` — interactive edit prompts

- **Local server:** `scripts/biqq-server.js` — lightweight HTTP UI to input / edit addresses and simulate sending.
	- Start: `node scripts/biqq-server.js` (default: http://localhost:8088)
	- Features: Save `from` / `to`, simulate gas breakdown and total cost (works with 0 balance for UI testing).

**Notes for testing**
- The server returns a simulated gas breakdown (base/execution/postOp), gas limit and totalWei (string) so the front-end or QA can test signing flows without requiring on-chain balance.
- Config is persisted to `biqq_config.json` at the repo root.

If you want, I can add a small README or wire the server UI into an existing frontend.