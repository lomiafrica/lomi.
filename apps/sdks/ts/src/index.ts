/**
 * Main entry point for lomi. TypeScript SDK
 *
 * @module @lomi/sdk-typescript
 */

export { LomiSDK } from './sdk.js';
export { LomiClient } from './client.js';
export { requestWithClient, mapResponseToLomiError } from './http.js';
export { verifyWebhookSignature } from './webhook-verify.js';

export type { LomiConfig } from './config.js';
export type { LomiRequestOptions } from './request-options.js';

export {
  LomiError,
  LomiValidationError,
  LomiAuthError,
  LomiNotFoundError,
  LomiRateLimitError,
  ApiError,
} from './errors.js';
export type { LomiApiErrorBody } from './errors.js';

export { handleApiError } from './error-handler.js';

export {
  TransfersResource,
  isMoneyConfirmationRequired,
} from './resources/transfers.js';
export type {
  Transfer,
  TransferList,
  TransferType,
  MoneyConfirmationRequired,
  CreateTransferParams,
  ReverseTransferParams,
  ListTransfersParams,
} from './resources/transfers.js';
export {
  NetworkResource,
  NetworkAccountsResource,
  NetworkAccountSessionsResource,
} from './resources/network.js';
export type {
  LoginLink,
  AccountSession,
  AccountSessionComponent,
  AccountSessionComponents,
  CreateAccountSessionParams,
} from './resources/network.js';

export {
  loadLomi,
  lomi,
  createLomiElements,
  createLomiPaymentElement,
} from './elements.js';
export type {
  Lomi,
  LomiElements,
  LomiElementsOptions,
  LomiPaymentResult,
  LomiSetupResult,
  LomiPaymentElement,
  LomiPaymentElementCreateOptions,
  LomiPaymentElementTheme,
  LomiBillingAddressCollection,
  CreateLomiElementsOptions,
  CreateLomiPaymentElementOptions,
} from './elements.js';

export type { paths, components, operations } from './generated/schema.js';
export * from './generated/type-aliases.js';
export * from './generated/index.js';
