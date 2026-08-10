# Services — Abstract Provider Layer

This directory implements the application's Capability-oriented data/backend
architecture, per the Phase 2 — Step 1 architectural audit (approved).

## Flow

```
Application → Capability → Registry → Provider
```

Application/business/UI code calls a **capability** (`services/capabilities/*.js`).
Each capability resolves its implementation through **`registry.js`** — the single
provider-resolution point in the application. Capabilities never import a
provider directly.

## Structure

```
services/
├── capabilities/     Public, technology-agnostic interface the application calls.
│   ├── order.js          ACTIVE   — order.create()
│   ├── analytics.js      ACTIVE   — analytics.track(), analytics.getSessionId()
│   ├── product/README.md SKELETON — reserved, not implemented
│   ├── customer/README.md SKELETON — reserved, not implemented
│   ├── auth/README.md    SKELETON — reserved, not implemented
│   └── storage/README.md SKELETON — reserved, not implemented
│
├── providers/         Provider-specific implementations of the capabilities above.
│   ├── supabase/          ACTIVE   — the only implemented provider today
│   │   ├── client.js          Supabase client initialization only
│   │   ├── order.provider.js  All order logic + REST fallback, verbatim from index.html
│   │   └── analytics.provider.js  trackEvent + private SESSION_ID
│   ├── postgres/README.md  SKELETON
│   ├── mysql/README.md     SKELETON
│   ├── mariadb/README.md   SKELETON
│   ├── mssql/README.md     SKELETON
│   ├── oracle/README.md    SKELETON
│   ├── sqlite/README.md    SKELETON
│   ├── odoo/README.md      SKELETON
│   ├── erpnext/README.md   SKELETON
│   ├── firebase/README.md  SKELETON
│   ├── appwrite/README.md  SKELETON
│   └── pocketbase/README.md SKELETON
│
└── registry.js         ACTIVE — maps each capability to its active provider.
```

## Current state (today)

- **ACTIVE capabilities:** `order`, `analytics` — both backed by the Supabase provider.
- **SKELETON capabilities:** `product`, `customer`, `auth`, `storage` — no real
  usage exists in the current codebase (confirmed by the Phase 2 Step 1 audit);
  reserved as documented placeholders only, no code.
- **ACTIVE provider:** `supabase` — the only implemented provider.
- **SKELETON providers:** every other listed system — documented placeholders
  only, no code, until a real migration need exists.

## Adding a future provider

To add a new provider for an existing capability (e.g. switching `order` to a
future PostgreSQL provider):

1. Implement `providers/postgres/order.provider.js` (or similar) fulfilling the
   same contract as `providers/supabase/order.provider.js` (i.e. it must expose
   whatever `registry.js` expects — currently a `createOrder(orderHeader, items)`
   function).
2. Update `registry.js`'s `order.implementation` to import from the new provider
   instead of (or in addition to, for gradual rollout) Supabase.
3. No change is required in `capabilities/order.js` or in any application/UI code.

This is what makes the architecture provider-agnostic: the capability interface
and every caller of it are completely insulated from which provider is active.
