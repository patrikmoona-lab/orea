import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Phone,
  Navigation,
  MapPin,
  Clock,
  ShieldAlert,
  Search,
  CheckCircle2,
  ExternalLink,
  LocateFixed,
  Building2,
  Cross,
  Stethoscope,
  Ambulance,
} from 'lucide-react';
import { EMERGENCY_FACILITIES_SEED } from '../data';
import { EmergencyFacility, EmergencyFacilityType } from '../types';
import { OREASymbol } from './OREALogo';
import { OreaButton } from './common/OreaButton';
import oreaUrgenceCareImg from '../assets/images/orea_urgence_care_1788513835421.jpg';

interface OreaUrgenceViewProps {
  onBackToHome: () => void;
}

export const OreaUrgenceView: React.FC<OreaUrgenceViewProps> = ({ onBackToHome }) => {
  const [facilities, setFacilities] = useState<EmergencyFacility[]>(EMERGENCY_FACILITIES_SEED);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'located' | 'denied'>('idle');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<EmergencyFacility | null>(facilities[0]);

  // Handle Geolocation
  const handleUseLocation = () => {
    setLocationStatus('locating');
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setLocationStatus('located');

        // Recalculate distance roughly for demonstration
        const updated = facilities.map((fac) => {
          // Haversine approximation in km
          const dLat = (fac.lat - latitude) * 111;
          const dLng = (fac.lng - longitude) * 85;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          return {
            ...fac,
            distanceKm: parseFloat(dist.toFixed(1)),
          };
        }).sort((a, b) => a.distanceKm - b.distanceKm);

        setFacilities(updated);
        setSelectedFacility(updated[0] || null);
      },
      () => {
        // Fallback gracefully (permission denied or timeout in iframe)
        setLocationStatus('denied');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Filter facilities
  const filteredFacilities = facilities.filter((fac) => {
    const matchesType = selectedType === 'all' || fac.type === selectedType;
    const matchesOpen = !onlyOpenNow || fac.isOpen24_7 || fac.currentStatus.includes('Ouvert');
    const matchesCity =
      !searchCity ||
      fac.name.toLowerCase().includes(searchCity.toLowerCase()) ||
      fac.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      fac.address.toLowerCase().includes(searchCity.toLowerCase());

    return matchesType && matchesOpen && matchesCity;
  });

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen py-8 sm:py-12">
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <OreaButton
            variant="outline"
            size="sm"
            onClick={onBackToHome}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour à l'accueil
          </OreaButton>
          <span className="text-slate-400">/</span>
          <div className="inline-flex items-center gap-1.5">
            <OREASymbol className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#dc2626]">OREA Urgence</span>
          </div>
        </div>

        {/* VITAL EMERGENCY ALERT BANNER (Immediate access to 15, 112, 18) */}
        <div className="w-full rounded-2xl sm:rounded-3xl bg-[#fef2f2] border-2 border-[#fca5a5] p-5 sm:p-7 shadow-[0_8px_30px_rgba(220,38,38,0.12)] mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#dc2626] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/30">
                <ShieldAlert className="w-7 h-7" strokeWidth={2.2} />
              </div>
              <div>
                <span className="inline-block text-xs font-black tracking-widest text-[#dc2626] uppercase bg-white/90 px-2.5 py-0.5 rounded-md border border-[#fecaca] mb-1">
                  URGENCE VITALE IMMÉDIATE
                </span>
                <h2 className="text-[20px] sm:text-[24px] font-extrabold text-[#7f1d1d] leading-snug">
                  En cas de détresse vitale, contactez immédiatement les secours
                </h2>
                <p className="text-xs sm:text-sm text-[#991b1b] mt-1 max-w-2xl leading-relaxed">
                  Perte de connaissance, douleur aiguë dans la poitrine, difficulté respiratoire sévère, hémorragie importante ou suspicion d'AVC. Ne perdez pas une seconde.
                </p>
              </div>
            </div>

            {/* Direct Emergency Call Buttons with OreaButton */}
            <div className="flex flex-wrap items-center gap-3">
              <a href="tel:15" className="flex-1 sm:flex-none">
                <OreaButton
                  variant="urgence"
                  size="md"
                  icon={<Phone className="w-4.5 h-4.5 fill-current" />}
                  fullWidth
                >
                  15 — SAMU
                </OreaButton>
              </a>
              <a href="tel:112" className="flex-1 sm:flex-none">
                <OreaButton
                  variant="secondary"
                  size="md"
                  icon={<Phone className="w-4.5 h-4.5" />}
                  fullWidth
                >
                  112 — Urgence UE
                </OreaButton>
              </a>
              <a href="tel:18" className="flex-1 sm:flex-none">
                <OreaButton
                  variant="outline"
                  size="md"
                  icon={<Phone className="w-4.5 h-4.5 text-red-600" />}
                  fullWidth
                >
                  18 — Pompiers
                </OreaButton>
              </a>
            </div>
          </div>
        </div>

        {/* Page Title & Geolocation Controls with Image 2 Integration */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-8 shadow-[0_4px_24px_rgba(37,99,235,0.04)] mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-xs font-semibold mb-3">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Accueil & Orientation Immédiate</span>
              </div>
              <h1 className="text-[28px] sm:text-[36px] font-extrabold text-[#0f2347] tracking-tight leading-tight">
                Besoin d'aide maintenant ?
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#64748b] mt-2 max-w-xl leading-relaxed">
                Trouvez rapidement un service de santé, hôpital, pharmacie de garde ou centre médical proche de vous avec prise en charge organisée.
              </p>

              {/* Geolocation Button & Search Bar */}
              <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <OreaButton
                  variant="sante"
                  size="md"
                  onClick={handleUseLocation}
                  disabled={locationStatus === 'locating'}
                  isLoading={locationStatus === 'locating'}
                  icon={<LocateFixed className="w-4.5 h-4.5" />}
                >
                  {locationStatus === 'locating'
                    ? 'Localisation en cours...'
                    : locationStatus === 'located'
                    ? 'Position actualisée ✓'
                    : 'Utiliser ma position'}
                </OreaButton>

                {/* Manual Search */}
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="Ville, code postal, adresse..."
                    className="pl-9 pr-4 py-3 rounded-xl border border-[#d1e2f2] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none w-full"
                  />
                </div>
              </div>

              {locationStatus === 'denied' && (
                <p className="text-xs text-[#b91c1c] mt-3 bg-[#fef2f2] p-2.5 rounded-lg border border-[#fecaca]">
                  La géolocalisation est désactivée ou bloquée par le navigateur. Vous pouvez saisir une ville manuellement ci-dessus.
                </p>
              )}
            </div>

            {/* Photo Column with shallow depth of field & editorial quality */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#fed7d7] group">
                <img
                  src={oreaUrgenceCareImg}
                  alt="Équipe soignante OREA accueillant un patient dans un service d'urgence moderne et rassurant"
                  className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11.5px] font-medium drop-shadow-sm flex items-center justify-between">
                  <span>Prise en charge attentive & organisée</span>
                  <span className="font-bold text-red-200">OREA Urgence</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Big Actions Buttons / Filters */}
          <div className="mt-8 pt-6 border-t border-[#f0f4f9]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] block mb-3">
              Sélectionnez un type d'établissement :
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <button
                onClick={() => setSelectedType(selectedType === 'urgence' ? 'all' : 'urgence')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedType === 'urgence'
                    ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-md shadow-red-500/20'
                    : 'bg-[#fffbfb] border-[#fed7d7] text-[#7f1d1d] hover:border-[#f87171] hover:bg-[#fff5f5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Ambulance className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase">24/7</span>
                </div>
                <div>
                  <h4 className="text-[16px] font-extrabold leading-tight">🚑 Urgences</h4>
                  <p className={`text-xs mt-0.5 ${selectedType === 'urgence' ? 'text-white/80' : 'text-slate-500'}`}>
                    Prise en charge vitale & traumatologie
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedType(selectedType === 'hopital' ? 'all' : 'hopital')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedType === 'hopital'
                    ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-md shadow-blue-500/20'
                    : 'bg-white border-[#dce9f6] text-[#0f2347] hover:border-[#93c5fd] hover:bg-[#f8fbfe]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-6 h-6 text-[#2563eb]" />
                  <span className="text-xs font-bold uppercase text-slate-400">Soins</span>
                </div>
                <div>
                  <h4 className="text-[16px] font-extrabold leading-tight">🏥 Hôpitaux</h4>
                  <p className={`text-xs mt-0.5 ${selectedType === 'hopital' ? 'text-white/80' : 'text-slate-500'}`}>
                    Services hospitaliers & cliniques
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedType(selectedType === 'pharmacie' ? 'all' : 'pharmacie')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedType === 'pharmacie'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-white border-[#dce9f6] text-[#0f2347] hover:border-[#93c5fd] hover:bg-[#f8fbfe]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Cross className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs font-bold uppercase text-slate-400">Garde</span>
                </div>
                <div>
                  <h4 className="text-[16px] font-extrabold leading-tight">💊 Pharmacies</h4>
                  <p className={`text-xs mt-0.5 ${selectedType === 'pharmacie' ? 'text-white/80' : 'text-slate-500'}`}>
                    Pharmacies de garde & nuit
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedType(selectedType === 'centre' ? 'all' : 'centre')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedType === 'centre'
                    ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-md shadow-blue-500/20'
                    : 'bg-white border-[#dce9f6] text-[#0f2347] hover:border-[#93c5fd] hover:bg-[#f8fbfe]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Stethoscope className="w-6 h-6 text-[#2563eb]" />
                  <span className="text-xs font-bold uppercase text-slate-400">Proximité</span>
                </div>
                <div>
                  <h4 className="text-[16px] font-extrabold leading-tight">🩺 Centres de santé</h4>
                  <p className={`text-xs mt-0.5 ${selectedType === 'centre' ? 'text-white/80' : 'text-slate-500'}`}>
                    Maisons médicales & consultations
                  </p>
                </div>
              </button>
            </div>

            {/* Toggle Only Open Now */}
            <div className="mt-4 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0f2347] cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyOpenNow}
                  onChange={(e) => setOnlyOpenNow(e.target.checked)}
                  className="rounded text-[#2563eb] focus:ring-blue-500 w-4 h-4"
                />
                <span>Afficher uniquement les établissements ouverts maintenant (24h/24 & garde)</span>
              </label>
              {selectedType !== 'all' && (
                <button
                  onClick={() => setSelectedType('all')}
                  className="text-xs text-[#2563eb] hover:underline font-medium ml-auto"
                >
                  Réinitialiser le filtre
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results layout: List on Left, Map & Detail on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Facilities List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748b]">
                Établissements à proximité ({filteredFacilities.length})
              </h3>
              <span className="text-xs text-slate-400">Triés par distance approximative</span>
            </div>

            {filteredFacilities.length === 0 ? (
              <div className="p-12 bg-white rounded-2xl border border-[#dbeaf8] text-center">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-[#0f2347]">Aucun établissement trouvé</h4>
                <p className="text-sm text-[#64748b] mt-1 max-w-md mx-auto">
                  Modifiez vos critères de recherche ou décochez le filtre "Ouvert maintenant".
                </p>
              </div>
            ) : (
              filteredFacilities.map((fac) => {
                const isSelected = selectedFacility?.id === fac.id;
                const isUrgence = fac.type === 'urgence';

                return (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#2563eb] shadow-[0_6px_20px_rgba(37,99,235,0.12)] ring-2 ring-blue-100'
                        : 'bg-white border-[#dce9f6] hover:border-[#93c5fd] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              isUrgence
                                ? 'bg-[#fee2e2] text-[#b91c1c]'
                                : fac.type === 'pharmacie'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-[#eff6ff] text-[#2563eb]'
                            }`}
                          >
                            {fac.type === 'urgence' && 'URGENCES 24/7'}
                            {fac.type === 'hopital' && 'HÔPITAL'}
                            {fac.type === 'pharmacie' && 'PHARMACIE DE GARDE'}
                            {fac.type === 'centre' && 'CENTRE MÉDICAL'}
                          </span>

                          <span className="text-xs font-extrabold text-[#2563eb] bg-[#f0f7ff] px-2 py-0.5 rounded-md">
                            ~ {fac.distanceKm} km
                          </span>

                          {fac.isOpen24_7 && (
                            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Ouvert 24h/24
                            </span>
                          )}
                        </div>

                        <h4 className="text-[17px] font-bold text-[#0f2347] leading-snug">
                          {fac.name}
                        </h4>

                        <p className="text-xs sm:text-sm text-[#64748b] mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{fac.address}, {fac.city}</span>
                        </p>

                        <p className="text-xs text-[#1e293b] mt-1.5 flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                          <span>{fac.currentStatus}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons inside Card */}
                    <div className="mt-4 pt-3 border-t border-[#f0f4f9] flex flex-wrap items-center gap-2.5">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          fac.name + ' ' + fac.address + ' ' + fac.city
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3.5 py-1.5 rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Itinéraire</span>
                      </a>

                      {fac.phone && (
                        <a
                          href={`tel:${fac.phone.replace(/\s+/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0f2347] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Appeler ({fac.phone})</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Map Simulation & Detail Preview (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            {/* Visual Interactive Map Representation */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-5 shadow-[0_4px_24px_rgba(37,99,235,0.04)] overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#2563eb]" />
                  <span>Carte des services à proximité</span>
                </span>
                <span className="text-[11px] text-slate-400">Rayon ~ 5 km</span>
              </div>

              {/* Map Canvas Mockup */}
              <div className="relative w-full h-[260px] sm:h-[300px] rounded-2xl bg-[#e6edf5] border border-[#cbd5e1] overflow-hidden flex items-center justify-center">
                {/* SVG Map Grid Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Road lines simulation */}
                  <path d="M -20 80 Q 150 120 400 60" stroke="#ffffff" strokeWidth="8" fill="none" />
                  <path d="M 120 -20 Q 140 180 160 350" stroke="#ffffff" strokeWidth="6" fill="none" />
                  <path d="M 0 200 L 400 240" stroke="#ffffff" strokeWidth="5" fill="none" />
                </svg>

                {/* User position pulse marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full bg-blue-500/25 animate-ping absolute" />
                    <span className="w-4 h-4 rounded-full bg-[#2563eb] border-2 border-white shadow-md" />
                  </div>
                  <span className="text-[10px] font-bold bg-[#0f2347] text-white px-1.5 py-0.5 rounded shadow-sm mt-1">
                    Vous êtes ici
                  </span>
                </div>

                {/* Pins for facilities */}
                {filteredFacilities.slice(0, 5).map((fac, idx) => {
                  const isSelected = selectedFacility?.id === fac.id;
                  const offsets = [
                    { top: '25%', left: '30%' },
                    { top: '35%', left: '72%' },
                    { top: '68%', left: '22%' },
                    { top: '75%', left: '68%' },
                    { top: '18%', left: '80%' },
                  ];
                  const pos = offsets[idx % offsets.length];

                  return (
                    <button
                      key={fac.id}
                      onClick={() => setSelectedFacility(fac)}
                      style={{ top: pos.top, left: pos.left }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform hover:scale-110 ${
                        isSelected ? 'scale-125 z-30' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                          fac.type === 'urgence'
                            ? 'bg-[#dc2626] border-white text-white'
                            : fac.type === 'pharmacie'
                            ? 'bg-emerald-600 border-white text-white'
                            : 'bg-[#2563eb] border-white text-white'
                        }`}
                      >
                        {fac.type === 'urgence' && <Ambulance className="w-4 h-4" />}
                        {fac.type === 'pharmacie' && <Cross className="w-4 h-4" />}
                        {fac.type === 'hopital' && <Building2 className="w-4 h-4" />}
                        {fac.type === 'centre' && <Stethoscope className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected facility detail quick-box */}
              {selectedFacility && (
                <div className="mt-4 p-4 rounded-xl bg-[#f8fbfe] border border-[#d8ebfa]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#2563eb]">
                      {selectedFacility.name}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      ~ {selectedFacility.distanceKm} km
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b]">
                    {selectedFacility.address}, {selectedFacility.city}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        selectedFacility.name + ' ' + selectedFacility.address + ' ' + selectedFacility.city
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Ouvrir l'itinéraire</span>
                    </a>
                    {selectedFacility.phone && (
                      <a
                        href={`tel:${selectedFacility.phone.replace(/\s+/g, '')}`}
                        className="py-2 px-3 rounded-lg bg-white border border-[#cfe2f5] text-[#0f2347] hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Appeler</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
