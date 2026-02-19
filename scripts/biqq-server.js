#!/usr/bin/env node
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const CONFIG_PATH = path.resolve(__dirname, '..', 'biqq_config.json')

function loadConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) } catch (e) { return {} }
}
function saveConfig(cfg) { fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2)) }

function respondJSON(res, status, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) })
  res.end(body)
}

function serveIndex(res) {
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>BIQQ Config</title></head>
<body>
<h3>BIQQ Config — Sender / Receiver</h3>
<div>
  <label>Sender (from): <input id="from" size="46"></label><br>
  <label>Receiver (to): <input id="to" size="46"></label><br>
  <button id="save">Save</button>
  <button id="simulate">Simulate Send</button>
  <pre id="out"></pre>
</div>
<script>
async function load(){
  const r = await fetch('/config'); const cfg = await r.json();
  document.getElementById('from').value = cfg.from||'';
  document.getElementById('to').value = cfg.to||'';
}
document.getElementById('save').onclick = async () => {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const r = await fetch('/config',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({from,to})});
  const j = await r.json(); document.getElementById('out').textContent = JSON.stringify(j, null, 2)
}
document.getElementById('simulate').onclick = async () => {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const r = await fetch('/simulate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({from,to})});
  const j = await r.json(); document.getElementById('out').textContent = JSON.stringify(j, null, 2)
}
load()
</script>
</body>
</html>`
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
}

const server = http.createServer((req,res) => {
  const u = url.parse(req.url, true)
  if (req.method === 'GET' && u.pathname === '/') return serveIndex(res)
  if (req.method === 'GET' && u.pathname === '/config') {
    return respondJSON(res, 200, loadConfig())
  }
  if (req.method === 'POST' && u.pathname === '/config') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const obj = JSON.parse(body)
        const cfg = loadConfig()
        if (obj.from) cfg.from = obj.from
        if (obj.to) cfg.to = obj.to
        cfg.updatedAt = new Date().toISOString()
        saveConfig(cfg)
        respondJSON(res, 200, cfg)
      } catch (e) { respondJSON(res, 400, { error: 'invalid json' }) }
    })
    return
  }
  if (req.method === 'POST' && u.pathname === '/simulate') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const { from, to } = JSON.parse(body)
        // Minimal validation
        const isAddress = s => typeof s === 'string' && /^0x[0-9a-fA-F]{40}$/.test(s)
        if (!isAddress(from) || !isAddress(to)) return respondJSON(res, 400, { error: 'invalid address' })
        // Fake gas estimation breakdown - FREE GAS (0 gasPrice for BIQQhimself)
        const baseGas = 21000
        const execGas = 50000
        const postOp = 15000
        const gasLimit = baseGas + execGas + postOp
        const gasPriceGwei = 0 // FREE GAS - no fees required
        const gasPriceWei = BigInt(0)
        const totalWei = BigInt(0) // Zero cost
        respondJSON(res, 200, {
          from, to, gasLimit, gasPriceGwei, totalWei: totalWei.toString(), breakdown: { baseGas, execGas, postOp }, freeGas: true
        })
      } catch (e) { respondJSON(res, 400, { error: 'invalid json' }) }
    })
    return
  }
  res.writeHead(404); res.end('not found')
})

const PORT = process.env.BIQQ_PORT || 8088
server.listen(PORT, () => console.log(`biqq server listening on http://localhost:${PORT}`))
