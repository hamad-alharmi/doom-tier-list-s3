# DOOM SMP — Tier List (Season 3)

Public PvP tier list site with an in-page admin editor. Static site + one
serverless function + Redis. Deploys to Vercel in minutes.

## Features
- Overall #1–N board with per-gamemode tier chips
- Tier list (S+ → F + N/A) with player cards
- Player profile popups (overall + all 5 gamemode tiers, NameMC link)
- Admin editor: players, tiers, bracket — password protected, saves live
- Live Mojang skin lookup while typing an IGN (NameMC-style)

## Deploy
1. Push this repo to GitHub (or use "Import Repository" on Vercel directly).
2. [vercel.com/new](https://vercel.com/new) → import the repo → Deploy.
3. In the Vercel project: **Storage → Create Database → Redis (Upstash)** →
   connect it to this project. This auto-adds the REST URL + token env vars.
4. **Settings → Environment Variables** → add `ADMIN_PASSWORD` with the real
   password.
5. **Deployments → ⋯ → Redeploy** (required so the new env vars attach).
6. Open the site → EDIT → log in → SAVE LIVE. Check an incognito window
   sees the change — done.

## Local dev
npm i -g vercel
vercel link
vercel env pull .env.local   # pulls ADMIN_PASSWORD + database creds
vercel dev                   # http://localhost:3000

## Notes
- Without a database connected, the site still works — SAVE LIVE then only
  persists in your own browser.
- The `ADMIN_PASSWORD` constant inside index.html is only a fallback for
  opening the file locally with no backend. Production checks the env var.