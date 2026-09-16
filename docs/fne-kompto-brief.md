# FNE + KOMPTO integration brief

Source: email from Alberto Martino (`martino@kompto.com`) to `babacar@lomi.africa`, 2026-09-02, subject `lomi. / KOMPTO`. HubSpot stored that thread on contact [Alberto Martino](https://app.hubspot.com/contacts/148669672/record/0-1/856123942104) and deal [KOMPTO — FNE API](https://app.hubspot.com/contacts/148669672/record/0-3/518823668985). Attachments on that HubSpot email (IDs 464548911294, 464548911295) are the KOMPTO API integration guide. Re-fetch from HubSpot or Gmail before coding the live HTTP field list if they are not already in the repo. **Do not commit any API test key from the email into git.**

This file is the checked-in copy of the Cursor implementation brief. Design details, public endpoint notes, and file TODOs live in [`docs/fne-kompto.md`](./fne-kompto.md).

## Product intent

lomi. merchants should be able to certify invoices as Côte d'Ivoire **FNE** (Facture Normalisée Électronique / DGI) from the lomi. platform by integrating KOMPTO's certified-invoice API (Kompto already exposes FNE certification).

## Partner facts (from correspondence)

- Partner: KOMPTO (`progici@kompto.com`, `martino@kompto.com`, +225 07 05 797 658, [www.kompto.com](https://www.kompto.com))
- They sent an API integration guide as attachments and a test API key out of band (store in secrets / env only; never in source)
- Call / Teams already happened around end of August / early September 2026 (scheduled 31 Aug 16h30, then rescheduled after a missed Teams hop; Babacar confirmed Wednesday 14h30)

## FNE obligation analysis (partner view, not legal advice)

Martino's personal, non-binding view:

1. Banks (strict banking status) can be exempt from FNE. Outside that, lomi. is likely subject to FNE on its **commissions**.
2. Confirm treatment with lomi.'s accounting firm.
3. Because each FNE sticker has a cost (from ~20 FCFA), prefer **aggregated** FNE (monthly or semi-annual) listing all commission transactions for a client in the period, rather than one FNE per payment. Confirm with accountant / DGI if needed.
4. KOMPTO can help escalate to DGI for a clear position if required.

He stated that this is a personal appreciation, shared as an indication only, and is not tax advice.

## Implementation goals

Create a scoped implementation plan plus stubs (or full wiring if the guide is available in-repo) so Cursor can land FNE certification for merchant invoices and for lomi. commission invoices.

### Likely workstreams

1. **Docs**: this folder, auth, endpoints (from the attached guide or public KOMPTO pages), error cases, and aggregation policy TBD with finance.
2. **Config**: `KOMPTO_API_KEY`, `KOMPTO_BASE_URL`, feature flag `fne_kompto_enabled` (merchant + platform).
3. **Domain model**:
   - Merchant invoice → optional FNE certification request / status / DGI identifier / PDF or QR payload
   - Platform commission ledger → batch job that can emit one aggregated FNE per merchant per period
4. **API surface** (dashboard / admin):
   - Certify invoice (merchant)
   - List certification status
   - Admin: run / preview commission aggregation batch (dry-run first)
5. **Idempotency**: never double-certify; store external FNE id; retry-safe
6. **Tests**: mock KOMPTO HTTP; cover failure modes and aggregation grouping
7. **Do not**: invent tax rates, sticker prices beyond "cost exists", or claim DGI approval

### Success criteria

- PR opened on the monorepo with the brief checked in, clear TODOs mapped to files, and either:
  - working integration against KOMPTO test env using env secrets, or
  - a detailed design + interfaces if the PDF guide cannot be read in this run
- No secrets in git
- Explicit note that FNE legal treatment of commissions needs accountant confirmation before production enablement
