const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const PROFILE_PATH = path.join(__dirname, 'config', 'profile.json');
const STATS_PATH = path.join(__dirname, 'config', 'stats.json');

// ---- tiny persistence helpers (flat JSON file, fine for a single-profile site) ----
function readJSON(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return fallback;
  }
}

function writeJSON(filePath, data) {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) console.error(`Failed to persist ${filePath}:`, err.message);
  });
}

if (!fs.existsSync(STATS_PATH)) {
  writeJSON(STATS_PATH, { views: 0 });
}

// ---- middleware ----
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false, // the profile allows user-supplied avatar/background/audio URLs
  })
);
app.use(express.static(path.join(__dirname, 'public')));

// ---- API ----

// Returns the editable profile content (config/profile.json).
// This is the only file you need to touch to reskin the page's *content*.
app.get('/api/profile', (req, res) => {
  const profile = readJSON(PROFILE_PATH, {});
  res.json(profile);
});

// Increments and returns the view counter. Called once per page load client-side.
app.post('/api/views', (req, res) => {
  const stats = readJSON(STATS_PATH, { views: 0 });
  stats.views += 1;
  writeJSON(STATS_PATH, stats);
  res.json(stats);
});

app.get('/api/views', (req, res) => {
  const stats = readJSON(STATS_PATH, { views: 0 });
  res.json(stats);
});

app.get('/healthz', (req, res) => res.status(200).send('ok'));

app.listen(PORT, () => {
  console.log(`glass-biolink listening on port ${PORT}`);
});
