# Production Readiness Audit — `main` branch

**Date:** 2026-06-23  
**Auditor:** Bayent Labs / [azank1/stokos-loch-raven](https://github.com/azank1/stokos-loch-raven) (production deploy)  
**Scope:** Launch-critical customer + admin order flow vs menu admin UI

This document lists **factual gaps** on `Hamid6319/stokos-loch-raven` `main` that block real multi-user production use. It is intended as constructive handoff material, not a feature backlog.

---

## Executive summary

The repo has substantial **menu admin CRUD** work (~140 commits). The **order/payment/ops path required for a live restaurant** is not implemented on `main`:

- Admin orders are stored in **browser `localStorage`**, not MongoDB.
- Checkout creates a Stripe session but does **not** persist orders to the database.
- No Stripe webhook, no guest order tracking, no staff auth middleware.

A reference implementation addressing these gaps lives on [azank1/stokos-loch-raven](https://github.com/azank1/stokos-loch-raven) `main` (TEST: `https://stokos-loch-raven-git-main-bayentlabs.vercel.app`).

---

## P0 — Launch blockers (missing on `main`)

| # | Gap | Evidence on `main` | Production impact |
|---|-----|-------------------|-------------------|
| 1 | **Admin orders use `localStorage`** | `app/admin/components/orderdashboard.tsx` — `STORAGE_KEY = "stokos_admin_orders"` | Orders lost on cache clear; not shared across staff/devices |
| 2 | **No Order model** | `models/order.ts` absent | No durable order records |
| 3 | **No admin orders API** | `app/api/admin/orders/` absent | Dashboard cannot load real queue |
| 4 | **Checkout does not write to MongoDB** | `app/api/checkout/route.ts` — Stripe session only (~120 lines) | Payment succeeds but no order row for admin/webhook |
| 5 | **No Stripe webhook** | `app/api/webhooks/stripe/` absent | Payment confirmation not tied to order status |
| 6 | **No guest order tracking** | `app/track/`, `app/api/orders/track/` absent | Customers cannot track status after checkout |
| 7 | **No staff auth middleware** | `proxy.ts` absent; no `ADMIN_EMAILS` | `/admin` not production-safe |

---

## P1 — Claimed "remaining work" vs `main` (June 2026)

Internal stakeholder list vs this repo:

### Admin dashboard

| Item | Claimed remaining | On `main` |
|------|-------------------|-----------|
| Admin auth (Clerk) | Yes | **Missing** (`proxy.ts`) |
| Order status flow | Yes | **UI only** — `localStorage`, no server status machine |
| Delivery + tax in checkout | Yes | Store fields may exist; **checkout not wired to persisted orders** |
| Admin UI redesign | Subjective | Shell exists |

### Customer side

| Item | Claimed remaining | On `main` |
|------|-------------------|-----------|
| Full menu upload | Data ops | CRUD exists; **~7 sample products** in typical dev DB |
| Guest checkout | Partial | Stripe checkout **yes** |
| Guest tracking | Yes | **Missing** |
| Account / loyalty / coupons (optional) | Future | **Missing** on `main` |

---

## P2 — Enhancement backlog (not launch blockers)

These are valid product improvements but do not replace P0:

- Home page: dynamic feature deals / locations (currently static in `components/mainwebsite/`)
- Menu section "ALL" button navigation to full category page
- Modifier group edit-save bug (needs reproduction steps in QA)

---

## Recommended fix order

1. Add `models/order.ts` + persist order at checkout (before Stripe redirect).
2. Add `POST /api/webhooks/stripe` (`checkout.session.completed`) → `paymentStatus: paid`, `status: Confirmed`.
3. Replace `localStorage` in `orderdashboard.tsx` with `GET/PATCH /api/admin/orders`.
4. Add `lib/orderstatus.ts` + valid transitions (pickup vs delivery).
5. Add `proxy.ts` + Clerk + `ADMIN_EMAILS` allowlist.
6. Add `/track` + `GET /api/orders/track` for guests.
7. Populate full menu data (admin or CSV import).

Reference files in [azank1/stokos-loch-raven](https://github.com/azank1/stokos-loch-raven): `proxy.ts`, `models/order.ts`, `app/api/checkout/route.ts`, `app/api/webhooks/stripe/route.ts`, `app/api/admin/orders/*`, `app/track/trackclient.tsx`, `lib/orderstatus.ts`.

---

## What is working well

- Menu management UI (categories, products, modifiers, upsells)
- Store customer pages and cart UX
- Stripe Checkout session creation
- MongoDB menu schema and admin CRUD APIs

Credit where due: the **menu platform** is the bulk of commit history. The gap is the **money path** (persist → pay → confirm → admin → track).

---

## Verification commands

From a clean clone of `main`:

```bash
# Should fail / missing on main today:
test -f proxy.ts && echo "proxy exists" || echo "proxy MISSING"
test -f models/order.ts && echo "order model exists" || echo "order model MISSING"
test -d app/api/webhooks/stripe && echo "webhook exists" || echo "webhook MISSING"
grep -q localStorage app/admin/components/orderdashboard.tsx && echo "admin uses localStorage"
```

---

*This audit was prepared for Stokos client handoff. Questions: Bayent Labs engineering.*
