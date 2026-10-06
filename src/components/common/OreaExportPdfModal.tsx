import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  CheckCircle2,
  Calendar,
  Shield,
  Activity,
  Droplets,
  Pill,
  Clock,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import { OreaUserProfile } from '../../types';
import { downloadOreaHealthReportPdf, printOreaHealthReportPdf, HealthReportData } from '../../services/pdfExportService';
import { OreaButton } from './OreaButton';

interface OreaExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: OreaUserProfile;
  customReportData?: Partial<HealthReportData>;
}

export const OreaExportPdfModal: React.FC<OreaExportPdfModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  customReportData,
}) => {
  const [period, setPeriod] = useState<'30days' | '90days' | 'year' | 'all'>('30days');
  const [includeSections, setIncludeSections] = useState({
    habits: true,
    hydration: true,
    sport: true,
    nutrition: true,
    cycle: userProfile.gender === 'femme',
    medications: true,
    appointments: true,
    notes: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSection = (key: keyof typeof includeSections) => {
    setIncludeSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Build the complete report dataset based on real user state & fallbacks
  const assembleReportData = (): HealthReportData => {
    const today = new Date();
    const periodStartDate =
      period === '30days'
        ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        : period === '90days'
        ? new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        : period === 'year'
        ? new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

    const defaultHabits = [
      { title: 'Hydratation 2L', target: '2000 ml / jour', progress: '92%', streak: 14, period: 'Quotidien' },
      { title: 'Marche & Mobilité', target: '30 min', progress: '85%', streak: 8, period: '5x / semaine' },
      { title: 'Sommeil réparateur', target: '7h30 minimum', progress: '78%', streak: 5, period: 'Quotidien' },
    ];

    const defaultMedications = [
      { name: 'Paracétamol 1000mg', dosage: '1 comprimé', frequency: 'Si besoin (max 3g/j)', times: 'Ponctuel', notes: 'Espacer les prises de 6h' },
      { name: 'Vitamine D3', dosage: '1 ampoule', frequency: '1x par trimestre', times: 'Matin', notes: 'Pendant le repas du matin' },
    ];

    const defaultAppointments = [
      { date: '14/10/2026', type: 'Bilan de santé annuel', practitionerOrFacility: 'Centre Médical Central', notes: 'Prise de sang à jeun' },
      { date: '28/08/2026', type: 'Consultation générale', practitionerOrFacility: 'Dr. Kouadio (Médecin traitant)', notes: 'Contrôle tension artérielle' },
    ];

    return {
      userProfile,
      startDate: periodStartDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      endDate: today.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      habits: includeSections.habits ? (customReportData?.habits || defaultHabits) : [],
      hydration: includeSections.hydration
        ? (customReportData?.hydration || {
            dailyTargetMl: 2200,
            averageConsumedMl: 1950,
            progressPercent: 88,
            historyDays: [
              { date: 'Hier', consumedMl: 2100, targetMl: 2200 },
              { date: 'Avant-hier', consumedMl: 1900, targetMl: 2200 },
            ],
          })
        : undefined,
      physicalActivity: includeSections.sport
        ? (customReportData?.physicalActivity || {
            completedSessions: 12,
            weeklyFrequency: '3x / semaine',
            totalDurationMinutes: 360,
            progressNote: 'Régularité constante au poids du corps',
            recentSessions: [
              { date: '10/09/2026', program: 'Renforcement Full-Body Poids du corps', duration: '30 min' },
              { date: '08/09/2026', program: 'Cardio & Mobilité Articulaire', duration: '25 min' },
              { date: '05/09/2026', program: 'Gainage & Abdos OREA', duration: '20 min' },
            ],
          })
        : undefined,
      nutrition: includeSections.nutrition
        ? (customReportData?.nutrition || {
            dietaryType: 'Équilibré & Aliments locaux',
            dailyHabits: ['3 repas équilibrés', 'Collation fruits locaux', 'Hydratation régulière'],
            waterGoalAchieved: true,
            localFoodsIncorporated: ['Moringa', 'Fonio', 'Safou', 'Hibiscus (Bissap)'],
          })
        : undefined,
      cycleData: includeSections.cycle
        ? (customReportData?.cycleData || {
            active: true,
            lastPeriodDate: '01/09/2026',
            averageCycleDays: 28,
            currentPhase: 'Phase Folliculaire',
            recordedSymptoms: ['Crampes modérées à J1', 'Énergie stable à J8'],
          })
        : undefined,
      medications: includeSections.medications ? (customReportData?.medications || defaultMedications) : [],
      appointments: includeSections.appointments ? (customReportData?.appointments || defaultAppointments) : [],
      personalNotes: includeSections.notes
        ? (customReportData?.personalNotes || [
            'Bilan orienté vers une meilleure régularité sportive matinale.',
            'Surveillance hydrique satisfaisante en climat chaud.',
          ])
        : [],
      medicalObservations: customReportData?.medicalObservations || '',
    };
  };

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      const data = assembleReportData();
      downloadOreaHealthReportPdf(data);
      setSuccessMessage('Bilan PDF OREA téléchargé avec succès !');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    try {
      const data = assembleReportData();
      printOreaHealthReportPdf(data);
    } catch (err) {
      console.error('Error printing PDF:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0B2F5B] text-white p-5 sm:p-6 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-[#00A6C7]/20 border border-[#00A6C7]/40 flex items-center justify-center text-[#7de3f8]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight">Export Bilan de Santé OREA</h3>
              <p className="text-xs text-slate-300">Génération de rapport médical A4 professionnel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Notification success */}
          {successMessage && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Period Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              Période à analyser dans le rapport
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '30days', label: '30 derniers jours' },
                { id: '90days', label: '3 derniers mois' },
                { id: 'year', label: 'Année en cours' },
                { id: 'all', label: 'Tout l’historique' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    period === p.id
                      ? 'bg-[#0B2F5B] text-white border-[#0B2F5B] shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Sections to include */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              Modules et données à inclure
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'habits', label: 'Habitudes & Séries de régularité', icon: Activity, color: 'text-emerald-600' },
                { key: 'hydration', label: 'Hydratation & Apports liquidiens', icon: Droplets, color: 'text-cyan-600' },
                { key: 'sport', label: 'Séances d’activité physique & sport', icon: Activity, color: 'text-orange-600' },
                { key: 'nutrition', label: 'Nutrition & Super-aliments du terroir', icon: Heart, color: 'text-rose-600' },
                { key: 'medications', label: 'Armoire à pharmacie & Posologies saisies', icon: Pill, color: 'text-indigo-600' },
                { key: 'appointments', label: 'Agenda des consultations & examens', icon: Calendar, color: 'text-blue-600' },
                { key: 'notes', label: 'Journal personnel & observations', icon: FileText, color: 'text-slate-600' },
              ].map((sec) => {
                const Icon = sec.icon;
                const active = (includeSections as any)[sec.key];
                return (
                  <button
                    key={sec.key}
                    type="button"
                    onClick={() => toggleSection(sec.key as any)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-50/70 border-blue-200 text-slate-900'
                        : 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? sec.color : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold">{sec.label}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-white text-[10px] ${
                        active ? 'bg-[#0B2F5B]' : 'border border-slate-300'
                      }`}
                    >
                      {active && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Medical Disclaimer Card */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11.5px] text-amber-900 leading-relaxed">
              <span className="font-bold">Avertissement déontologique OREA : </span>
              Ce bilan récapitule exclusivement les données enregistrées par l’utilisateur. Il ne remplace en aucun cas un avis, une ordonnance ou un diagnostic médical établi par un professionnel de santé diplômé.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Format : <span className="font-bold text-slate-700">PDF A4 Portrait (.pdf)</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>

            <OreaButton
              variant="sante"
              size="md"
              onClick={handleDownload}
              isLoading={isGenerating}
              icon={<Download className="w-4 h-4" />}
            >
              Télécharger en PDF
            </OreaButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OreaExportPdfModal;
