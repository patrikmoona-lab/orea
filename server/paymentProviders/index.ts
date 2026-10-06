import { IPaymentProvider, PaymentProviderId } from './PaymentProvider';
import { MtnPaymentProvider } from './MtnProvider';
import { AirtelPaymentProvider } from './AirtelProvider';
import { OrangePaymentProvider } from './OrangeProvider';
import { WavePaymentProvider } from './WaveProvider';
import { CardPaymentProvider } from './CardProvider';
import { PayPalPaymentProvider } from './PayPalProvider';

export * from './PaymentProvider';
export * from './MtnProvider';
export * from './AirtelProvider';
export * from './OrangeProvider';
export * from './WaveProvider';
export * from './CardProvider';
export * from './PayPalProvider';

const providerRegistry: Record<PaymentProviderId, IPaymentProvider> = {
  mtn: new MtnPaymentProvider(),
  airtel: new AirtelPaymentProvider(),
  orange: new OrangePaymentProvider(),
  wave: new WavePaymentProvider(),
  card: new CardPaymentProvider(),
  paypal: new PayPalPaymentProvider(),
};

export function getPaymentProvider(id: PaymentProviderId): IPaymentProvider {
  const provider = providerRegistry[id];
  if (!provider) {
    throw new Error(`Fournisseur de paiement non supporté : ${id}`);
  }
  return provider;
}
