# Copilot instructions for this repository

This file helps AI coding assistants become productive quickly in this repo by documenting the architecture, important files, developer workflows, and common pitfalls.

## Big picture
- This is a small static + API demo: static HTML/CSS/JS files live in the repo root and `pages/`; a minimal Express API provides a single POST endpoint that persists submissions to `data.json`.
- The API is implemented in `server.js` and listens on port `3000` by default. The client pages call that API (see `app.js`).

## Key files
- `server.js` — Express API that accepts POST requests and writes to `data.json`.
- `data.json` — simple JSON file used as persistent storage (an array of recipe objects).
- `pages/suggest.html` — form-based UI for submitting recipes.
- `app.js` — client-side form handler that `fetch`es `http://localhost:3000/recipes` and shows status messages.
- `index.html`, `pages/recipe.html` — static content pages.
- `index.js` — DOM-manipulating JS that appears to be experimental/unused on some pages (client-side dynamic form). Note: `index.js` posts to `/addRecipe` which is inconsistent with the server endpoint.
- `package.json` — has `start` script set to `node index.js` (likely incorrect for starting the API server).

## How to run locally (recommended)
1. Install dependencies:

   ```powershell
   npm install
   ```

2. Start the API server (explicit):

   ```powershell
   node server.js
   ```

3. Serve the static files (open `pages/suggest.html` or `index.html` through an HTTP server). You can run a simple static server from the repo root in another terminal:

   ```powershell
   npx serve .
   # or
   python -m http.server 8080
   ```

4. Open `http://localhost:5000/pages/suggest.html` (or the port printed by your static server) and submit the form. The form posts to `http://localhost:3000/recipes` by `app.js`.

Notes: `npm start` currently runs `node index.js` (a client-side script) and will not start the Express API. If you want `npm start` to run the server, update `package.json` to use `node server.js`.

## API surface and data contract
- Endpoint: `POST http://localhost:3000/recipes`
- Request body: JSON with fields used by `app.js` (example):

```json
{
  "recipeName": "...",
  "ingredients": "...",
  "yourName": "...",
  "yourEmail": "...",
  "agreedToTerms": true
}
```

- Server behavior: reads `data.json` (creates empty array if missing or malformed), pushes the new object augmented with `createdAt` ISO timestamp, and writes back the array.

## Project-specific conventions & gotchas
- Single-file persistence: `data.json` is the canonical storage — tests and features expect it to be an array of objects.
- Endpoint naming mismatch: older/unused `index.js` uses `fetch('/addRecipe')` while the active client (`app.js`) uses `http://localhost:3000/recipes`. When modifying client or server, make the endpoint naming consistent.
- Static vs API serving: static pages are not served by `server.js` (server only implements the POST); when testing in-browser use a static server instead of opening files via `file://`.
- Port: API uses port `3000`. If you change it, update `app.js` or use relative paths and a reverse proxy when serving both app and API together.

## Common debugging steps (what to try first)
- If `node server.js` fails: run `npm install` first, ensure no other process is bound to port `3000`, and check that your Node version is compatible with Express v5.
- If the form UI can't reach the API: ensure you have a static server running (not `file://`) and the API server running on `localhost:3000`.
- If submissions are not saved: inspect `data.json` for valid JSON. The server resets to an empty array on parse errors.

## Small code suggestions (examples you can apply)
- Make `npm start` launch the server (optional): in `package.json` set:

```json
"scripts": {
  "start": "node server.js"
}
```

- Align client route (if you prefer changing `index.js` instead of server): change `fetch('/addRecipe', ...)` to `fetch('/recipes', ...)`.

## Where to look for more context
- Use `app.js` and `pages/suggest.html` to understand the intended client flow.
- Use `server.js` to see the exact persistence behavior.

If any of these notes are unclear or you'd like me to (a) update `package.json` to fix `npm start`, (b) make the client/server endpoints consistent automatically, or (c) add simple automated checks, tell me which and I'll prepare a focused patch.
