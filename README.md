# Human Migration Atlas

An interactive, evidence-aware web atlas for exploring human movement through geography and time. The prototype includes a 3D globe, a time navigator, migration-layer filters, story cards, evidence notes, and English/Arabic UI switching.

## Status and scientific limitations

This is an early prototype with a small, hand-curated **illustrative dataset**. It is not a complete scientific reconstruction and does not provide live migration statistics. Ancient dates and routes are approximate; historical flows may represent broad networks rather than one path. These limitations are surfaced in the UI.

## Stack

- Next.js App Router, React, TypeScript
- [Globe.gl](https://globe.gl/) for the interactive WebGL globe
- Lucide icons and responsive CSS
- Supabase/PostgreSQL schema for migration events, source records, citations, and route segments (`supabase/schema.sql`)
- `/api/migrations` reads published records from Supabase when environment variables are configured; the bundled sample remains as a fallback
- Vercel deployment is connected to GitHub; the latest build fix is being verified

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs in demo mode until `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are configured. To enable database mode, create a dedicated Supabase project, run `supabase/schema.sql` in its SQL Editor, then add the project URL and publishable key to `.env.local` and the Vercel project environment. Never put a Supabase secret/service-role key in a `NEXT_PUBLIC_` variable.

Only records with `publication_status = 'published'` are returned by the API. Row Level Security is enabled on all atlas tables; anonymous clients have read-only access to published records and their public source metadata.

Open http://localhost:3000. Run `npm run build` to verify a production build.

The Earth texture currently loads from the public unpkg CDN, so an internet connection is required for that asset.

## Structure

- `app/page.tsx` — atlas interface, timeline, filters, globe lifecycle
- `app/globals.css` — responsive visual system
- `app/layout.tsx` — root layout and metadata
- `data/migrations.ts` — typed illustrative fallback records and layer labels
- `app/api/migrations/route.ts` — published Supabase records endpoint
- `supabase/schema.sql` — PostgreSQL schema, RLS policies, and public read grants
- `.env.example` — local environment variable template

## Data principles

Each production record should include a stable identifier, origin/destination or multi-segment geometry, a documented date range convention, migration type, reviewed summary, evidence and citations, source dates, uncertainty notes, and attribution/license information.

**A visualization line is not proof of a single route.** Deep-prehistory claims may combine archaeology, fossils, palaeoclimate, genetics, and sea-level reconstructions. For contemporary statistics, use dated releases from IOM, UN DESA, and UNHCR and display the year and measurement definition.

## Roadmap

1. Typecheck/build checks, keyboard and screen-reader access, reduced-motion support, and mobile testing.
2. Research dataset with source registry, citations per claim, uncertainty intervals, multi-segment routes, and editorial review status.
3. Supabase tables for stories, locations, route segments, sources, translations, and editorial reviews; RLS for admin workflows.
4. Editorial tools for drafts, source review, publication approvals, and change history.
5. A documented timeline engine and era-specific map states.
6. Vercel preview and production environments.
7. Guided journeys, glossary, source links, and classroom-friendly collections.

## Content policy

- Separate documented facts from interpretations and illustrative paths.
- Keep provenance attached to every record; never invent citations.
- Label estimates, disagreement, and missing data visibly.
- Respect third-party dataset licenses and attribution requirements.

## License

No license has been selected yet. Add one before inviting reuse or external contributions.
