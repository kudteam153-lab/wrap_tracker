# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Wrap Tracker is a mobile-first PWA for logging car-wrap jobs (оклейка авто): per-job pricing from customer price lists, a filtered job list, and a revenue dashboard. There is no backend. All data lives in the browser's `localStorage`. The UI and all user-facing strings are in Russian.

Stack: React 18, Vite 5, Tailwind 3, vite-plugin-pwa (Workbox, `autoUpdate`), recharts for charts and lucide-react for icons. Plain JSX, no TypeScript.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to dist/
npm run preview    # serve the production build (needed to test the service worker/PWA)
VITE_BASE='/wrap-tracker/' npm run build   # build for a GitHub Pages subpath
```

The project has no tests, linter or formatter.

## Deployment

On every push to `main`, `.github/workflows/deploy.yml` builds and deploys to GitHub Pages. It sets `VITE_BASE=/<repo-name>/` and copies `index.html` to `404.html` as the SPA fallback. `vite.config.js` reads `VITE_BASE` and passes it to Vite's `base`, the manifest's `start_url`/`scope` and Workbox's `navigateFallback`. Any new asset path must respect `base`. Vercel/Netlify deploys use `base = '/'`.

## Architecture

Almost all of the app is in one file, `src/App.jsx`, which has sections marked with `// ============ ... ============` banners:

- **Reference data**: `CAR_CATALOG` (brand → models, flattened into `FLAT_CARS`), the default price profiles `STUDIO_PRICE` / `DEALER_PRICE` and `DEFAULT_CLIENTS`.
- **Persistence helpers**: `KEYS`, `load` and `save` (JSON in `localStorage`), plus `compressImage`, which resizes photos to JPEG data URLs that are stored inline in jobs.
- **Screens**: `JobForm` (create and edit), `JobList`, `Stats`, and `SettingsScreen` / `PriceEditor`, plus the helper components `CarCombobox` and `NewClientModal`.
- **`App` root**: owns all state (`jobs`, `clients`, `profiles`, `customCars`, the active `tab`, `editingJobId`). Every mutation updates React state and calls `save()` in the same handler. There is no sync effect, so new mutations must follow the same pattern. `App` also installs a global `focusin` and `visualViewport` resize handler that scrolls focused inputs into view above the mobile keyboard.

### Voice agent

`src/agent.js` exports `parseJob(text, { apiKey, clients, profiles, cars })`. It calls the Claude API straight from the browser (`dangerouslyAllowBrowser`) with structured JSON output, then sanitizes the result against the selected client's price list, so element and complex ids that don't exist there are dropped and reported in `notes`. Speech-to-text is the phone keyboard's own dictation; the app only gets text. `VoiceInput` in `App.jsx` lazy-imports the module so the SDK isn't in the main bundle, and `JobForm.applyParsed` writes the result into the form for the user to review. Nothing is saved automatically. The user's API key is stored in `localStorage` under `anthropic_api_key` and set in Settings.

### Data model

- `localStorage` keys: `jobs_v2`, `clients_v2`, `profiles_v2`, `custom_cars` and `anthropic_api_key`. If you change a stored shape incompatibly, bump the key suffix; there is no migration layer.
- **Price profile**: `{ id, name, complex: [item], elements: [item] }`, item = `{ id, name, price, priceMax?, section?, note? }`. A complex is a package (a job can have several); elements are priced per piece. `price` is the default (lower bound), `priceMax` marks a range; the per-job price is entered in the form. The UI groups items by `section`.
- **The user's real price list must never be committed** (the repo and the site are public). It's loaded on the device via Settings → «Импорт из файла» from a `{ type: 'wrap-tracker-prices', profiles }` JSON; Settings also exports/restores a full `wrap-tracker-backup`.
- **Client**: `{ id, name, priceProfileId, isDefault? }`. Each custom client gets its own profile, cloned from a base profile when the client is created. Deleting a profile also deletes its clients.
- **Job**: `{ id, createdAt, updatedAt?, startDT, endDT, clientId, orderNumber, car, photos[], priceProfileId, complexIds?, complexPrices?: {complexId: price}, elementCounts: {elementId: qty}, elementPrices?: {elementId: price}, lines?, share, manualTotal, baseTotal, finalTotal, comment }`. `lines` (`[{kind, name, qty, price}]`) is a snapshot taken at save time, and also on price import for older jobs, so jobs keep readable items after a price list is replaced; `JobList` prefers it over id lookups. Jobs saved before multi-complex support have a single `complexId`/`complexPrice`; `jobComplexes()` normalizes both shapes. Each job saves the computed `baseTotal`/`finalTotal`, and the list and stats read these saved values, so editing a price list later does not recompute old jobs. `share` is the worker's cut (1, 0.5, 0.333 or a custom percent). `manualTotal` overrides the computed price.
- A job allows at most 5 photos. They are stored as base64 strings, which takes up `localStorage` quota quickly.

### Styling

Tailwind utilities are combined with CSS custom-property design tokens (`--bg`, `--ink`, `--accent`, `--radius` and others) and global component classes defined in `src/index.css`. Reuse those tokens and classes rather than adding new hard-coded colors.
