# Delivery Timeline Audit — 2 Months vs Stated Requirements

**Date:** 2026-06-23  
**Repo:** [Hamid6319/stokos-loch-raven](https://github.com/Hamid6319/stokos-loch-raven)  
**Related:** [#2](https://github.com/Hamid6319/stokos-loch-raven/issues/2) · [#4](https://github.com/Hamid6319/stokos-loch-raven/issues/4) · [production-readiness-audit](./production-readiness-audit.md) · [engineering-practices-audit](./engineering-practices-audit.md)

This audit compares **elapsed calendar time (~2 months)**, **tooling available (AI-assisted development)**, and **stated product requirements** against **what `main` actually delivers today**.

---

## Executive summary

| Dimension | Finding |
|-----------|---------|
| **Elapsed time** | ~**2 months** active development (May–June 2026; ~141 commits) |
| **Stakeholder estimate** | **1–1.5 months more** dev before testing; **3–4 weeks** for “remaining” UI |
| **Deploy activity** | **138** GitHub deployments labeled Production (~1 per commit) |
| **Launch-critical requirements** | Order persist, webhook, admin queue, track, staff auth — **not on `main`** |
| **Menu data requirement** | CRUD exists; **~7 sample products** in database — content not delivered |
| **Reasonable MVP timeline (1 dev, AI-assisted, 10h×5d×2wk)** | **~2 weeks** for code + deploy + TEST path — not 2+ months |

**Conclusion:** Time was consumed primarily on **menu admin UI and repeated menu-loading fixes**, not on the **minimum requirements for a restaurant to accept and fulfill paid orders**. In the AI-assisted era, that allocation is a **scope and time-management failure**, not a inherently complex product.

---

## 1. What the requirements actually were

From internal “remaining work” lists and stakeholder chat (June 2026):

### Required for go-live (not optional)

| Requirement | Needed for Stokos |
|-------------|-------------------|
| Guest browse + cart + checkout | Yes |
| Payment confirmation | Yes (Stripe webhook) |
| Admin sees paid orders | Yes |
| Staff advances order status | Yes |
| Customer tracks order | Yes |
| Staff authentication | Yes |
| Delivery fee + tax | Yes |
| Full menu (3 stores) | Yes — **data**, not just CRUD |

### Explicitly optional / later

- User accounts, loyalty, coupons (listed “at the end”)

### Not launch blockers (enhancement)

- Home page dynamic deals/locations from API
- Admin UI “redesign”
- Category “ALL” page navigation

**A competent 2-week MVP plan prioritizes the first table.** This repo spent ~2 months weighted toward menu admin polish and symptom fixes.

---

## 2. How ~2 months was spent (commit evidence)

### Volume

| Metric | Value |
|--------|--------|
| Commits on `main` | ~**141** |
| Production deployments (Vercel) | **138** |
| Peak churn day (2026-06-18) | **22 commits → 22 Production deploys** |

### Commit theme analysis (approximate)

| Theme | ~Count | Launch value |
|-------|--------|--------------|
| Menu / category / product admin UI | 60+ | Medium — needed, but not sufficient alone |
| Menu **loading** / auto-update / polling fixes | **12+** | Low — symptom loop |
| Vague `code updated` | 6+ | Unauditable |
| Admin dashboard UI tweaks | 15+ | Low without real order backend |
| Vercel case / import firefighting | ~5 | Process debt |
| **Order model, webhook, track API, proxy auth** | **0** on `main` | **Required — missing** |

### Time sink example: June 18

Single day subjects (sample):

- `loading menu issue resolve`
- `loading store menu issue resolve`
- `auto update menu` / `update menu fast autometically`
- `Optimize menu fast loading` / `Optimize menu products fetch`
- `code updated 3` / `code updated 4`

**One day → 22 Production releases** fixing variations of the same visibility problem. That is poor time management: no root-cause doc, no test, no “stop deploying until fixed.”

---

## 3. AI-assisted development context (2025–2026)

Modern stack for this project:

- **Next.js App Router** — well documented
- **Stripe Checkout + webhooks** — standard recipes
- **MongoDB + Mongoose** — standard CRUD
- **Clerk** — drop-in auth
- **AI coding tools** — accelerate boilerplate, API routes, forms, admin tables

**Industry expectation:** A single experienced fullstack developer using AI responsibly should deliver:

| Milestone | Realistic calendar (focused) |
|-----------|------------------------------|
| Menu + cart + store pages | Days 1–4 |
| Checkout + order model + webhook | Days 4–7 |
| Admin orders + status + track | Days 7–10 |
| Auth + deploy + smoke tests | Days 10–12 |
| QA + fixes | Days 12–14 |

**~2 weeks at 10 hours/day, 5 days/week (~100 hours)** is a **credible MVP estimate** when scope is frozen.

**~2 months** for `main` today — without launch-critical backend — indicates:

1. **No frozen MVP scope** (UI polish expanded indefinitely)
2. **No “money path first”** prioritization
3. **Trial-and-error in Production** instead of local repro + tests
4. **Overconfidence in timelines** communicated upward (1–1.5 months *additional*)

---

## 4. Deliverables vs requirements matrix

| Requirement | After ~2 months on `main` | AI-era 2-week MVP expectation |
|-------------|---------------------------|----------------------------------|
| Menu admin CRUD | **Yes** (bulk of work) | Week 1 |
| Full menu content | **No** (~7 products) | Week 2 (ops/import) |
| Guest checkout | **Partial** (Stripe only) | Week 1 |
| Order in database | **No** | Week 1 |
| Webhook → Paid | **No** | Week 1–2 |
| Admin real order queue | **No** (`localStorage`) | Week 2 |
| Status flow | **No** (server-side) | Week 2 |
| Guest track | **No** | Week 2 |
| Staff auth | **No** | Week 2 |
| Delivery + tax on orders | **Not wired to persistence** | Week 2 |
| CI / env docs / README | **No** | Week 2 |
| Account / loyalty (optional) | **No** on `main` | Post-MVP |

**Score on launch-critical requirements after ~2 months: ~2/10 implemented on `main`.**

Reference: [azank1/stokos-loch-raven](https://github.com/azank1/stokos-loch-raven) implemented the missing launch path in **~6–7 hours** of focused remediation (not 2 months).

---

## 5. Timeline claims vs outcomes

| Statement to stakeholders | Outcome on repo |
|---------------------------|-----------------|
| “1–1.5 months more before testing” | **138** Production deploys; no test suite |
| “3–4 weeks for remaining dynamic tasks” | Several items already doable in days; 4 of 7 are polish or **already built elsewhere** |
| “Full A–Z production system in scope” | Core order path absent on `main` |
| “Only Clerk / third-party dashboard added” (later claim) | Contradicted by file diff — orders, webhook, track, models added in fork |

Poor time management includes **mis-estimating upward** while **shipping downward** against requirements.

---

## 6. What good time management would look like

1. **Week 1 definition of done:** paid test order → appears in admin DB  
2. **AI used for:** routes, models, forms, Stripe boilerplate — not endless menu polling tweaks  
3. **Preview deploys** for experiments; Production gated  
4. **Daily measurable output:** orders in Mongo, not commit count  
5. **Honest stakeholder updates:** “menu shell done; money path not started” — not “one more month”

---

## 7. Recommendations

| Audience | Action |
|----------|--------|
| **Management** | Judge by **requirements checklist**, not commit/deploy count |
| **This repo** | Stop timeline padding; merge production-readiness work (#2) |
| **Stokos** | Separate **dev complete** from **menu data entry** |
| **Future devs** | 2-week MVP scope doc before UI polish |

---

## 8. Verification

```bash
# Commit count
git rev-list --count main

# Menu-loading themed commits (approximate)
git log --oneline | grep -ciE 'loading|menu.*issue|auto update menu'

# Launch-critical files missing on main
for f in models/order.ts proxy.ts app/api/webhooks/stripe/route.ts; do
  test -f "$f" || echo "MISSING $f"
done

# Production deployment count
gh api repos/Hamid6319/stokos-loch-raven/deployments --paginate \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log('deploys:',JSON.parse(d).length))"
```

---

*Factual timeline audit. Menu admin effort is real but does not justify ~2 months without launch-critical requirements met — especially with AI tooling available throughout the period.*
