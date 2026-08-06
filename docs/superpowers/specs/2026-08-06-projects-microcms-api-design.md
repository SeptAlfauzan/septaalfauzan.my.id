# Wire Projects Feature to MicroCMS API

Date: 2026-08-06
Status: Approved
Branch: `feat/projects`

## Context

The Projects feature (routes `/projects` and `/projects/:id`) currently serves data from `MockProjectDataSource`. The HTTP data source (`HttpProjectDataSource`) already exists with MicroCMS-shaped DTOs but is dormant behind `VITE_USE_HTTP_API === 'true'`.

The real MicroCMS API is live and was verified by direct curl:

- List: `https://porfolio-septaalfauzan.microcms.io/api/v1/projects/` → `{ contents: ProjectDto[], totalCount, offset, limit }`
- Single: `https://porfolio-septaalfauzan.microcms.io/api/v1/projects/{id}` → `ProjectDto`
- Auth: header `X-MICROCMS-API-KEY` (value already present in `.env`)
- Response shape matches the existing DTOs exactly (verified against live API, 1 project, dummy content). No changes to types, mappers, or mock data.

## Goal

Make HTTP the default data source. Close two findings from the final branch review that become live once HTTP is real:

1. `loadProjectDetail` request-sequencing race (stale response can overwrite a newer one on rapid navigation)
2. Untyped `res.json()` and silent undefined-env failure in `http-data-source.ts`

## Changes

### 1. Environment configuration

`.env` (gitignored, holds the secret):
- Replace `X-MICROCMS-API-KEY="..."` with `VITE_MICROCMS_API_KEY="..."` (same value; Vite only exposes `VITE_`-prefixed vars)
- Add `VITE_MICROCMS_ENDPOINT="https://porfolio-septaalfauzan.microcms.io/api/v1"`
- Add `VITE_USE_MOCK_API` (unset → HTTP)

`.env.example` (committed, no secret):
- Placeholder `VITE_MICROCMS_API_KEY` + `VITE_MICROCMS_ENDPOINT`
- Comment noting the key must be a MicroCMS read-only API key
- Documents required vars for CI/prod builds

### 2. DI switch

`src/modules/projects/presentation/di.ts`:
- HTTP becomes default: `useHttpApi = import.meta.env.VITE_USE_MOCK_API !== 'true'`
- Mock remains available as an explicit dev/test fallback

### 3. Store race fix

`src/modules/projects/presentation/projects.store.ts`:
- Monotonic request token in `loadProjectDetail`
- On resolution/rejection, discard the result if a newer request started (latest-request-wins)
- Token check covers `currentProject`, `error`, and `loading` finalization

### 4. Data-source hardening

`src/modules/projects/data/http-data-source.ts`:
- Type the JSON responses: `res.json()` → `ProjectsResponseDto` / `ProjectDto`
- Module-level guard: throw a clear error if `VITE_MICROCMS_ENDPOINT` or `VITE_MICROCMS_API_KEY` is missing (fail fast instead of a confusing `undefined` fetch)

### 5. Testing & verification

- Store spec: add test — two concurrent `loadProjectDetail` calls for different ids resolve out of order; assert the latest id's result wins
- Re-run: full `vitest` suite, `vue-tsc` type-check, `vite build`, `lint`
- Manual: `npm run dev` against the real API (list + detail + 404 path)

## Non-Goals / Notes

- No changes to `types.ts`, domain mappers, or mock data (verified identical to live response)
- MicroCMS default `limit=10` would truncate the list if the portfolio exceeds 10 projects; defer (`?limit=100`) until needed — YAGNI, only 1 live project
- The API key ships in the client bundle and is visible in devtools — acceptable for a personal portfolio with a read-only key; noted as a known trade-off
- Security: API key is never committed (`.env` stays gitignored; `.env.example` carries placeholders only)
