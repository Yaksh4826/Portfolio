# Yaksh Portfolio (Next.js)

Personal portfolio site built with **Next.js 16**, React 19, Tailwind CSS 4, Framer Motion, and optional integrations (MongoDB, Cloudinary, Discord webhook, admin area).

---

## Safe code retrieval and adapting this project

Use this section if you are **cloning or forking** this repo to run it locally or ship your own version.

### Get the code safely

- **Trusted source only**: Clone or fork from the repository you trust (the author’s remote, or your own fork after you control access). Avoid copying project folders from strangers or unverified downloads.
- **Verify what you run**: After `git clone`, skim recent commits and `package.json` scripts before `npm install`. Malicious repos sometimes hide install-time scripts; this project uses standard Next.js scripts (`dev`, `build`, `start`, `lint`) only.
- **Do not reuse someone else’s secrets**: If you obtain a copy of the project that includes `.env`, `.env.local`, or any file with API keys, **treat those as compromised**. Create **new** credentials in your own accounts and rotate anything that was shared.

### Secrets and environment files

- **Never commit** API keys, database URIs, or webhook URLs. This repo’s `.gitignore` ignores `.env*` files on purpose.
- **Local config**: Create `.env.local` in the project root (same folder as `package.json`). Next.js loads it automatically for development. For production (e.g. Vercel), set the same variables in the host’s environment UI—**not** in the repo.
- **Generate your own values**:
  - `ADMIN_SECRET_KEY`: a long random string you alone know (used for admin login).
  - New MongoDB user/password, new Cloudinary keys, new Discord webhook if you use those features.

### What to change for “your” portfolio

- **Copy and replace**: Treat this codebase as a **template**—swap copy, images, project data, routes, and styling to match your brand.
- **Search for personal hooks**: Look for hardcoded names, URLs, or `yaksh_portfolio`-style defaults (e.g. Cloudinary upload folder fallback in `app/lib/cloudinaryUpload.js`) and update them.
- **Public vs server-only**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Keep secrets **without** that prefix.

---

## Prerequisites

- **Node.js** (LTS recommended; align with what your deployment target supports)
- **npm** (this repo includes `package-lock.json` for reproducible installs)

---

## Setup
Make a folder and enter this in the VS Code command line

```bash
git clone <your-fork-or-repo-url> .
cd yaksh_portfolio
npm ci
# or: npm install
```

Create `.env.local` with the variables you need (see table below). Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required for | Notes |
|----------|----------------|-------|
| `ADMIN_SECRET_KEY` | Admin login (`/admin/login`) | Server-only; must be set for admin auth to work. |
| `MONGODB_URI` | Database-backed features | Server-only. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary uploads | Server-only. |
| `CLOUDINARY_UPLOAD_FOLDER` | Cloudinary folder | Optional; defaults if unset (change default for your project). |
| `DISCORD_WEBHOOK_URL` | Contact form notifications | Server-only. |
| `EMAIL`, `MOBILE_NO` | Contact / hero display | Server-side usage in app code; keep out of client bundles where not needed. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs / metadata | Public. |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | Hero video | Public. |
| `NEXT_PUBLIC_VERCEL_URL` | Usually set by Vercel | Public preview URL helper. |

Omit variables for features you do not use; some code paths may require them only when that feature runs (e.g. admin requires `ADMIN_SECRET_KEY`).

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |

---

## Deploy

Deploy like any Next.js app (e.g. [Vercel](https://vercel.com/docs)). Configure the same environment variables in the dashboard—**never** paste secrets into the README or committed files.

---

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Next.js learn](https://nextjs.org/learn)
