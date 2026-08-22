# Developer Portfolio & Agency CMS

Enterprise-grade, fully dynamic Developer Portfolio with a Headless Admin CMS Control Panel.

## Stack

- **Next.js 14** (App Router, Server Actions, ISR)
- **Tailwind CSS** + CSS Variables (dynamic theme injection)
- **Supabase** (PostgreSQL, Auth, Storage)
- **Framer Motion**, **Lucide Icons**, **Shadcn-style UI**
- **React Query** + **Zustand**

## Features

- **100% dynamic frontend** — all text, colors, images, and section visibility from Supabase
- **Live theme system** — admin-controlled accent colors, backgrounds, typography
- **Admin CMS** at `/admin` with 5 management tabs:
  - Hero Section Editor
  - Section & Styling Manager
  - Portfolio & Product Ecosystem CMS
  - Client Case Studies
  - Footer & Socials Editor
- **ISR caching** — 60-second revalidation for lightning-fast loads
- **Secure admin** — Supabase Auth + middleware protection

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Create a **public** storage bucket named `cms-assets`
4. Create an admin user in Authentication → Users

### 3. Environment variables

Copy `.env.local.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run

```bash
npm run dev
```

- **Public site:** [http://localhost:3000](http://localhost:3000)
- **Admin CMS:** [http://localhost:3000/admin](http://localhost:3000/admin)

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Public portfolio (ISR)
│   └── admin/              # CMS dashboard
├── components/
│   ├── admin/              # CMS editor components
│   ├── sections/           # Dynamic public sections
│   ├── providers/          # Theme + Query providers
│   └── ui/                 # Shadcn-style primitives
├── lib/
│   ├── actions/cms.ts      # Server Actions (CRUD)
│   ├── data/site.ts        # Data fetching layer
│   └── supabase/           # Supabase clients
├── stores/admin-store.ts   # Zustand admin state
└── types/cms.ts            # TypeScript types
```

## Dynamic Theme

Colors are injected via CSS variables from the database:

| Variable | Default | Admin Control |
|---|---|---|
| `--primary-accent` | `#D4AF37` | Section & Styling tab |
| `--secondary-accent` | `#10B981` | Section & Styling tab |
| `--background` | `#0A0A0C` | Section & Styling tab |
| `--foreground` | `#F5F5F5` | Section & Styling tab |
| `--card-fill` | `#141418` | Section & Styling tab |

Changes propagate to the public site within 60 seconds (ISR) or immediately after admin save (via `revalidatePath`).

## License

MIT
