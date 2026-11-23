/**
 * Read-only production check for payments and payouts.
 *
 * It prices one live Wave payment, one live card payment, and one payout
 * fee. It then counts recent live outcomes. It does not insert a checkout,
 * a payout, or any other row.
 *
 * SUPABASE_DB_URL must be the production project mdswvokxrnfggrujsfjd.
 */
import pg from 'pg';
import { moneyWatchFailures } from './prod-money-watch-rules.mjs';

const PROD_REF = 'mdswvokxrnfggrujsfjd';
const TEST_REF = 'aznvppizdjrncqhnknrc';

const SNAPSHOT = `
SELECT json_build_object(
  'fee_filters_processing', (
    SELECT position('fee_category = ''payment_processing''' IN pg_get_functiondef(
      'public.calculate_transaction_fee(uuid,numeric,currency_code,provider_code,payment_method_code,boolean)'::regprocedure
    )) > 0
  ),
  'starter_mobile_pct', (
    SELECT max(tfs.percentage)
    FROM tier_fee_structure tfs
    JOIN pricing_tiers pt ON pt.tier_id = tfs.tier_id
    WHERE pt.tier_name = 'Starter' AND pt.currency_code = 'XOF' AND tfs.is_active
      AND tfs.fee_category = 'payment_processing' AND tfs.fee_subcategory = 'mobile_money'
  ),
  'starter_card_pct', (
    SELECT max(tfs.percentage)
    FROM tier_fee_structure tfs
    JOIN pricing_tiers pt ON pt.tier_id = tfs.tier_id
    WHERE pt.tier_name = 'Starter' AND pt.currency_code = 'XOF' AND tfs.is_active
      AND tfs.fee_category = 'payment_processing' AND tfs.fee_subcategory = 'cards'
  ),
  'starter_card_fixed', (
    SELECT max(tfs.fixed_amount)
    FROM tier_fee_structure tfs
    JOIN pricing_tiers pt ON pt.tier_id = tfs.tier_id
    WHERE pt.tier_name = 'Starter' AND pt.currency_code = 'XOF' AND tfs.is_active
      AND tfs.fee_category = 'payment_processing' AND tfs.fee_subcategory = 'cards'
  ),
  'starter_own_payout_pct', (
    SELECT max(tfs.percentage)
    FROM tier_fee_structure tfs
    JOIN pricing_tiers pt ON pt.tier_id = tfs.tier_id
    WHERE pt.tier_name = 'Starter' AND pt.currency_code = 'XOF' AND tfs.is_active
      AND tfs.fee_category = 'payout' AND tfs.fee_subcategory = 'mobile_money_payout'
  ),
  'starter_beneficiary_pct', (
    SELECT max(tfs.percentage)
    FROM tier_fee_structure tfs
    JOIN pricing_tiers pt ON pt.tier_id = tfs.tier_id
    WHERE pt.tier_name = 'Starter' AND pt.currency_code = 'XOF' AND tfs.is_active
      AND tfs.fee_category = 'payout' AND tfs.fee_subcategory = 'mobile_money_beneficiary'
  ),
  'sample_wave_fee', (
    SELECT f.fee_amount
    FROM transactions t
    CROSS JOIN LATERAL public.calculate_transaction_fee(
      t.organization_id, 10000, 'XOF', 'WAVE', 'MOBILE_MONEY', false
    ) f
    WHERE t.environment = 'live' AND t.status = 'completed' AND t.transaction_type = 'payment'
      AND t.provider_code = 'WAVE'
    ORDER BY t.created_at DESC
    LIMIT 1
  ),
  'sample_card_fee', (
    SELECT f.fee_amount
    FROM transactions t
    CROSS JOIN LATERAL public.calculate_transaction_fee(
      t.organization_id, 10000, 'XOF', 'STRIPE', 'CARDS', false
    ) f
    WHERE t.environment = 'live' AND t.status = 'completed' AND t.transaction_type = 'payment'
      AND t.provider_code = 'STRIPE' AND t.payment_method_code = 'CARDS'
    ORDER BY t.created_at DESC
    LIMIT 1
  ),
  'sample_own_payout_fee', (
    SELECT f.fee_amount
    FROM transactions t
    CROSS JOIN LATERAL public.calculate_payout_fee(
      t.organization_id, 10000, 'XOF', 'WAVE', 'MOBILE_MONEY', 'mobile_money_payout'
    ) f
    WHERE t.environment = 'live' AND t.status = 'completed' AND t.transaction_type = 'payment'
      AND t.provider_code = 'WAVE'
    ORDER BY t.created_at DESC
    LIMIT 1
  ),
  'sample_beneficiary_fee', (
    SELECT f.fee_amount
    FROM transactions t
    CROSS JOIN LATERAL public.calculate_payout_fee(
      t.organization_id, 10000, 'XOF', 'WAVE', 'MOBILE_MONEY', 'mobile_money_beneficiary'
    ) f
    WHERE t.environment = 'live' AND t.status = 'completed' AND t.transaction_type = 'payment'
      AND t.provider_code = 'WAVE'
    ORDER BY t.created_at DESC
    LIMIT 1
  ),
  'payment_attempts', (
    SELECT count(*) FROM transactions
    WHERE environment = 'live' AND transaction_type = 'payment'
      AND created_at > now() - interval '24 hours'
  ),
  'payment_completed', (
    SELECT count(*) FROM transactions
    WHERE environment = 'live' AND transaction_type = 'payment' AND status = 'completed'
      AND created_at > now() - interval '24 hours'
  ),
  'uncredited', (
    SELECT count(*) FROM transactions t
    WHERE t.environment = 'live' AND t.transaction_type = 'payment' AND t.status = 'completed'
      AND t.gross_amount > 0
      AND t.created_at > now() - interval '48 hours'
      AND t.created_at < now() - interval '30 minutes'
      AND COALESCE((t.metadata->>'balance_updated')::boolean, false) IS NOT TRUE
      AND NOT EXISTS (
        SELECT 1 FROM account_balance_history h WHERE h.transaction_id = t.transaction_id
      )
  ),
  'stuck_wave', (
    SELECT count(*) FROM (
      SELECT payout_id FROM payouts
      WHERE environment = 'live' AND provider_code = 'WAVE'
        AND status IN ('pending', 'processing')
        AND created_at < now() - interval '3 hours'
      UNION ALL
      SELECT payout_id FROM beneficiary_payouts
      WHERE provider_code = 'WAVE'
        AND status IN ('pending', 'processing')
        AND created_at < now() - interval '3 hours'
    ) s
  ),
  'stuck_processing', (
    SELECT count(*) FROM (
      SELECT payout_id FROM payouts
      WHERE environment = 'live' AND status = 'processing'
        AND created_at < now() - interval '6 hours'
      UNION ALL
      SELECT payout_id FROM beneficiary_payouts
      WHERE status = 'processing'
        AND created_at < now() - interval '6 hours'
    ) s
  )
) AS snapshot
`;

