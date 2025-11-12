// ❌ INTENTIONALLY VULNERABLE — for scanner testing only.
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // over-permissive CORS (wildcard)

// serve your index.html
app.use(express.static(path.join(__dirname)));

// reflected XSS: /greet?name=<img src=x onerror=alert(1)>
app.get('/greet', (req, res) => {
  const name = req.query.name || 'Guest';
  res.send(`<!doctype html><html><body><h1>Hello ${name}</h1></body></html>`);
});

// open redirect: /redirect?next=http://example.com
app.get('/redirect', (req, res) => {
  res.redirect(req.query.next || '/');
});

// secret leak (fake default): /debug/secret
app.get('/debug/secret', (_req, res) => {
  const secret = process.env.DEMO_API_KEY || 'AKIAIOSFODNN7EXAMPLE';
  res.json({ debugSecretEcho: secret });
});

app.listen(PORT, () => {
  console.log(`Vuln test server on http://localhost:${PORT}`);
});
