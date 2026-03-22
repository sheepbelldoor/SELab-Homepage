# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SELab-Homepage is a research lab website built with Next.js 16 (App Router). It has two main areas:

1. **Public Homepage** — freely accessible pages (Home, About, People, Research, Publications, Projects, News & Notice, Join Us, Contact)
2. **Admin Dashboard** (`/admin/*`) — authenticated management interface for a single admin user

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database (npx tsx prisma/seed.ts)
npm run db:studio    # Open Prisma Studio
npx prisma generate  # Regenerate Prisma client after schema changes
```

## Tech Stack

- **Framework**: Next.js 16, TypeScript, React 19
- **Styling**: Tailwind CSS 4
- **Database**: SQLite via Prisma 5 (prisma-client-js)
- **Auth**: NextAuth.js v4 (credentials provider, JWT strategy)
- **Admin default credentials**: admin / admin1234

## Architecture

### Route Groups
- `src/app/(public)/` — public pages with shared Navbar + Footer layout
- `src/app/admin/login/` — standalone login page (no sidebar)
- `src/app/admin/(dashboard)/` — admin pages with shared sidebar layout
- `src/app/api/` — REST API routes for all CRUD operations

### Key Files
- `prisma/schema.prisma` — database models (Admin, Post, Member, Publication, Project, Research, SiteConfig)
- `src/lib/prisma.ts` — singleton PrismaClient
- `src/lib/auth.ts` — NextAuth config
- `src/lib/admin-check.ts` — API route auth guard
- `src/middleware.ts` — protects `/admin/*` routes (except login)

### Data Flow
- Public pages are server components that query Prisma directly (`force-dynamic`)
- Admin list pages are client components that fetch from `/api/*` routes
- All mutation API routes check auth via `requireAdmin()`
- `SiteConfig` (single row, id="main") stores site-wide settings (lab name, tagline, about, contact, join us content)

### Database Models
- **Post**: news/notice with category, published/pinned flags
- **Member**: lab members grouped by role (professor, postdoc, phd, ms, intern, alumni), sorted by sortOrder
- **Publication**: papers grouped by year, with featured flag and links (PDF/DOI/code/video)
- **Project**: ongoing/completed status, featured flag
- **Research**: research areas with sortOrder
