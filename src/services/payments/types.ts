import { BillingCycle, PaymentProviderId, PlanId, PaymentStatus } from '../../types';

export interface PaymentRequestPayload {
  userId: string;
  userEmail: string;
  userName: string;
  planId: PlanId;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  provider: PaymentProviderId;
  phoneNumber?: string;
  cardNumberMasked?: string;
}

export interface PaymentResult {
  paymentId: string;
  transactionReference: string;
  status: PaymentStatus;
  provider: PaymentProviderId;
  instructions?: string;
  redirectUrl?: string;
  expiresAt?: string;
}

export interface PaymentProviderInfo {
  id: PaymentProviderId;
  name: string;
  category: 'mobile_money' | 'card' | 'international';
  description: string;
  logo: string;
  currencyAccepted: string[];
  requiresPhoneNumber: boolean;
  requiresCardDetails: boolean;
}

export const PAYMENT_PROVIDERS: PaymentProviderInfo[] = [
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    category: 'mobile_money',
    description: 'Paiement instantané via confirmation USSD sur votre mobile MTN (*105#)',
    logo: 'mtn',
    currencyAccepted: ['XAF', 'XOF'],
    requiresPhoneNumber: true,
    requiresCardDetails: false,
  },
  {
    id: 'airtel',
    name: 'Airtel Money',
    category: 'mobile_money',
    description: 'Paiement sécurisé via votre compte Airtel Money (*128#)',
    logo: 'airtel',
    currencyAccepted: ['XAF', 'XOF'],
    requiresPhoneNumber: true,
    requiresCardDetails: false,
  },
  {
    id: 'orange',
    name: 'Orange Money',
    category: 'mobile_money',
    description: 'Validation immédiate par code secret Orange Money (*144#)',
    logo: 'orange',
    currencyAccepted: ['XAF', 'XOF'],
    requiresPhoneNumber: true,
    requiresCardDetails: false,
  },
  {
    id: 'wave',
    name: 'Wave',
    category: 'mobile_money',
    description: 'Paiement sans frais avec scan de code QR ou numéro Wave',
    logo: 'wave',
    currencyAccepted: ['XAF', 'XOF'],
    requiresPhoneNumber: true,
    requiresCardDetails: false,
  },
  {
    id: 'card',
    name: 'Carte Bancaire (Visa / Mastercard)',
    category: 'card',
    description: 'Paiement sécurisé 3D-Secure par carte bancaire internationale',
    logo: 'card',
    currencyAccepted: ['XAF', 'EUR', 'USD'],
    requiresPhoneNumber: false,
    requiresCardDetails: true,
  },
  {
    id: 'paypal',
    name: 'PayPal International',
    category: 'international',
    description: 'Règlement international sécurisé via votre compte PayPal',
    logo: 'paypal',
    currencyAccepted: ['EUR', 'USD'],
    requiresPhoneNumber: false,
    requiresCardDetails: false,
  },
];
