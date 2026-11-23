# Flow State storefront

The Flow State storefront is built with Next.js, React, TypeScript, Tailwind CSS,
and Redux Toolkit Query.

## Setup

1. Install dependencies with `pnpm install`.
2. Create `.env.local` and set `NEXT_PUBLIC_BASE_URL` to the backend API base
   URL. See `.env.example`.
3. Run `pnpm dev` to start the development server.

## Checks

- `pnpm lint` runs ESLint.
- `pnpm typecheck` runs TypeScript without emitting files.
- `pnpm test` runs the unit tests once.
- `pnpm build` creates the production build.
