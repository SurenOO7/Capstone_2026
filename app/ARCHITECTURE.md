# App Design & Architecture

## Phase 3 Scope

Phase 3 establishes the product architecture, database migration state, design system foundation, routing skeleton, authentication wiring, and paper-ready diagrams. It intentionally avoids full CRUD behavior, charts, form validation workflows, and production polish; those belong to Phase 4 and Phase 5.

## Page and Route Structure

The application uses the Next.js App Router under `src/app`.

- `src/app/page.tsx` is the public entry page.
- `src/app/login/page.tsx` is the public sign-in placeholder.
- `src/app/(protected)/layout.tsx` wraps protected pages in the responsive app shell.
- `src/app/(protected)/dashboard/page.tsx` is the dashboard placeholder.
- `src/app/(protected)/goals/page.tsx` is the goal list placeholder.
- `src/app/(protected)/goals/new/page.tsx` is the create-goal placeholder.
- `src/app/(protected)/goals/[id]/page.tsx` is the goal detail placeholder.
- `src/app/(protected)/analytics/page.tsx` is the analytics placeholder.
- `src/app/(protected)/settings/page.tsx` is the settings placeholder.
- Auth.js route handlers live at `src/app/api/auth/[...nextauth]/route.ts`.

Next.js 16 renamed Middleware to Proxy. The route-protection middleware layer is therefore implemented as `src/proxy.ts`, with matchers for `/dashboard`, `/goals`, `/analytics`, `/settings`, and `/categories`.

## Design System

The app uses Tailwind CSS v4 tokens modeled after shadcn/ui conventions. Theme variables are defined in `src/app/globals.css` for both light and dark palettes:

- `--background`, `--foreground`, `--card`, `--popover`
- `--primary`, `--secondary`, `--muted`, `--accent`
- `--destructive`, `--border`, `--input`, `--ring`
- `--radius`

The palette is intentionally restrained and productivity-focused: warm off-white backgrounds, green primary actions, neutral surfaces, and clear contrast in dark mode.

## Responsive Layout

The shared shell is implemented in `src/components/layout/app-shell.tsx`.

- Desktop: fixed left sidebar, sticky top bar, and constrained main content.
- Mobile/tablet: compact top header, horizontally scrollable icon navigation, and single-column content.
- Page placeholders use stable spacing, compact headings, and dashed content regions to signal Phase 4 implementation areas without pretending features are complete.

## User Flows

Primary flow:

`Visitor -> Login -> Google OAuth or credentials sign-in -> Dashboard -> Goals -> Goal detail -> Progress updates`

Secondary flows:

- `Dashboard -> New goal -> Goal detail`
- `Dashboard -> Analytics -> Dashboard`
- `Dashboard -> Settings -> Dashboard`

The Mermaid source for this flow is saved in `paper/figures/user-flow.mmd`.

## Data Flow

User interactions start in React components rendered by the App Router. Mutations such as creating goals, updating progress, completing milestones, and editing categories should call a Server Action or a scoped API Route.

The server layer validates the request, checks the authenticated user, and uses the shared Prisma client from `src/lib/db.ts`. Prisma executes typed queries against PostgreSQL. The database stores Auth.js account/session data and the application domain tables: users, goals, milestones, categories, and progress logs.

Flow:

`Client Component / Form -> Server Action or API Route -> Prisma Client -> PostgreSQL`

## Auth Flow

Authentication is handled with Auth.js v5 in `src/lib/auth.ts`. Google OAuth or credentials sign-in creates and reads Auth.js records through the Prisma adapter tables: `users`, `accounts`, `sessions`, and `verification_tokens`.

Configured providers:

- Google OAuth
- Credentials provider using `users.password_hash`

Protected routes use the Auth.js `auth()` session helper through `src/proxy.ts` for route-level access control. Server Actions must also verify the session before reading or writing user-owned records.

The authorization rule is simple: every goal, category, milestone, and progress log is accessed through the owning `userId` or through a parent record that belongs to the authenticated user.

## API Routes and Server Actions

Auth route:

- `GET|POST /api/auth/[...nextauth]`: handled by Auth.js.

Phase 4 Server Actions should be grouped near their owning feature:

- `src/app/(protected)/goals/actions.ts`: create, update, delete, filter refresh helpers.
- `src/app/(protected)/goals/[id]/actions.ts`: update progress, edit detail fields, complete or reorder milestones.
- `src/app/(protected)/settings/actions.ts`: profile and preference changes.

Future API route handlers should be reserved for integrations, exports, or client-side fetch flows that are awkward as Server Actions:

- `GET /api/goals/export.csv`
- `GET /api/analytics/summary`
- `POST /api/notifications/test`

Every mutation must validate input, call `auth()`, and scope all Prisma queries by the authenticated user.

## State Management

The default state model is server-first:

- Database state lives in PostgreSQL and is queried through Prisma.
- Page data should be fetched in Server Components.
- Mutations should use Server Actions and revalidation.
- Client state is reserved for form drafts, dialogs, filters, optimistic UI, and chart controls.
- A separate global client store is not planned for Phase 4 unless cross-page state becomes necessary.

## Diagrams and Paper Artifacts

The Phase 3 diagrams are stored as Mermaid source in `paper/figures/`:

- `er-diagram.mmd`
- `app-architecture.mmd`
- `user-flow.mmd`
- `wireframes.mmd`

These can be exported to images later for the thesis appendices.
