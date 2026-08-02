# glass — an invite-gated, liquid-glass bio-link page

A two-page site: a private "access terminal" gate (headline, invite-code
prompt, member ledger) sits in front of a single-profile bio-link card
(cursor-reactive spotlight, tilting glass card, ambient glow, typewriter
tagline, floating audio player). Plain Node/Express + static frontend — no
database, no build step, no real auth system. Deploys straight to Railway.

**Heads up on the gate:** the invite code is a vibe/flavor gate, not real
access control. Codes live in a plaintext JSON file on the server and the
member ledger is public — anyone can view-source it. Don't put anything
behind it that actually needs to stay private.

## Project structure

```
.
├── server.js               Express server: serves /public and a tiny JSON API
├── package.json
├── railway.json             Railway build/deploy config
├── Procfile                  fallback start command
├── config/
│   ├── site.json            ← EDIT THIS for the gate's brand, headline, DM link
│   ├── members.json         ← EDIT THIS for the "who's already in" ledger
│   ├── invites.json         ← EDIT THIS for valid invite codes
│   ├── profile.json         ← EDIT THIS to reskin the profile card
│   └── stats.json           view counter storage (auto-created/updated)
└── public/
    ├── index.html             the invite gate (served at /)
    ├── profile.html           the profile card (served at /profile.html)
    ├── css/
    │   ├── landing.css       gate styles
    │   └── style.css         profile card styles
    └── js/
        ├── landing.js        gate behavior (invite check, ledger render)
        └── main.js            profile card behavior
```

## Customizing the gate

Everything on the landing page lives in **`config/site.json`**:

| Field | What it does |
|---|---|
| `brand` | Shown in the top bar and footer |
| `headline` | Array of 1–2 short lines for the big display headline |
| `subhead` | The line under the headline |
| `discordHandle` | Text shown in the "dm ___ on discord" link |
| `discordUrl` | Where that link points |

**`config/members.json`** drives the "who's already in" ledger — an array of
`{ "uid": "0000", "handle": "name", "url": "https://..." }`. `url` can point
anywhere, including `/profile.html` for your own card.

**`config/invites.json`** is `{ "codes": ["word1", "word2"] }` — anyone who
types a matching code (case-insensitive) gets redirected to
`/profile.html`. Add or remove codes freely; there's no limit.

## Customizing the profile card

Everything on the card lives in **`config/profile.json`** — see the table
below, unchanged from before:

| Field | What it does |
|---|---|
| `username`, `displayName` | Your handle and display name |
| `tagline` | Static line under your name |
| `typedLines` | Array of lines the typewriter cycles through |
| `avatar` | URL to your avatar image |
| `status` | `online` / `idle` / `dnd` / `offline` — colors the status dot |
| `accent`, `accent2` | Hex colors — drive the glass tint, glow, and gradients |
| `background` | `{ "type": "gradient" }` (default) or `{ "type": "image", "value": "<url>" }` |
| `audio` | `{ "enabled": true, "title": "...", "url": "<mp3 url>" }` — powers the floating player |
| `socials` | Array of `{ label, url, icon }` — icons: `discord`, `x`, `github`, `instagram`, `twitch`, `link` |
| `links` | Array of `{ label, url, icon }` — icons: `link`, `cart`, `youtube`, or any social icon name |
| `badges` | Small pill labels under your name |

Save any config file and refresh — everything is read live, no rebuild
required.

## Running locally

```bash
npm install
npm start
```

Visit `http://localhost:3000` for the gate, or `http://localhost:3000/profile.html`
to jump straight to the card while you're editing.

## Deploying on Railway

1. Push this repo to GitHub (or GitLab).
2. In Railway: **New Project → Deploy from GitHub repo**, pick this repo.
   If your files live in a subfolder of the repo (not the root), set
   **Settings → Source → Root Directory** to that subfolder — Railway's
   builder needs `package.json` at whatever it treats as the root.
3. Railway auto-detects Node and runs `npm install` then `npm start` (both
   `railway.json` and `Procfile` are included so this works regardless of
   which build path Railway picks).
4. Railway sets `PORT` automatically — `server.js` already reads
   `process.env.PORT`, so nothing to configure there.
5. Once deployed, open the generated `*.up.railway.app` domain, or attach a
   custom domain in **Settings → Domains** (add the CNAME + TXT records
   Railway gives you at your domain's DNS provider, not in Railway itself).

No database service, no extra environment variables required.

## Notes on the view counter

The counter persists to `config/stats.json` on disk. Railway's filesystem is
ephemeral across redeploys (a fresh deploy resets it), but it survives normal
uptime/restarts in between. For a counter that survives redeploys, swap
`readJSON`/`writeJSON` in `server.js` for a Railway **Postgres** or **Redis**
plugin — the API surface can stay the same.

## Extending it

- **Real invite security**: right now `config/invites.json` is a flat file
  anyone with server access can read, and codes aren't tied to who used them.
  A real system would need per-invite tokens, single-use tracking, and
  probably a small database — a bigger project than this static-ish site,
  happy to help scope that separately.
- **Real Discord presence**: would need a small Discord bot with the
  `GUILD_PRESENCES` intent posting status into a KV store that `main.js`
  polls. The `status` field in `profile.json` is already wired up to the
  status dot if you want to update it manually or via a cron job hitting a
  new API route.
- **Multiple profiles / accounts**: this is intentionally a single-profile
  site behind the gate. Turning it into a multi-user platform means adding
  auth + a real database per user.
