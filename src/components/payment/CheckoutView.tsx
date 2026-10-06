import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  Smartphone,
  CreditCard,
  Globe,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { BillingCycle, OreaUserProfile, PlanId, PaymentProviderId, PaymentTransaction, OreaSubscription } from '../../types';
import { OREA_PLANS } from '../../data/plans';
import { PAYMENT_PROVIDERS } from '../../services/payments/types';
import { PaymentService } from '../../services/payments/paymentService';

interface CheckoutViewProps {
  planId: PlanId;
  billingCycle: BillingCycle;
  currentUserProfile: OreaUserProfile;
  onBackToPricing: () => void;
  onPaymentPending: (payment: any) => void;
  onPaymentSuccess: (payment: PaymentTransaction, subscription: OreaSubscription) => void;
  onPaymentFailed: (reason: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  planId,
  billingCycle,
  currentUserProfile,
  onBackToPricing,
  onPaymentPending,
  onPaymentSuccess,
  onPaymentFailed,
}) => {
  const plan = OREA_PLANS.find((p) => p.id === planId) || OREA_PLANS[1];
  const isYearly = billingCycle === 'yearly';
  const amount = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

  // Form states
  const [selectedProvider, setSelectedProvider] = useState<PaymentProviderId>('mtn');
  const [phoneNumber, setPhoneNumber] = useState(currentUserProfile.whatsapp || '');
  const [cardHolder, setCardHolder] = useState(
    currentUserProfile.displayName || `${currentUserProfile.firstName} ${currentUserProfile.lastName}`.trim()
  );
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Format Card input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const currentProviderInfo = PAYMENT_PROVIDERS.find((p) => p.id === selectedProvider);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (currentProviderInfo?.requiresPhoneNumber) {
      if (!phoneNumber || phoneNumber.trim().length < 8) {
        setErrorMessage('Veuillez renseigner un numéro de téléphone valide pour Mobile Money.');
        return;
      }
    }

    if (currentProviderInfo?.requiresCardDetails) {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setErrorMessage('Veuillez saisir un numéro de carte bancaire valide à 16 chiffres.');
        return;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage('Date d’expiration invalide (format MM/AA).');
        return;
      }
      if (cardCvc.length < 3) {
        setErrorMessage('Code CVC invalide (3 chiffres au dos de la carte).');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Initialiser le paiement auprès du serveur OREA
      const maskedCard = cardNumber ? `•••• •••• •••• ${cardNumber.replace(/\s/g, '').slice(-4)}` : undefined;

      const paymentResult = await PaymentService.createPayment({
        userId: currentUserProfile.uid,
        userEmail: currentUserProfile.email,
        userName: currentUserProfile.displayName || `${currentUserProfile.firstName} ${currentUserProfile.lastName}`.trim(),
        planId,
        billingCycle,
        amount,
        currency: 'XAF',
        provider: selectedProvider,
        phoneNumber: phoneNumber.trim() || undefined,
        cardNumberMasked: maskedCard,
      });

      // 2. Si le paiement nécessite une validation Mobile Money USSD / attente
      if (paymentResult.status === 'pending') {
        onPaymentPending(paymentResult);
        return;
      }

      // 3. Sinon, tenter la vérification immédiate
      const verification = await PaymentService.verifyPayment(
        paymentResult.paymentId,
        paymentResult.transactionReference
      );

      if (verification.isConfirmed && verification.payment && verification.subscription) {
        onPaymentSuccess(verification.payment, verification.subscription);
      } else {
        onPaymentPending(paymentResult);
      }
    } catch (err: any) {
      console.error('[Checkout Error]', err);
      const msg = err.message || 'Le paiement n’a pas pu être initialisé. Veuillez vérifier vos coordonnées.';
      setErrorMessage(msg);
      onPaymentFailed(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBackToPricing}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0B2F5B] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux forfaits OREA</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2F5B] tracking-tight">
            Finalisation de votre abonnement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Paiement sécurisé et activation immédiate de votre compte OREA.
          </p>
        </div>

        {/* Two Column Layout: Left = Summary, Right = Payment Methods & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Plan Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#cfe2f5] shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0056d6] bg-blue-50 px-2.5 py-1 rounded-md">
                  Forfait sélectionné
                </span>
                <h3 className="text-xl font-black text-[#0B2F5B] mt-2">{plan.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-[#0B2F5B]">
                  {amount.toLocaleString('fr-FR')}
                </span>
                <span className="block text-[11px] font-bold text-slate-500">
                  FCFA {isYearly ? '/ an' : '/ mois'}
                </span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="py-4 space-y-2.5 text-xs sm:text-sm border-b border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Cycle de facturation</span>
                <strong className="text-slate-800 font-bold">
                  {isYearly ? 'Annuel (Économique)' : 'Mensuel'}
                </strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Titulaire du compte</span>
                <strong className="text-slate-800 font-bold truncate max-w-[200px]">
                  {currentUserProfile.displayName || currentUserProfile.email}
                </strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Email de confirmation</span>
                <strong className="text-slate-800 font-bold truncate max-w-[200px]">
                  {currentUserProfile.email}
                </strong>
              </div>
            </div>

            {/* Total Amount Block */}
            <div className="py-4 border-b border-slate-100 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-700">Total à régler :</span>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-[#0056d6]">
                  {amount.toLocaleString('fr-FR')} FCFA
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Taxes et frais de transfert inclus</p>
              </div>
            </div>

            {/* Features Included Recap */}
            <div className="mt-5 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Inclus dans {plan.name} :
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Guarantee Box */}
            <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-snug">
                Connexion chiffrée SSL 256-bit. Aucune coordonnée bancaire complète n’est conservée sur nos serveurs.
              </p>
            </div>
          </div>

          {/* Right Column: Payment Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2f5] shadow-sm">
            <h2 className="text-lg font-black text-[#0B2F5B] mb-4">
              Choisissez votre mode de paiement
            </h2>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
              {PAYMENT_PROVIDERS.map((provider) => {
                const isSelected = selectedProvider === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0056d6] bg-blue-50/70 ring-2 ring-[#0056d6]/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {provider.category === 'mobile_money' ? (
                        <Smartphone className={`w-5 h-5 ${isSelected ? 'text-[#0056d6]' : 'text-slate-500'}`} />
                      ) : provider.category === 'card' ? (
                        <CreditCard className={`w-5 h-5 ${isSelected ? 'text-[#0056d6]' : 'text-slate-500'}`} />
                      ) : (
                        <Globe className={`w-5 h-5 ${isSelected ? 'text-[#0056d6]' : 'text-slate-500'}`} />
                      )}
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#0056d6] bg-[#0056d6]' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {provider.name}
                      </p>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {provider.category.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Provider Instructions */}
            {currentProviderInfo && (
              <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-slate-600 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#0056d6] shrink-0 mt-0.5" />
                <p>{currentProviderInfo.description}</p>
              </div>
            )}

            {/* Payment Fields Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Mobile Money Phone Input */}
              {currentProviderInfo?.requiresPhoneNumber && (
                <div>
                  <label htmlFor="input-momo-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Numéro de téléphone ({currentProviderInfo.name})
                  </label>
                  <div className="relative">
                    <input
                      id="input-momo-phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+242 06 123 45 67 ou +237 6XX XXX XXX"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0056d6] focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Le compte doit disposer du solde de {amount.toLocaleString('fr-FR')} FCFA pour approuver la transaction.
                  </p>
                </div>
              )}

              {/* Credit Card Inputs */}
              {currentProviderInfo?.requiresCardDetails && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="input-card-holder" className="block text-xs font-bold text-slate-700 mb-1">
                      Nom sur la carte
                    </label>
                    <input
                      id="input-card-holder"
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="PATRICK MOONA"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0056d6] focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label htmlFor="input-card-number" className="block text-xs font-bold text-slate-700 mb-1">
                      Numéro de carte Visa / Mastercard
                    </label>
                    <input
                      id="input-card-number"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0056d6] focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="input-card-expiry" className="block text-xs font-bold text-slate-700 mb-1">
                        Expiration (MM/AA)
                      </label>
                      <input
                        id="input-card-expiry"
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="12/28"
                        maxLength={5}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0056d6] focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label htmlFor="input-card-cvc" className="block text-xs font-bold text-slate-700 mb-1">
                        CVC (3 chiffres)
                      </label>
                      <input
                        id="input-card-cvc"
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0056d6] focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Notice */}
              {selectedProvider === 'paypal' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">Compte PayPal International</p>
                  <p>
                    Le montant de {amount.toLocaleString('fr-FR')} FCFA sera converti automatiquement au taux officiel du jour par PayPal lors de la validation.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  id="btn-pay-now"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0056d6] to-[#00A6C7] hover:from-[#0B2F5B] hover:to-[#0056d6] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Traitement sécurisé en cours...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Payer {amount.toLocaleString('fr-FR')} FCFA</span>
                    </>
                  )}
                </button>
              </div>

              {/* Reassurance text */}
              <p className="text-center text-[11px] text-slate-400 mt-2">
                En confirmant, vous acceptez les conditions de service OREA.
                Votre abonnement débutera immédiatement.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
