# Technical Setup Guide

## Overview

This document explains how to set up, run, and maintain the **Dr. Clinic Template** from a developer’s perspective.  It assumes you are comfortable with Node.js, TypeScript, React, and basic DevOps concepts.

---

## 1. Technology Stack

| Layer               | Technology |
| ------------------- | ---------- |
| Front-end Framework | React 18 + Vite |
| Language            | TypeScript 5 |
| Styling             | Tailwind CSS 3 + @tailwindcss/typography |
| State / Data        | React context + hooks |
| Backend-as-a-Service| Supabase (PostgreSQL + Storage + Auth) |
| Date utilities      | date-fns & date-fns-tz |
| Animations / UI     | Framer Motion, Keen Slider, Embla Carousel |
| Forms & Validation  | React-Hook-Form (light custom wrapper) |
| SEO                 | react-helmet-async + structured data helpers |
| Build Tool          | Vite 5 |
| Linting             | ESLint 9 + Typescript-ESLint |
| Deployment          | Vercel (default) – any static host works |

---

## 2. Prerequisites

1. **Node.js ≥ 18** (LTS recommended)
2. **npm ≥ 9** or **pnpm / yarn**
3. A **Supabase** account – free tier is sufficient
4. (Optional) **Git** for version control

---

## 3. Clone & Install

```bash
# 1. Fork / clone the repository
$ git clone <your-fork-url>
$ cd dr-clinic-template

# 2. Install dependencies
$ npm install    # or yarn / pnpm
```

---

## 4. Environment Variables

Create a `.env` file in the project root (never commit this file).

```bash
# .env
VITE_SUPABASE_URL     = https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY = <public-anon-key>
```

You can obtain these values from **Project → Settings → API** in the Supabase dashboard.

---

## 5. Supabase Bootstrap

All database tables, policies, and seed data are defined in `supabase-setup.sql`.

1. Open Supabase → **SQL Editor**.
2. Paste the contents of `supabase-setup.sql` and run the script.
3. Follow additional steps in `SUPABASE-SETUP.md` for Storage bucket & default credentials.

After running the script you will have:

- `appointments`, `users`, `contact_messages`, etc.
- Row-Level-Security policies for public and admin roles.
- Dummy **admin** account (email: `admin@example.com`, password: `changeme`).

---

## 6. Local Development

```bash
# Start dev server (hot reload, port 5173 by default)
$ npm run dev
```

Visit `http://localhost:5173`.

### Available Scripts

| Command        | Purpose                                         |
| -------------- | ------------------------------------------------ |
| `npm run dev`  | Vite dev server                                 |
| `npm run build`| Production build (static assets → `/dist`)      |
| `npm run preview` | Preview production build locally              |
| `npm run lint` | ESLint check (uses project eslint.config.js)    |

---

## 7. Project Layout

```
src/
├── components/      # Reusable UI + feature modules
│   ├── admin/       # Admin dashboard & sub-modules
│   ├── appointment/ # Public appointment booking flow
│   └── landing/     # Marketing landing page sections
├── config/          # Business data, SEO defaults, structured data helpers
├── hooks/           # Custom React hooks
├── i18n/            # Translation strings & context provider
├── lib/             # Supabase client + misc helpers
├── utils/           # Pure utility modules (image download, markdown…)
└── theme/           # Design tokens (colors)
```

---

## 8. Internationalisation (i18n)

The app ships with a minimal custom i18n layer to avoid bundle size bloat.

* `src/i18n/LanguageContext.tsx` – React context storing current language.
* `src/i18n/translations/*`     – Locale JSON (typed with TS interfaces in `types/`).
* `src/i18n/useTranslation.ts`  – Hook to fetch messages.

To add a new language:

1. Duplicate the translation files, e.g. `en → es`.
2. Update `src/i18n/translations/index.ts` export map.
3. Add the locale to `LanguageToggle` component.

---

## 9. Styling & Theming

Tailwind is configured in `tailwind.config.js` with custom fonts and typography plugin.

*Global colors* live in `src/theme/colors.ts`.  Override or extend to quickly reskin the template.

---

## 10. Deployment

### Vercel (recommended)

1. Push your repo to GitHub.
2. Import in Vercel → **New Project**.
3. Set the two environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Build command: `npm run build`
5. Output directory: `dist`

Because Vite builds a static SPA, any static host (Netlify, Cloudflare Pages, S3, etc.) works equally well.

---

## 11. Linting & Formatting

ESLint is pre-configured; run `npm run lint` to check.  We recommend enabling the ESLint VS Code extension for inline feedback.

---

## 12. Testing (TODO)

Unit and integration tests are **not** yet included. Suggested stack:

- Jest + @testing-library/react for components
- Cypress or Playwright for end-to-end flows (book appointment, admin CRUD)

---

## 13. Troubleshooting

| Symptom                           | Possible Cause & Fix                                    |
| --------------------------------- | ------------------------------------------------------- |
| *`401 Unauthorized`* from Supabase| Check row-level policies and Public/Service roles        |
| Images not loading                | Confirm Storage bucket **notices** is public-read       |
| Build fails on Vercel             | Ensure env vars are set in **Production** scope         |
| `TypeError: supabase.auth` …      | Mismatched Supabase JS version – run `npm audit fix`    |

---

## 14. Contribution Guidelines

1. Create a feature branch: `git checkout -b feat/<name>`
2. Keep PRs small and focussed.
3. Run `npm run lint` before pushing.
4. Squash and merge after review.

---

## 15. License

Specify your preferred license (e.g. MIT, GPL) here.

---

> **Happy coding!** 