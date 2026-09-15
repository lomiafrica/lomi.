# KOMPTO FNE API — partner integration pack

Source pack for analysing KOMPTO’s Facture Normalisée Électronique (FNE) API so lomi. merchants can certify invoices from our platform.

**Status:** partner path preferred over building FNE in-house (2026-09-15).  
**HubSpot deal:** KOMPTO — FNE API (`518823668985`), contact Alberto Martino (`martino@kompto.com`).  
**Do not commit live API keys.** Test key was emailed 2026-09-02; store only in secrets / env, never in git.

## Contents

| File | Purpose |
|------|---------|
| `public-api-overview.md` | Captured from https://kompto.com/KomptoApi (public marketing + API overview) |
| `hubspot-thread-notes.md` | Evidenced email thread facts (no secrets) |
| `integration-checklist.md` | What Rex / agents should validate next |

## Missing binary

Alberto attached a private “guide d’intégration” PDF on 2026-09-02 (HubSpot attachment ids `464548911294`, `464548911295`). HubSpot MCP could not download FILE objects. Drop the PDF into this folder in a follow-up commit when available from Babacar’s mailbox or HubSpot UI.
