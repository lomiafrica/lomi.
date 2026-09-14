import React from "react";
import {
  StripeProvider,
  useStripe,
  CardField as StripeCardField,
  usePaymentSheet as useStripePaymentSheet,
  useConfirmPayment as useStripeConfirmPayment,
} from "@stripe/stripe-react-native";

// Re-export types
export type { CardFieldInput } from "@stripe/stripe-react-native";

/**
 * lomi. Platform Key
 *
 * Internal platform key used for payment processing infrastructure.
 * This is an immutable value - SDK updates required if changed.
 */
const LOMI_PLATFORM_KEY =
  "pk_live_51Ig94GGwgS0qnVOVpvSCeUiAf5RfjFFcv4alY8MpuB1M3X7gz3gMdcAoUA7OjG6e0Y2MAOtCsaYqkdqHT0zhTcC800gRyH9ssq";

// Types
export interface LomiProviderProps {
  publishableKey: string; // Your lomi_pk_... key (validated but not used for Stripe init)
  merchantIdentifier?: string; // Apple Pay merchant ID
  urlScheme?: string; // For 3DS redirects
  children: React.ReactElement | React.ReactElement[];
}

/**
 * LomiProvider - Wrap your app with this to enable lomi. payments
 *
 * @example
 * ```tsx
 * import { LomiProvider } from '@lomi./react-native';
 *
 * function App() {
 *   return (
 *     <LomiProvider
 *       publishableKey="lomi_pk_..."
 *       merchantIdentifier="merchant.com.yourapp"
 *     >
 *       <YourApp />
 *     </LomiProvider>
 *   );
 * }
 * ```
 */
export const LomiProvider: React.FC<LomiProviderProps> = ({
  publishableKey,
  children,
  ...props
}) => {
  // Validate lomi. key format
  if (!publishableKey?.startsWith("lomi_pk_")) {
    console.warn(
      '[Lomi] Invalid key format. Keys should start with "lomi_pk_"',
    );
  }

  return (
    <StripeProvider publishableKey={LOMI_PLATFORM_KEY} {...props}>
      {children}
    </StripeProvider>
  );
};

/**
 * useLomi - Access lomi. payment methods
 *
 * @example
 * ```tsx
 * const { confirmPayment, createPaymentMethod } = useLomi();
 *
 * const handlePay = async () => {
 *   const { error, paymentIntent } = await confirmPayment(clientSecret, {
 *     paymentMethodType: 'Card',
 *   });
 * };
 * ```
 */
export const useLomi = () => {
  return useStripe();
};

/**
 * useLomiPaymentSheet - Use the Lomi-branded payment sheet
 *
 * @example
 * ```tsx
 * const { initPaymentSheet, presentPaymentSheet } = useLomiPaymentSheet();
 *
 * await initPaymentSheet({ paymentIntentClientSecret: 'pi_xxx' });
 * const { error } = await presentPaymentSheet();
 * ```
 */
export const useLomiPaymentSheet = () => {
  return useStripePaymentSheet();
};

/**
 * useLomiConfirmPayment - Confirm a payment with card details
 */
export const useLomiConfirmPayment = () => {
  return useStripeConfirmPayment();
};

/**
 * LomiCardField - Card input component
 *
 * @example
 * ```tsx
 * <LomiCardField
 *   postalCodeEnabled={false}
 *   onCardChange={(cardDetails) => {
 *     setCard(cardDetails);
 *   }}
 *   style={{ height: 50 }}
 * />
 * ```
 */
export const LomiCardField = (
  props: React.ComponentProps<typeof StripeCardField>,
) => {
  return <StripeCardField {...props} />;
};

// Default export
export default {
  LomiProvider,
  useLomi,
  useLomiPaymentSheet,
  useLomiConfirmPayment,
  LomiCardField,
};
