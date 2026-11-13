const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname);
const PORT = 8080;
const HOST = '127.0.0.1';
const TYPES = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.woff2':'font/woff2', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.json':'application/json; charset=utf-8', '.md':'text/markdown; charset=utf-8' };
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.readFile(filePath, (e, data) => {
      if (e) { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('Not found: ' + urlPath); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
});
server.listen(PORT, HOST, () => console.log('Serving ' + ROOT + ' at http://' + HOST + ':' + PORT));
