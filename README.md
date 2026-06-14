# Nagma Tours&Travels — Drop Taxi Website

Animated cab-booking website built with **Next.js 16 + Tailwind CSS v4 + Framer Motion + MongoDB + Cloudinary** — a single Next.js application (one port, no separate server). Bookings open **WhatsApp** with the trip details pre-filled; the team calls the customer back and collects payment manually.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — site. http://localhost:3000/admin — admin panel.

## Environment (.env.local — never committed)

| Variable | Purpose |
|---|---|
| `TAXI_MONGODB_URI` | MongoDB Atlas connection string (named with TAXI_ prefix because this machine has an unrelated global `MONGODB_URI`) |
| `MONGODB_DB` | Database name (`nagma_taxi`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image hosting for car photos |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin panel login — **change the password!** |
| `AUTH_SECRET` | Signs the admin session cookie |

## Admin panel (/admin)

Everything on the site is editable from the dashboard — saved in MongoDB, live immediately:

- **Business Info** — name, tagline, phone, WhatsApp number, email, regions
- **Theme & Colours** — 9 colour presets (amber, orange, red, rose, emerald, teal, sky, blue, violet) + default light/dark mode for first-time visitors
- **Vehicles & Tariff** — add/edit/remove vehicles, rates, bata, tags, and **upload car images** (stored on Cloudinary)
- **Popular Routes** — add/edit/remove route cards with km/time/fare

On first run the database auto-seeds with the default content.

## How booking works

1. Customer types pickup & drop address (plain text boxes), picks vehicle and date
2. If the addresses contain known cities, live road distance + fare estimate is shown (OSRM routing, offline fallback)
3. "Book on WhatsApp" opens WhatsApp with the full booking message → you call back and confirm

Floating **Call** and **WhatsApp** buttons stay on the right edge of every screen.

## Notes

- Default car images were sourced from Wikimedia Commons (CC licenses) and background-removed; they live in your Cloudinary account under `taxi-website/cars`. Replace them anytime from the admin panel.
- The DB connection uses a non-SRV connection string because this machine's DNS blocks SRV lookups. The standard `mongodb+srv://...` string also works when deployed (e.g. on Vercel) — both are fine.
- Deploying to Vercel: import the repo, add the same env variables in Project Settings → Environment Variables.
