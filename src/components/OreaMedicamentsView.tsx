import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Pill,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Bell,
  BellOff,
  ShieldCheck,
  Calendar,
  X,
} from 'lucide-react';
import { MEDICATIONS_DATABASE, DEFAULT_MEDICATION_REMINDERS } from '../data';
import { MedicationInfo, MedicationReminder } from '../types';
import { OREASymbol } from './OREALogo';
import oreaMedsPharmacyImg from '../assets/images/orea_meds_pharmacy_1788513853266.jpg';

interface OreaMedicamentsViewProps {
  onBackToHome: () => void;
}

export const OreaMedicamentsView: React.FC<OreaMedicamentsViewProps> = ({ onBackToHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<MedicationInfo | null>(MEDICATIONS_DATABASE[0]);
  const [activeTab, setActiveTab] = useState<'catalogue' | 'rappels'>('catalogue');

  // Reminders state with localStorage persistence
  const [reminders, setReminders] = useState<MedicationReminder[]>(() => {
    try {
      const saved = localStorage.getItem('orea_med_reminders');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_MEDICATION_REMINDERS;
  });

  // Modal for new reminder
  const [isNewReminderOpen, setIsNewReminderOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'twice_daily' | 'weekly' | 'as_needed'>('daily');
  const [newNotes, setNewNotes] = useState('');
  const [newNotify, setNewNotify] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('orea_med_reminders', JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders]);

  // Filtered medications
  const filteredMeds = MEDICATIONS_DATABASE.filter((med) => {
    const q = searchQuery.toLowerCase();
    return (
      med.name.toLowerCase().includes(q) ||
      med.genericName.toLowerCase().includes(q) ||
      med.indications.some((i) => i.toLowerCase().includes(q))
    );
  });

  // Add reminder handler
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const newReminder: MedicationReminder = {
      id: 'rem-' + Date.now(),
      medicationName: newMedName.trim(),
      dosage: newDosage.trim() || '1 prise',
      time: newTime,
      frequency: newFrequency,
      notes: newNotes.trim(),
      notificationEnabled: newNotify,
      takenToday: false,
      createdAt: new Date().toISOString(),
    };

    setReminders([newReminder, ...reminders]);
    setIsNewReminderOpen(false);
    // Reset fields
    setNewMedName('');
    setNewDosage('');
    setNewTime('08:00');
    setNewNotes('');
  };

  // Toggle taken today
  const handleToggleTaken = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, takenToday: !r.takenToday } : r))
    );
  };

  // Delete reminder
  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  // Pre-fill reminder from med sheet
  const handlePrepareReminderFromMed = (med: MedicationInfo) => {
    setNewMedName(med.name.split('(')[0].trim());
    setNewDosage(med.dosage.split(',')[0].trim());
    setIsNewReminderOpen(true);
  };

  return (
    <div className="w-full bg-[#f8fbfe] min-h-screen py-8 sm:py-12">
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#d8ebfa] text-[#1e293b] hover:text-[#2563eb] hover:bg-[#eff6ff] text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>
          <span className="text-slate-400">/</span>
          <div className="inline-flex items-center gap-1.5">
            <OREASymbol className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#0056d6]">OREA Médicaments</span>
          </div>
        </div>

        {/* Hero Banner with Medical Disclaimer & Image 3 Integration */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-10 shadow-[0_4px_24px_rgba(37,99,235,0.04)] mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] border border-[#dbeafe] text-[#0056d6] text-xs font-semibold mb-3.5">
                <Pill className="w-3.5 h-3.5" />
                <span>Base Documentaire & Rappels Personnels</span>
              </div>
              <h1 className="text-[32px] sm:text-[40px] font-extrabold text-[#0f2347] tracking-tight leading-tight">
                Vos médicaments, mieux compris.
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#64748b] mt-2.5 leading-relaxed">
                Rechercher un médicament, comprendre son usage, ses précautions et planifier des rappels de prise — sans jamais remplacer le conseil de votre médecin ou pharmacien.
              </p>

              {/* Strict Regulatory Notice */}
              <div className="mt-5 p-4 rounded-xl bg-[#f0f7ff] border border-[#bfdbfe] flex items-start gap-3 text-xs sm:text-sm text-[#1e3a8a]">
                <Info className="w-5 h-5 text-[#0056d6] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">
                    Avertissement déontologique & sécurité du patient :
                  </p>
                  <p className="leading-relaxed">
                    Les informations présentées ne remplacent pas les conseils de votre médecin ou pharmacien.
                    OREA ne prescrit aucun médicament, ne recommande aucune dose personnalisée et ne vous demandera jamais d'interrompre ou modifier un traitement en cours.
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#bfdbfe] group">
                <img
                  src={oreaMedsPharmacyImg}
                  alt="Pharmacien OREA expliquant posologie et bon usage à une patiente dans une pharmacie moderne"
                  className="w-full h-52 sm:h-60 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11.5px] font-medium drop-shadow-sm flex items-center justify-between">
                  <span>Conseil pharmaceutique & bon usage</span>
                  <span className="font-bold text-blue-200">OREA Médicaments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#f0f4f9]">
            <div className="flex items-center gap-2 bg-[#f1f5f9] p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('catalogue')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'catalogue'
                    ? 'bg-white text-[#2563eb] shadow-xs'
                    : 'text-slate-600 hover:text-[#0f2347]'
                }`}
              >
                Fiches médicaments
              </button>
              <button
                onClick={() => setActiveTab('rappels')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'rappels'
                    ? 'bg-white text-[#2563eb] shadow-xs'
                    : 'text-slate-600 hover:text-[#0f2347]'
                }`}
              >
                <span>Mes rappels de prise</span>
                <span className="w-5 h-5 rounded-full bg-[#2563eb] text-white text-[11px] flex items-center justify-center font-bold">
                  {reminders.length}
                </span>
              </button>
            </div>

            {activeTab === 'rappels' && (
              <button
                onClick={() => setIsNewReminderOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau rappel</span>
              </button>
            )}
          </div>
        </div>

        {/* VIEW 1: CATALOGUE MEDICAMENTS */}
        {activeTab === 'catalogue' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="w-5 h-5 text-[#2563eb] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un médicament (ex: Paracétamol, Ibuprofène, Amoxicilline...)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#cfe2f5] bg-white focus:border-[#2563eb] focus:ring-3 focus:ring-blue-100 text-[#0f2347] text-[15px] outline-none transition-all shadow-xs"
              />
            </div>

            {/* Split layout: Meds List & Med Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left column: List (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] block mb-1">
                  Médicaments répertoriés ({filteredMeds.length})
                </span>

                {filteredMeds.length === 0 ? (
                  <div className="p-8 bg-white rounded-2xl border border-[#dbeaf8] text-center">
                    <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#0f2347]">Nous n'avons trouvé aucun résultat correspondant.</p>
                    <p className="text-xs text-[#64748b] mt-1">
                      Vérifiez l'orthographe du médicament ou de la molécule (DCI).
                    </p>
                  </div>
                ) : (
                  filteredMeds.map((med) => {
                    const isSelected = selectedMed?.id === med.id;

                    return (
                      <div
                        key={med.id}
                        onClick={() => setSelectedMed(med)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#2563eb] shadow-[0_4px_16px_rgba(37,99,235,0.1)] ring-2 ring-blue-100'
                            : 'bg-white border-[#dce9f6] hover:border-[#93c5fd] hover:bg-[#fafcff]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10.5px] font-semibold text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded">
                              DCI : {med.genericName}
                            </span>
                            <h4 className="text-[15.5px] font-bold text-[#0f2347] mt-1 leading-snug">
                              {med.name}
                            </h4>
                          </div>
                          {med.prescriptionRequired && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                              Sur ordonnance
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#64748b] mt-1.5 line-clamp-2">
                          {med.generalUsage}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right column: Med Detailed Sheet (8 cols) */}
              <div className="lg:col-span-8">
                {selectedMed ? (
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-9 shadow-[0_4px_24px_rgba(37,99,235,0.04)] space-y-7">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold text-[#2563eb] uppercase tracking-wider">
                            Fiche Médicamenteuse
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            Dosage : {selectedMed.dosage}
                          </span>
                          {selectedMed.prescriptionRequired ? (
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              Ordonnance obligatoire
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Disponible sans ordonnance
                            </span>
                          )}
                        </div>

                        <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#0f2347] leading-tight tracking-tight">
                          {selectedMed.name}
                        </h3>
                        <p className="text-sm font-semibold text-[#2563eb] mt-0.5">
                          Substance active (DCI) : {selectedMed.genericName}
                        </p>
                      </div>

                      {/* Quick reminder button */}
                      <button
                        onClick={() => handlePrepareReminderFromMed(selectedMed)}
                        className="shrink-0 px-3.5 py-2 rounded-xl bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-[#bfdbfe]"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Créer un rappel</span>
                      </button>
                    </div>

                    <div className="w-10 h-[3px] bg-[#2563eb] rounded-full" />

                    {/* General Usage */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#f8fbfe] border border-[#e1eef9]">
                      <h4 className="text-xs font-bold text-[#2563eb] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Info className="w-4 h-4" />
                        <span>Usage général & Présentation</span>
                      </h4>
                      <p className="text-sm sm:text-[15px] text-[#334155] leading-relaxed">
                        {selectedMed.generalUsage}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        <strong>Forme pharmaceutique :</strong> {selectedMed.form}
                      </p>
                    </div>

                    {/* Indications */}
                    <div>
                      <h4 className="text-[15px] font-bold text-[#0f2347] mb-2.5 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Indications générales</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedMed.indications.map((ind, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-50 text-xs sm:text-sm text-[#334155] flex items-center gap-2 border border-slate-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                            <span>{ind}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Précautions d'emploi */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#fffbeb] border border-[#fde68a]">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Précautions d'emploi & Contre-indications</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-amber-950">
                        {selectedMed.precautions.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-bold text-amber-700">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Effets indésirables & Interactions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h5 className="text-xs font-bold text-[#0f2347] uppercase tracking-wider mb-2">
                          Effets indésirables fréquents
                        </h5>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {selectedMed.sideEffects.map((eff, idx) => (
                            <li key={idx}>• {eff}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h5 className="text-xs font-bold text-[#0f2347] uppercase tracking-wider mb-2">
                          Interactions importantes
                        </h5>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {selectedMed.interactions.map((inter, idx) => (
                            <li key={idx}>• {inter}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Conservation */}
                    <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded-xl">
                      <strong>Conservation :</strong> {selectedMed.storage}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#dbeaf8] p-12 text-center">
                    <p className="text-slate-500">Sélectionnez un médicament dans la liste.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MES RAPPELS DE PRISE */}
        {activeTab === 'rappels' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-8 shadow-[0_4px_24px_rgba(37,99,235,0.04)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#0f2347] tracking-tight">
                    Mes rappels personnels de traitement
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                    Gérez vos horaires de prise quotidiens. Cette fonctionnalité d'organisation ne constitue pas une prescription.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewReminderOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un rappel</span>
                </button>
              </div>

              {/* Reminders List */}
              {reminders.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-[#dce9f6] rounded-2xl">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-base font-bold text-[#0f2347]">Aucun rappel programmé</p>
                  <p className="text-xs text-[#64748b] mt-1">
                    Ajoutez vos prises prévues prescrites par votre médecin.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        reminder.takenToday
                          ? 'bg-[#f0fdf4] border-[#bbf7d0]'
                          : 'bg-white border-[#dce9f6] hover:border-[#93c5fd]'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleToggleTaken(reminder.id)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors shrink-0 mt-0.5 cursor-pointer ${
                            reminder.takenToday
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-slate-400 bg-white'
                          }`}
                          title="Cocher comme pris aujourd'hui"
                        >
                          {reminder.takenToday && <CheckCircle2 className="w-5 h-5" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[17px] font-bold text-[#0f2347]">
                              {reminder.medicationName}
                            </h4>
                            <span className="text-xs font-extrabold text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded">
                              {reminder.time}
                            </span>
                            {reminder.takenToday && (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                Pris aujourd'hui ✓
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 mt-1">
                            Dosage : <strong>{reminder.dosage}</strong> • Fréquence :{' '}
                            {reminder.frequency === 'daily'
                              ? 'Tous les jours'
                              : reminder.frequency === 'twice_daily'
                              ? 'Deux fois par jour'
                              : 'Selon besoin'}
                          </p>

                          {reminder.notes && (
                            <p className="text-xs text-slate-500 mt-1 italic">
                              Note : {reminder.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          {reminder.notificationEnabled ? (
                            <Bell className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <BellOff className="w-3.5 h-3.5 text-slate-300" />
                          )}
                          <span className="hidden sm:inline">
                            {reminder.notificationEnabled ? 'Actif' : 'Silencieux'}
                          </span>
                        </span>

                        <button
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Supprimer ce rappel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: CREATE NEW REMINDER */}
        {isNewReminderOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0f2347]">Nouveau rappel de médicament</h3>
                </div>
                <button
                  onClick={() => setIsNewReminderOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Renseignez les détails prescrits par votre praticien. Ce rappel vous aidera à maintenir la régularité de votre traitement.
              </p>

              <form onSubmit={handleAddReminder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0f2347] mb-1">
                    Nom du médicament *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="Ex: Paracétamol, Doliprane, Levothyrox..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0f2347] mb-1">
                      Dosage / Posologie
                    </label>
                    <input
                      type="text"
                      value={newDosage}
                      onChange={(e) => setNewDosage(e.target.value)}
                      placeholder="Ex: 1 000 mg, 1 gélule"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f2347] mb-1">
                      Horaire de prise *
                    </label>
                    <input
                      type="time"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f2347] mb-1">
                    Répétition
                  </label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none bg-white"
                  >
                    <option value="daily">Tous les jours</option>
                    <option value="twice_daily">Matin et Soir</option>
                    <option value="weekly">Une fois par semaine</option>
                    <option value="as_needed">En cas de douleur / Au besoin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f2347] mb-1">
                    Consignes / Notes (optionnel)
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Ex: Au cours du petit-déjeuner avec de l'eau"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="chk-notif"
                    checked={newNotify}
                    onChange={(e) => setNewNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563eb]"
                  />
                  <label htmlFor="chk-notif" className="text-xs font-semibold text-[#0f2347] cursor-pointer">
                    Recevoir une alerte visuelle / sonore à l'horaire prévu
                  </label>
                </div>

                <div className="pt-4 border-t border-[#f0f4f9] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewReminderOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Enregistrer le rappel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
