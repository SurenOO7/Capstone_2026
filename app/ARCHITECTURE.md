# App Design & Architecture

## Page and Route Structure

The application uses the Next.js App Router under `src/app`.

- `src/app/page.tsx` is the public entry page.
- Future protected app pages should live under route groups such as `src/app/(dashboard)/dashboard`, `src/app/(dashboard)/goals`, `src/app/(dashboard)/goals/[goalId]`, `src/app/(dashboard)/categories`, and `src/app/(dashboard)/analytics`.
- Auth.js route handlers should live at `src/app/api/auth/[...nextauth]/route.ts`.
- API routes are reserved for external integrations or client-side fetch flows. Regular form mutations should prefer Server Actions near the page or feature that owns the workflow.

## Data Flow

User interactions start in React components rendered by the App Router. Mutations such as creating goals, updating progress, completing milestones, and editing categories should call a Server Action or a scoped API Route.

The server layer validates the request, checks the authenticated user, and uses the shared Prisma client from `src/lib/db.ts`. Prisma executes typed queries against PostgreSQL. The database stores Auth.js account/session data and the application domain tables: users, goals, milestones, categories, and progress logs.

Flow:

`Client Component / Form -> Server Action or API Route -> Prisma Client -> PostgreSQL`

## Auth Flow

Authentication is handled with Auth.js v5. OAuth or credentials sign-in creates and reads Auth.js records through the Prisma adapter tables: `users`, `accounts`, `sessions`, and `verification_tokens`.

Protected routes should use the Auth.js `auth()` session helper on the server and middleware for route-level access control. Middleware redirects unauthenticated users away from dashboard, goal, category, analytics, and settings routes. Server Actions must also verify the session before reading or writing user-owned records.

The authorization rule is simple: every goal, category, milestone, and progress log is accessed through the owning `userId` or through a parent record that belongs to the authenticated user.
