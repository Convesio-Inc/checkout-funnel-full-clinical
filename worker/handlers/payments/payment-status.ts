/**
 * ConvesioPay-related lifecycle values stored in `payments.cpay_status`.
 *
 * - **`pending`** — Submitted to ConvesioPay (`cpay_id` set); awaiting a
 *   terminal status (poll `/poll-payment` or cron reconciliation).
 * - **`scheduled`** — Deferred upsell: not yet sent upstream (`cpay_id`
 *   null). The sync cron POSTs to stored-card, then moves to `success`,
 *   `pending`, or `failed`.
 * - **`success`** / **`failed`** — Terminal outcomes after upstream
 *   resolution (or cron marking a deferred charge as failed).
 */
export const CPAY_STATUS_PENDING = 'pending';
export const CPAY_STATUS_SCHEDULED = 'scheduled';
export const CPAY_STATUS_SUCCESS = 'success';
export const CPAY_STATUS_FAILED = 'failed';
