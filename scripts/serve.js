// Minimal static file server for QA testing.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT || 8765);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  const clean = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const fp = path.join(ROOT, clean);
  if (!fp.startsWith(ROOT + path.sep) && fp !== ROOT) { res.writeHead(403); res.end('forbidden'); return; }

  // Mirror production's clean-URL routing so links like /grammar/articles and
  // /clb6-french-course are testable locally instead of producing false 404s.
  const candidates = path.extname(fp)
    ? [fp]
    : [fp, fp + '.html', path.join(fp, 'index.html')];
  const read = index => {
    if (index >= candidates.length) {
      fs.readFile(path.join(ROOT, '404.html'), (error, data) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        if (req.method === 'HEAD') res.end();
        else res.end(error ? '<h1>Page not found</h1>' : data);
      });
      return;
    }
    fs.readFile(candidates[index], (err, data) => {
      if (err) { read(index + 1); return; }
      const ext = path.extname(candidates[index]);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      if (req.method === 'HEAD') res.end();
      else res.end(data);
    });
  };
  read(0);
}).listen(PORT, () => console.log(`serving on http://localhost:${PORT}`));
