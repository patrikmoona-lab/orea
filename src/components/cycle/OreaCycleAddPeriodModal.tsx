import React, { useState, useEffect } from 'react';
import { X, Droplets, Heart, Check, Sparkles } from 'lucide-react';
import { CycleEntry, MenstrualFlow, SymptomIntensity } from '../../types/cycle';

interface OreaCycleAddPeriodModalProps {
  isOpen: boolean;
  entryToEdit?: CycleEntry | null;
  initialDate?: string;
  onClose: () => void;
  onSave: (entry: CycleEntry) => void;
}

const COMMON_PERIOD_SYMPTOMS = [
  'Crampes pelviennes',
  'Fatigue passagère',
  'Maux de tête',
  'Ballonnements',
  'Tensions mammaires',
  'Douleurs lombaires',
  'Humeur changeante',
  'Troubles du sommeil'
];

export const OreaCycleAddPeriodModal: React.FC<OreaCycleAddPeriodModalProps> = ({
  isOpen,
  entryToEdit,
  initialDate,
  onClose,
  onSave,
}) => {
  const todayIso = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(initialDate || todayIso);
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState<MenstrualFlow>('moyen');
  const [hasClots, setHasClots] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Crampes pelviennes']);
  const [intensity, setIntensity] = useState<SymptomIntensity>('moderee');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (entryToEdit) {
      setStartDate(entryToEdit.startDate);
      setEndDate(entryToEdit.endDate || '');
      setFlow(entryToEdit.flow || 'moyen');
      setHasClots(Boolean(entryToEdit.hasClots));
      setSelectedSymptoms(entryToEdit.symptoms.map((s) => s.name));
      setIntensity(entryToEdit.symptoms[0]?.intensity || 'moderee');
      setNotes(entryToEdit.notes || '');
    } else {
      setStartDate(initialDate || todayIso);
      setEndDate('');
      setFlow('moyen');
      setHasClots(false);
      setSelectedSymptoms(['Crampes pelviennes']);
      setIntensity('moderee');
      setNotes('');
    }
  }, [entryToEdit, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) return;

    const entry: CycleEntry = {
      id: entryToEdit ? entryToEdit.id : `cycle-${Date.now()}`,
      startDate,
      endDate: endDate || undefined,
      flow,
      hasClots,
      symptoms: selectedSymptoms.map((name, idx) => ({
        id: `symp-${idx}`,
        name,
        intensity
      })),
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString()
    };

    onSave(entry);
  };

  const toggleSymptom = (symp: string) => {
    if (selectedSymptoms.includes(symp)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symp));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symp]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-100 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {entryToEdit ? 'Modifier mes règles' : 'Enregistrer mes règles'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Saisie rapide & calcul physiologique automatique
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs sm:text-sm">
          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Premier jour des règles *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dernier jour (optionnel)
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* Flow selection */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Flux observé
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'leger', label: 'Léger' },
                { id: 'moyen', label: 'Moyen' },
                { id: 'abondant', label: 'Abondant' },
                { id: 'tres_abondant', label: 'Très abond.' },
              ].map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFlow(f.id as MenstrualFlow)}
                  className={`py-2 text-xs rounded-xl font-bold cursor-pointer transition-all border ${
                    flow === f.id
                      ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-1 ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clots checkbox */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="checkbox"
              id="chk-has-clots"
              checked={hasClots}
              onChange={(e) => setHasClots(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
            <label htmlFor="chk-has-clots" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Présence de petits caillots sanguins habituels
            </label>
          </div>

          {/* Symptoms multi-selection */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Symptômes & ressentis associés
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PERIOD_SYMPTOMS.map((symp) => {
                const isSelected = selectedSymptoms.includes(symp);
                return (
                  <button
                    type="button"
                    key={symp}
                    onClick={() => toggleSymptom(symp)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {symp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notes personnelles (privées)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ressentis, tisanes prises, journée de repos..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-rose-500 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{entryToEdit ? 'Mettre à jour' : 'Enregistrer mes règles'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