function requireProdUrl() {
  const value = process.env.SUPABASE_DB_URL?.trim() ?? '';
  if (!value) {
    throw new Error('SUPABASE_DB_URL is not set. Refusing.');
  }
  if (!value.includes(PROD_REF) || value.includes(TEST_REF)) {
    throw new Error(
      'SUPABASE_DB_URL is not the production database. Refusing.',
    );
  }
  return value;
}

function isSnapshotObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

async function readSnapshot(connectionString) {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 15_000,
  });
  await client.connect();
  try {
    await client.query('BEGIN READ ONLY');
    await client.query("SET LOCAL statement_timeout = '15s'");
    const result = await client.query(SNAPSHOT);
    await client.query('COMMIT');
    const snapshot = result.rows[0]?.snapshot;
    if (!isSnapshotObject(snapshot)) {
      throw new Error('Production money snapshot was empty.');
    }
    return snapshot;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

async function main() {
  const snapshot = await readSnapshot(requireProdUrl());
  const failures = moneyWatchFailures(snapshot);
  console.log(
    `Live payments ${snapshot.payment_completed}/${snapshot.payment_attempts} completed in 24h. Uncredited ${snapshot.uncredited}. Stuck Wave payouts ${snapshot.stuck_wave}. Stuck processing ${snapshot.stuck_processing}.`,
  );
  if (failures.length === 0) {
    console.log('Production payment and payout check passed.');
    return;
  }
  for (const failure of failures) console.error(failure);
  process.exitCode = 1;
}

const entry = process.argv[1] ?? '';
if (entry.endsWith('prod-money-watch.mjs')) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
