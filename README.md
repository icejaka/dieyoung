# glass — a liquid-glass bio-link page

A single-profile "link in bio" page in the style of guns.lol / urgay.lol, styled
with a frosted-glass, spatial UI (cursor-reactive spotlight, tilting glass card,
ambient glow, typewriter tagline, floating audio player). Plain Node/Express +
static frontend — no database, no build step, no auth system. Deploys straight
to Railway.

## Project structure

```
.
├── server.js              Express server: serves /public and a tiny JSON API
├── package.json
├── railway.json            Railway build/deploy config
├── Procfile                 fallback start command
├── config/
│   ├── profile.json        ← EDIT THIS to reskin your page (name, links, colors…)
│   └── stats.json          view counter storage (auto-created/updated)
└── public/
    ├── index.html            page shell
    ├── css/style.css        the glass/spatial design system
    └── js/main.js            renders profile.json into the page + interactions
```

## Customizing your page

Everything you'd want to change lives in **`config/profile.json`** — no code
edits needed:

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

Save the file and refresh — everything is read live from `config/profile.json`,
no rebuild required.

## Running locally

```bash
npm install
npm start
```

Visit `http://localhost:3000`.

## Deploying on Railway

1. Push this repo to GitHub (or GitLab).
2. In Railway: **New Project → Deploy from GitHub repo**, pick this repo.
3. Railway auto-detects Node via Nixpacks and runs `npm install` then `npm start`
   (both `railway.json` and `Procfile` are included so this works regardless of
   which build path Railway picks).
4. Railway sets `PORT` automatically — `server.js` already reads `process.env.PORT`,
   so you don't need to configure anything.
5. Once deployed, open the generated `*.up.railway.app` domain (or attach a
   custom domain in the Railway dashboard's **Settings → Domains**).

That's it — no database service, no extra environment variables required.

## Notes on the view counter

The counter persists to `config/stats.json` on disk. Railway's filesystem is
ephemeral across redeploys (a fresh deploy resets it), but it survives normal
uptime/restarts in between. If you want a counter that survives redeploys,
swap `readJSON`/`writeJSON` in `server.js` for a Railway **Postgres** or
**Redis** plugin — the API surface (`GET /api/views`, `POST /api/views`) can
stay exactly the same.

## Extending it

- **Real Discord presence** (like guns.lol's live status): would need a small
  Discord bot with `GUILD_PRESENCES` intent posting your status into
  `stats.json` or a tiny KV store, which `main.js` then polls. Out of scope
  here, but the `status` field in `profile.json` is already wired up to the
  status dot if you want to update it manually or via a script/cron hitting
  a new API route.
- **Multiple profiles / accounts**: this is intentionally a single-profile
  site (one `profile.json`). Turning it into a multi-user platform means
  adding auth + a real database per user — a much bigger project than a
  Railway-deployable static-ish site, happy to help scope that separately if
  you want it.
