-- Proposed FNE / KOMPTO persistence. DO NOT APPLY from this PR.
-- Follow-up: fold into apps/dashboard/supabase/migrations/ (canonical numbered
-- files), then generate types with pnpm types:generate. See docs/fne-kompto.md.
--
-- This is a shape for Cursor, not a live migration. Table and RPC names may
-- change to match existing invoicing conventions.

-- Merchant invoice certification plus platform commission batches.
-- One row per certification attempt that must stay retry-safe.

create table if not exists public.fne_certifications (
  fne_certification_id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (organization_id),
  scope text not null check (scope in ('merchant_invoice', 'platform_commission')),
  customer_invoice_id uuid null references public.customer_invoices (customer_invoice_id),
  period_start timestamptz null,
  period_end timestamptz null,
  status text not null check (
    status in (
      'not_requested',
      'verify_pending',
      'verified',
      'confirm_pending',
      'certified',
      'failed',
      'voided'
    )
  ),
  kompto_invoice_id text null,
  dgi_identifier text null,
  qr_payload text null,
  pdf_url text null,
  last_error text null,
  certified_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fne_certifications_merchant_invoice_unique unique (scope, customer_invoice_id),
  constraint fne_certifications_commission_period_unique unique (scope, organization_id, period_start, period_end),
  constraint fne_certifications_kompto_invoice_unique unique (kompto_invoice_id)
);

create index if not exists fne_certifications_organization_status_idx
  on public.fne_certifications (organization_id, status);

comment on table public.fne_certifications is
  'KOMPTO FNE certification state. Production enablement is blocked until finance confirms commission treatment.';

-- Suggested follow-up RPCs (not created here):
--   certify_customer_invoice_fne
--   list_fne_certifications
--   preview_fne_commission_aggregation
-- Admin commit of commission FNE must stay a separate RPC that no merchant JWT can call.
