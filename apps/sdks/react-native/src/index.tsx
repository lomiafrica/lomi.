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
 * lomi. platform publishable keys for Stripe React Native.
 * Merchants pass `lomi_pk_test_…` / `lomi_pk_live_…`; these stay internal.
 */
const LOMI_PLATFORM_KEY_LIVE =
  "pk_live_51Ig94GGwgS0qnVOVpvSCeUiAf5RfjFFcv4alY8MpuB1M3X7gz3gMdcAoUA7OjG6e0Y2MAOtCsaYqkdqHT0zhTcC800gRyH9ssq";
const LOMI_PLATFORM_KEY_TEST =
  "pk_test_51Ig94GGwgS0qnVOVCTLJtrdam3tbuKhsLk931ddn9oYaQ2gDn768IDGJ6cgV0EJ1zfNsJpVURjVIl40UNo1R4KDz00lXLCcGXV";

function resolveLomiPlatformPublishableKey(publishableKey: string): string {
  return publishableKey.startsWith("lomi_pk_test_")
    ? LOMI_PLATFORM_KEY_TEST
    : LOMI_PLATFORM_KEY_LIVE;
}

// Types
export interface LomiProviderProps {
  publishableKey: string; // lomi_pk_test_... or lomi_pk_live_...
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
  if (!publishableKey?.startsWith("lomi_pk_")) {
    console.warn(
      '[Lomi] Invalid key format. Keys should start with "lomi_pk_"',
    );
  }

  return (
    <StripeProvider
      publishableKey={resolveLomiPlatformPublishableKey(publishableKey)}
      {...props}
    >
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
 * LomiCardField - Card input component.
 * Pass `cardStyle` for text color, background, radius, and size on iOS and Android.
 *
 * @example
 * ```tsx
 * <LomiCardField
 *   postalCodeEnabled={false}
 *   cardStyle={{
 *     backgroundColor: "#ffffff",
 *     textColor: "#111827",
 *     borderRadius: 4,
 *     fontSize: 13,
 *   }}
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
