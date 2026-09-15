# KOMPTO API overview (public)

Captured from https://kompto.com/KomptoApi for agent analysis. Prefer re-fetching the live page if something conflicts.

## Positioning

KOMPTO is a DGI-approved FNE editor. Their API lets ERP / SaaS products send sale data and receive a certified FNE without needing our own DGI accreditation, certificates, or regulatory maintenance.

Base URL: `https://app.kompto.com`  
Auth: `Authorization: Bearer {api_key}`  
Format: REST JSON over HTTPS. Field names in English.

## Endpoints

| Method | Endpoint | Role |
|--------|----------|------|
| POST | `/api/invoice/verify` | Validate + calculate amounts; no DGI submit |
| GET | `/api/invoice/getVerify` | Re-read a verified but unsubmitted invoice |
| POST | `/api/invoice/confirm` | Confirm and submit to DGI |
| GET | `/api/invoice/getElectronicInvoice` | Fetch confirmed FNE + fiscal number + certificate |
| DELETE | `/api/invoice/delete` | Delete pending invoice before confirm |
| POST | `/api/invoice/create` | Verify + confirm in one call |
| POST | `/api/invoice/createCreditNote` | Credit note on a confirmed invoice |

## Recommended flow

1. Prefer **verify → review → confirm** while integrating.
2. Use **create** once the integration is battle-tested.
3. A DGI-confirmed FNE is irreversible; fix mistakes with a credit note (also declared).

## Example (verify)

```bash
curl -X POST "https://app.kompto.com/api/invoice/verify" \
  -H "Content-Type: application/json; charset=utf-8" \
  -H "Authorization: Bearer {api_key}" \
  -d '{
        "clientType": "B2B",
        "clientName": "KOUAME ET FRERES SARL",
        "clientNCC": "8200001A",
        "clientTelephone": "2721212121",
        "clientEmail": "contact@example.com",
        "paymentMethod": "transfer",
        "items": [
          {
            "itemName": "Prestation de conseil",
            "itemQuantity": 2,
            "itemUnitPrice": 50000,
            "itemTVAName": "TVA"
          }
        ]
      }'
```

Send raw sale data only. Do not send pre-calculated totals — KOMPTO / DGI compute them.

## Client types

- `B2B` — Ivorian company (NCC required)
- `B2C` — individual
- `B2G` — public administration
- `B2F` — foreign client (currency + FX rate)

## VAT codes

- `TVA` — 18%
- `TVAB` — 9%
- `TVAC` / `TVAD` / `TVAE` — 0% (convention / legal exemption / export)

## Payment methods (public page)

Cash, card, cheque, mobile money (Wave, Orange Money, MTN Money), transfer, deferred.

## Test vs production

KOMPTO provides a shared test environment with the same endpoints (test invoices have no fiscal value). Production changes: base URL, API key, establishment + point-of-sale identifiers.

Full field-level docs and error index are delivered when access is opened (private guide emailed to Babacar).
