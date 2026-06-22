# Engineering Practices Audit — Claims vs Repository Evidence

**Date:** 2026-06-23  
**Repo:** [Hamid6319/stokos-loch-raven](https://github.com/Hamid6319/stokos-loch-raven)  
**Related:** [Production readiness audit](./production-readiness-audit.md) · [Issue #2](https://github.com/Hamid6319/stokos-loch-raven/issues/2)

This document reviews **how the project was delivered** (deployments, commits, hygiene) against **claims made to stakeholders** (timeline, “production” readiness, remaining work). It is factual and intended for team alignment.

---

## Executive summary

| Stakeholder claim | Repository / deployment evidence |
|-------------------|----------------------------------|
| “1–1.5 months more dev **before** testing/deployment” | **138** GitHub deployments labeled **Production**; testing could have run on any deploy |
| “Production deployment releases” ([deployments](https://github.com/Hamid6319/stokos-loch-raven/deployments/Production)) | **~1 Vercel Production deploy per commit** — not versioned releases |
| “Remaining work” = auth, orders, track, tax | Many items **not on `main`** while deploys continued |
| “3–4 weeks for dynamic tasks” | Same period had **22 prod deploys in one day** fixing one menu-loading symptom |

**High deployment count ≠ mature delivery.** It reflects ungated push-to-`main` on Vercel, not validated releases.

---

## 1. “Production” deployments (138)

Data from GitHub Deployments API (June 2026):

| Metric | Value |
|--------|--------|
| Total deployments | **138** |
| Environment | **100% `Production`** (no Preview/Staging recorded) |
| Creator | **`vercel[bot]`** on every entry |
| Deploy ≈ commit ratio | **~0.98** (138 deploys / ~141 commits) |
| Peak day (2026-06-18) | **22 commits → 22 Production deploys** |

### What this means

- Each `git push` to `main` triggers Vercel and GitHub logs it as **Production**.
- There is **no** release branch, tag, or QA gate visible in the repo.
- The [Production deployments page](https://github.com/Hamid6319/stokos-loch-raven/deployments/Production) is **activity volume**, not proof of production quality.

### June 18 example (deploy churn)

Same-day commit subjects (sample):

- `loading menu issue resolve`
- `code updated 3`
- `auto update menu` / `update menu fast autometically`
- `Optimize admin menu fast loading`

Each commit = new “Production” release on [stokos-loch-raven.vercel.app](https://stokos-loch-raven.vercel.app). That is **symptom fixing in prod**, not a release process.

---

## 2. Claims vs practices

### Timeline claims

| Claim (stakeholder / dev) | Practice on repo |
|---------------------------|------------------|
| Testing comes **after** 1–1.5 months more dev | **138** prod-labeled deploys already shipped; no test scripts or CI |
| 3–4 weeks for remaining dynamic UI | **22 prod deploys in one day** on repeated menu-loading fixes |
| “Full A–Z production system” in scope | `main` still missing order model, webhook, track API (see production audit) |

### “Remaining work” list vs `main` (June 2026)

Communicated as ~**one month** of development:

| Listed item | On `main` when list circulated |
|-------------|-------------------------------|
| Admin auth (Clerk) | **Missing** — no `proxy.ts`; `bcryptjs` / `jsonwebtoken` in `package.json` but **unused in code** |
| Order status flow | **UI only** — `localStorage` in `orderdashboard.tsx`, no server status machine |
| Guest tracking | **Missing** |
| Delivery + tax on real orders | Checkout does not persist orders to MongoDB |

Listing work as “remaining” while continuing to label every push **Production** misrepresents project maturity.

---

## 3. Repository hygiene

| Area | Finding |
|------|---------|
| `README.md` | Still default **create-next-app** template — no project-specific setup |
| `.env.example` | **Missing** — new devs / ops cannot see required env vars |
| `.github/workflows` | **Missing** — no CI, no automated build/test on PR |
| `package.json` scripts | Only `dev`, `build`, `start`, `lint` — **no tests**, no smoke checks |
| Dead dependencies | `bcryptjs`, `jsonwebtoken` declared, **zero imports** in application code |
| Conventional commits | ~5 `fix:` commits (mostly Vercel case/import); majority vague (`code updated`, typos) |

### Commit message patterns (~141 commits)

| Pattern | Approx. count |
|---------|----------------|
| Menu / loading issue repeats | 12+ |
| Vague `code updated` | 6+ |
| Typos in subject (`chnage`, `autometically`, `prcing`, `managment`) | 9+ |
| `admindashboard` / `menumanagment` informal spam | 7+ |

Poor commit hygiene makes bisecting, reviewing, and auditing **138 “releases”** nearly impossible.

---

## 4. Menu bug pattern (process, not one bug)

Observed cycle on `main`:

1. Customer menu stale or slow  
2. Commits: “loading menu issue resolve”, “auto update menu”, “Optimize menu fast loading”  
3. Mitigation: **faster client polling** / refetch — not documented root cause  
4. Each fix → **new Production deployment**  
5. Repeat across **12+** commit messages  

Professional practice: reproduce → fix invalidation/cache/schema → add smoke test → deploy once. This repo shows **trial-and-error in Production**.

---

## 5. Deploy vs environment confusion

| URL | What it is |
|-----|------------|
| [stokos-loch-raven.vercel.app](https://stokos-loch-raven.vercel.app) | Hamid Vercel project — GitHub homepage URL; every `main` push |
| Bayent Labs Vercel URL | Separate deploy with order/webhook/track stack |

Calling the Hamid Vercel URL “production” for **Stokos client go-live** is misleading when:

- Admin orders are `localStorage`-backed on `main`  
- No Stripe webhook on `main`  
- No staff auth on `main`  

---

## 6. Recommendations (if development continues on this repo)

1. **Stop equating deploy count with progress** — track acceptance criteria, not Vercel entries.  
2. **Add `.env.example` + real README** — document MongoDB, Stripe, Clerk.  
3. **Introduce CI** — `npm run build` + smoke routes on every PR.  
4. **Staging vs Production** — use Vercel Preview for experiments; gate `main`.  
5. **Remove unused deps** (`bcryptjs`, `jsonwebtoken`) or implement auth properly.  
6. **Conventional commits + PR descriptions** — replace `code updated` spam.  
7. **Merge production-readiness fixes** before more UI polish — see [issue #2](https://github.com/Hamid6319/stokos-loch-raven/issues/2).

Reference implementation (order path + QA scripts): [azank1/stokos-loch-raven](https://github.com/azank1/stokos-loch-raven).

---

## 7. Verification (reproducible)

```bash
# Deployment count (requires GitHub CLI)
gh api repos/Hamid6319/stokos-loch-raven/deployments --paginate \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const a=JSON.parse(d);console.log('Production:',a.filter(x=>x.environment==='Production').length)})"

# Dead auth deps — no app imports
grep -r "bcrypt\\|jsonwebtoken" --include='*.ts' --include='*.tsx' . || echo "no auth lib usage in app code"

# No CI
test -d .github/workflows && echo CI exists || echo "no CI"

# README still boilerplate?
head -3 README.md
```

---

*Prepared for Stokos / zayup engineering alignment. Factual tone; menu admin UI effort is acknowledged separately in the production-readiness audit.*
