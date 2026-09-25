# 0006. zod contracts + OpenAPI, not tRPC

- Status: Accepted
- Date: 2026-09-25

## Context
Web, mobile, and possibly a Python service all talk to the API. Validation should be written once.

## Decision
Every request and response shape is a zod schema in `packages/contracts`. NestJS validates with
them via `nestjs-zod` and generates an OpenAPI spec. `packages/api-client` is generated from that
spec. Client forms reuse the same schemas.

## Alternatives
- **tRPC:** great TypeScript experience, but only works TypeScript to TypeScript.
- **class-validator DTOs:** NestJS default, but can't be shared with frontends.

## Consequences
- One source of truth for shapes and validation.
- The OpenAPI spec doubles as API documentation.
- Client generation is a build step that must run when contracts change (in the Turborepo pipeline).
