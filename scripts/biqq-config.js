#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const CONFIG_PATH = path.resolve(__dirname, '..', 'biqq_config.json')

function isAddress(a) {
  return typeof a === 'string' && /^0x[0-9a-fA-F]{40}$/.test(a)
}

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  } catch (e) {
    return {}
  }
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2))
}

function usageAndExit(code = 1) {
  console.log('Usage: node scripts/biqq-config.js <get|set|edit> [--from <addr>] [--to <addr>]')
  process.exit(code)
}

const cmd = process.argv[2]
if (!cmd) usageAndExit()

if (cmd === 'get') {
  const cfg = loadConfig()
  console.log('biqq_config:', JSON.stringify(cfg, null, 2))
  process.exit(0)
}

if (cmd === 'set') {
  const args = process.argv.slice(3)
  let from, to
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--from') from = args[++i]
    else if (args[i] === '--to') to = args[++i]
  }
  if (from && !isAddress(from)) {
    console.error('Invalid --from address')
    process.exit(2)
  }
  if (to && !isAddress(to)) {
    console.error('Invalid --to address')
    process.exit(2)
  }
  const cfg = loadConfig()
  if (from) cfg.from = from
  if (to) cfg.to = to
  cfg.updatedAt = new Date().toISOString()
  saveConfig(cfg)
  console.log('Saved config:', JSON.stringify(cfg, null, 2))
  process.exit(0)
}

if (cmd === 'edit') {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const cfg = loadConfig()
  rl.question(`Sender address (from) [${cfg.from || ''}]: `, (from) => {
    rl.question(`Receiver address (to) [${cfg.to || ''}]: `, (to) => {
      const newCfg = Object.assign({}, cfg)
      if (from) {
        if (!isAddress(from)) return rl.close(console.error('Invalid sender address'))
        newCfg.from = from
      }
      if (to) {
        if (!isAddress(to)) return rl.close(console.error('Invalid receiver address'))
        newCfg.to = to
      }
      newCfg.updatedAt = new Date().toISOString()
      saveConfig(newCfg)
      console.log('Saved config:', JSON.stringify(newCfg, null, 2))
      rl.close()
    })
  })
  return
}

usageAndExit()
