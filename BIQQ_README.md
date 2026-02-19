BIQQ local tools
=================

This repository includes small helper tools to let "BIQQhimself" manage sender/receiver addresses and test the signing/gas UI flow locally (works with zero balance).

Files
- `scripts/biqq-config.js` — CLI to get/set/edit `from` and `to` addresses.
  - Examples:
    - `node scripts/biqq-config.js get`
    - `node scripts/biqq-config.js set --from 0x... --to 0x...`
    - `node scripts/biqq-config.js edit`

- `scripts/biqq-server.js` — lightweight HTTP UI for entering addresses and simulating a transaction/gas breakdown.
  - Start: `node scripts/biqq-server.js`
  - Open: http://localhost:8088
  - The UI allows saving `from`/`to` and running a `Simulate` action which returns a fake gas breakdown (base/execution/postOp), gasLimit and totalWei string — useful to test the frontend signing flow even when the wallet balance is 0.

Persistence
- Config is stored in `biqq_config.json` at the repository root after `set`/`edit`/`save`.

Notes
- These tools are intentionally minimal and synchronous to make testing simple. They do not perform any on-chain operations; `simulate` returns a deterministic, local estimate for UI testing.

If you'd like, I can:
- Add a short README section to the repository main `README.md`.
- Wire the server into an existing frontend page.
- Add tests for the CLI and server endpoints.
