# Adanola — Editorial Fashion E‑Commerce

Full-stack **MERN** storefront built from the Adanola `DESIGN.md` editorial lookbook system.

| Layer | Stack |
|-------|--------|
| Frontend | React 18 + Vite + CSS design tokens |
| Backend | Express (Node) API |
| Database | MongoDB (Atlas) — memory seed fallback without URI |
| Images | **Cloudinary** (upload + optional seed re-host) |
| Deploy | **Vercel** (static client + serverless API) |

Design language: white paper, carbon ink, Favorit/Inter, ghost CTAs, zero shadows, 4-column product grids, full-bleed editorial photography.

---

## Status

**Draft v1 complete** — full storefront + API runnable locally without Mongo/Cloudinary.
Wire `MONGODB_URI` + Cloudinary for production data/images.

## Quick start (local)

```bash
cd adanola
# .env already scaffolded; optional: fill MONGODB_URI + Cloudinary keys

npm run install:all
npm run dev
```

- Storefront: http://localhost:5173  
- API: http://localhost:5000/api/health  

Without `MONGODB_URI`, the API serves the in-memory product catalogue (12 products) so you can develop immediately.

### Seed MongoDB (+ optional Cloudinary host)

```bash
# in .env: MONGODB_URI, optional CLOUDINARY_*
npm run seed
```

If Cloudinary credentials are present, seed re-uploads product photos into your `CLOUDINARY_FOLDER` and stores `secure_url` + `public_id` on each product.

---

## Environment

| Variable | Where | Purpose |
|----------|--------|---------|
| `MONGODB_URI` | server / Vercel | MongoDB Atlas connection |
| `JWT_SECRET` | server / Vercel | Auth token signing |
| `CLOUDINARY_CLOUD_NAME` | server / Vercel | Image CDN |
| `CLOUDINARY_API_KEY` | server / Vercel | Upload API |
| `CLOUDINARY_API_SECRET` | server / Vercel | Upload API |
| `CLOUDINARY_FOLDER` | server | Default `adanola` |
| `CLIENT_URL` | server | CORS origin(s) |
| `VITE_API_URL` | client | API base (default `/api` via proxy) |

---

## API surface

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | Service + config flags |
| GET | `/api/products` | `category`, `tag`, `q`, `featured`, `trending`, `sort`, `limit` |
| GET | `/api/products/site` | Hero, editorial, filters |
| GET | `/api/products/:idOrSlug` | Detail + related |
| POST | `/api/auth/register` | name, email, password |
| POST | `/api/auth/login` | email, password |
| GET | `/api/auth/me` | Bearer token |
| GET/POST/DELETE | `/api/wishlist/:productId` | Auth |
| POST | `/api/orders` | Checkout (demo) |
| GET | `/api/upload/status` | Cloudinary configured? |
| POST | `/api/upload` | Admin multipart image → Cloudinary |

---

## Deploy on Vercel

1. Push this repo (or the `adanola` folder) to GitHub.
2. Import the project in Vercel — root directory `adanola` if nested.
3. Set environment variables (Mongo + JWT + Cloudinary).
4. Build settings:
   - Install: `npm run install:all`
   - Build: `npm run build`
   - Output: `client/dist` (or use `vercel.json` builds)
5. `vercel.json` routes `/api/*` → `server/api/index.js` and the SPA from the client build.

For a simpler single-project layout you can also deploy **client** and **server** as two Vercel projects and point `VITE_API_URL` at the API domain.

---

## Design compliance (web-design skill)

- Spec first: `DESIGN.md` is the source of truth.
- CSS variables only for brand colours (no ad-hoc hex in components).
- Ghost primary CTA, filled Quick Add, 0px image radius, 4px button radius.
- Flat elevation (no box-shadows).
- L1/L2 motion: hero fade-in, marquee strip, scroll reveal, soft image scale — with `prefers-reduced-motion` fallbacks.
- Photography-first imagery (Unsplash seed; production via Cloudinary).

---

## Project layout

```
adanola/
├── DESIGN.md
├── vercel.json
├── client/                 # React SPA
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── styles/         # tokens + components
│       └── lib/api.js
└── server/                 # Express API
    ├── api/index.js        # Vercel entry
    ├── models/
    ├── routes/
    ├── lib/cloudinary.js
    └── seed/
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Client + API concurrently |
| `npm run build` | Production client build |
| `npm run seed` | Seed Mongo (+ Cloudinary host) |
| `npm run install:all` | Install root, client, server deps |
