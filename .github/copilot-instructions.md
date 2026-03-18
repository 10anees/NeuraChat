# Project Guidelines

## Code Style
- Use TypeScript for both backend and frontend changes; preserve existing naming and file organization patterns.
- Keep backend routes thin: validate input in route/controller layer, place reusable logic in services, and keep DB access patterns consistent with existing Supabase usage.
- In frontend interactive React files, include 'use client' when browser APIs, hooks, sockets, or Agora SDKs are used.
- Reuse existing helper layers before adding new abstractions: backend services in backend/src/services and frontend utilities in frontend/src/lib or frontend/src/hooks.

## Architecture
- Monorepo with two apps:
  - backend: Express + Socket.IO + Supabase + AI provider adapters.
  - frontend: Next.js App Router + React context/hooks + socket.io-client + Agora.
- Backend request flow should follow: routes -> controllers -> services -> config/utils.
- Initialize backend database via initializeDatabase before serving requests; do not bypass the singleton setup in backend/src/config/database.ts.
- Auth model is cookie-first JWT for HTTP plus token/cookie handshake for Socket.IO; keep both paths compatible.
- Frontend boundaries:
  - app for pages/layouts
  - components for UI
  - context for global auth state
  - hooks for domain logic
  - lib for API/socket/Agora clients

## Build and Test
- Backend:
  - install: cd backend && npm install
  - dev: cd backend && npm run dev
  - build: cd backend && npm run build
  - start: cd backend && npm run start
- Frontend:
  - install: cd frontend && npm install
  - dev: cd frontend && npm run dev
  - build: cd frontend && npm run build
  - start: cd frontend && npm run start
- Current state: no real automated tests or lint scripts are configured in backend/package.json or frontend/package.json.

## Conventions
- Keep backend API routes mounted under /api/* and follow existing route module split (auth, users, chats, messages, calls, ai, notifications, media).
- For frontend API calls, preserve credentials: 'include' behavior in the shared API client so auth cookies continue to work.
- Reuse existing socket event channels and room naming patterns (user:<id>, chat:<id>) for real-time features.
- Treat browser-only SDK integration (Agora, socket client usage in UI) as client-side only; avoid SSR breakage.
- Preserve existing environment-variable behavior and defaults used by render.yaml, backend/src/server.ts, and frontend config.

## Common Pitfalls
- Missing backend env vars (for example SUPABASE_URL, SUPABASE_ANON_KEY, JWT_SECRET, AGORA_APP_ID, AGORA_APP_CERTIFICATE) can break startup or call features.
- In production, cookie and proxy behavior depends on NODE_ENV and trust proxy settings in backend/src/server.ts.
- Turbopack dev/build may require restart after env changes in frontend.
- Socket auth issues usually come from missing/expired token propagation or credential/cors mismatch between frontend and backend origins.
