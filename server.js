const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const PROFILE_PATH = path.join(__dirname, 'config', 'profile.json');
const STATS_PATH = path.join(__dirname, 'config', 'stats.json');
const MEMBERS_PATH = path.join(__dirname, 'config', 'members.json');
const INVITES_PATH = path.join(__dirname, 'config', 'invites.json');
const SITE_PATH = path.join(__dirname, 'config', 'site.json');

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
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---- API ----

// Returns the editable profile content (config/profile.json).
// This is the only file you need to touch to reskin the profile card's *content*.
app.get('/api/profile', (req, res) => {
  const profile = readJSON(PROFILE_PATH, {});
  res.json(profile);
});

// Returns the editable landing-gate content (config/site.json): brand,
// headline lines, subhead copy, and the discord DM link shown when someone
// doesn't have a code.
app.get('/api/site', (req, res) => {
  const site = readJSON(SITE_PATH, {});
  res.json(site);
});

// Returns the "access log" member ledger shown on the landing gate
// (config/members.json). Each entry is { uid, handle, url }.
app.get('/api/members', (req, res) => {
  const members = readJSON(MEMBERS_PATH, []);
  res.json(members);
});

// Checks a submitted invite code against config/invites.json.
// NOTE: this is a vibe/flavor gate, not real access control — the codes live
// in a plaintext file on the server and anyone can view-source the ledger.
// Don't put anything behind this that actually needs to be private.
app.post('/api/invite/verify', (req, res) => {
  const code = (req.body && typeof req.body.code === 'string') ? req.body.code.trim().toLowerCase() : '';
  const invites = readJSON(INVITES_PATH, { codes: [] });
  const codes = Array.isArray(invites.codes) ? invites.codes : [];
  const valid = code.length > 0 && codes.some((c) => String(c).trim().toLowerCase() === code);
  res.json({ valid });
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
  console.log(`glass listening on port ${PORT}`);
});
