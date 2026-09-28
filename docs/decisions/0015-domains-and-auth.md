# 0015. Domains and authentication flow

- Status: Accepted
- Date: 2026-09-28

## Context
Web and API are deployed separately (Vercel, Railway). A mobile app will follow. The owner
has the domain `zolender.xyz`.

## Decision

**Domains** (until a dedicated Carrel domain exists)

| | Web | API |
|---|---|---|
| Production | `carrel.zolender.xyz` | `api.carrel.zolender.xyz` |
| Staging | `staging.carrel.zolender.xyz` | `api.staging.carrel.zolender.xyz` |

Keeping web and API under one parent domain keeps cookies and CORS simple.

**Authentication**
- Supabase Auth issues sessions. Google sign-in is primary, email link is secondary.
- The web app keeps the Supabase session in cookies (server-side helpers) and calls the API
  with `Authorization: Bearer <access token>`. Mobile will do the same.
- The API verifies JWTs against Supabase's published signing keys (JWKS). It holds no shared JWT secret.
- CORS on the API allows only the known web origins for each environment.

**Email**
- Supabase's built-in email is for development only. Before the beta, send through Resend with a
  Carrel-specific API key.
- `.xyz` domains have poor email reputation. Prefer a dedicated Carrel domain for sending before the beta.

## Consequences
- Moving to a dedicated Carrel domain later means DNS changes plus updating allowed origins and
  auth redirect URLs. No code changes.
