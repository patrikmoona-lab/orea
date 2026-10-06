import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Plus,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Flame,
  Sun,
  Activity,
  History,
  TrendingUp,
} from 'lucide-react';
import { OreaButton } from './common/OreaButton';

interface HydrationHistoryDay {
  date: string;
  consumedMl: number;
  targetMl: number;
}

export const OreaHydrationCalculator: React.FC = () => {
  // Inputs for calculation
  const [weightKg, setWeightKg] = useState<number>(70);
  const [activityLevel, setActivityLevel] = useState<'sedentaire' | 'modere' | 'intense'>('modere');
  const [climate, setClimate] = useState<'tempere' | 'chaud' | 'tropical'>('chaud');

  // Daily tracker state
  const [customMl, setCustomMl] = useState<string>('250');
  const [consumedTodayMl, setConsumedTodayMl] = useState<number>(() => {
    const saved = localStorage.getItem('orea_hydration_today');
    return saved ? Number(saved) : 1250;
  });

  const [history, setHistory] = useState<HydrationHistoryDay[]>([
    { date: 'Hier', consumedMl: 2250, targetMl: 2400 },
    { date: 'J-2', consumedMl: 2400, targetMl: 2400 },
    { date: 'J-3', consumedMl: 2100, targetMl: 2400 },
    { date: 'J-4', consumedMl: 2500, targetMl: 2400 },
    { date: 'J-5', consumedMl: 1900, targetMl: 2400 },
    { date: 'J-6', consumedMl: 2300, targetMl: 2400 },
    { date: 'J-7', consumedMl: 2200, targetMl: 2400 },
  ]);

  // Persist today's progress
  useEffect(() => {
    localStorage.setItem('orea_hydration_today', consumedTodayMl.toString());
  }, [consumedTodayMl]);

  // Formula: Base 35ml per kg + activity bonus + climate bonus
  const calculateDailyTarget = (): number => {
    let base = weightKg * 35;
    if (activityLevel === 'modere') base += 350;
    if (activityLevel === 'intense') base += 750;

    if (climate === 'chaud') base += 350;
    if (climate === 'tropical') base += 600;

    // Round to nearest 50ml
    return Math.round(base / 50) * 50;
  };

  const dailyTargetMl = calculateDailyTarget();
  const remainingMl = Math.max(0, dailyTargetMl - consumedTodayMl);
  const percentAchieved = Math.min(100, Math.round((consumedTodayMl / dailyTargetMl) * 100));

  const addHydration = (amount: number) => {
    setConsumedTodayMl((prev) => prev + amount);
  };

  const resetToday = () => {
    setConsumedTodayMl(0);
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#00A6C7] text-xs font-black uppercase tracking-wider">
            <Droplets className="w-3.5 h-3.5" />
            <span>Équilibre Hydrique Quotidien OREA</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B2F5B] tracking-tight">
            Calculateur & Suivi d'Hydratation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Évaluez vos besoins en eau personnalisés selon votre morphologie, vos efforts et votre climat local.
          </p>
        </div>

        {/* Top Grid: Calculator Configuration & Live Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Parameters (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00A6C7]" />
              <span>Vos Paramètres</span>
            </h3>

            {/* Poids */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>Poids corporel :</span>
                <span className="text-[#0056d6]">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00A6C7]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>40 kg</span>
                <span>90 kg</span>
                <span>140 kg</span>
              </div>
            </div>

            {/* Niveau d'activité */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Niveau d'activité physique :
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'sedentaire', label: 'Sédentaire' },
                  { id: 'modere', label: 'Modéré (30m)' },
                  { id: 'intense', label: 'Intense (1h+)' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivityLevel(act.id as any)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                      activityLevel === act.id
                        ? 'bg-[#0B2F5B] text-white border-[#0B2F5B]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Climat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Climat ambiant / Température :
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'tempere', label: 'Tempéré (<24°C)' },
                  { id: 'chaud', label: 'Chaud (25-32°C)' },
                  { id: 'tropical', label: 'Tropical (>32°C)' },
                ].map((clm) => (
                  <button
                    key={clm.id}
                    type="button"
                    onClick={() => setClimate(clm.id as any)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                      climate === clm.id
                        ? 'bg-[#00A6C7] text-white border-[#00A6C7]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {clm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Target summary box */}
            <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 text-center space-y-1">
              <div className="text-xs font-semibold text-slate-600">Objectif journalier recommandé</div>
              <div className="text-2xl font-black text-[#0B2F5B]">
                {dailyTargetMl} <span className="text-sm font-bold text-[#00A6C7]">ml</span>
              </div>
              <div className="text-[11px] text-slate-500">Soit environ {Math.round((dailyTargetMl / 250) * 10) / 10} verres d'eau</div>
            </div>
          </div>

          {/* Right: Today's Interactive Tracker & Gauge (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Suivi d'aujourd'hui</h3>
                <p className="text-xs text-slate-500">Consommation en temps réel</p>
              </div>

              <button
                onClick={resetToday}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            </div>

            {/* Visual Gauge */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl sm:text-4xl font-black text-[#00A6C7]">
                  {consumedTodayMl} <span className="text-sm font-bold text-slate-500">/ {dailyTargetMl} ml</span>
                </span>
                <span className="text-lg font-black text-[#0B2F5B]">{percentAchieved}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-[#00A6C7] to-[#0056d6] rounded-full transition-all duration-500"
                  style={{ width: `${percentAchieved}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Reste à boire : <strong className="text-slate-800">{remainingMl} ml</strong></span>
                {percentAchieved >= 100 && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Objectif atteint !</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Ajout rapide en 1 clic
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => addHydration(150)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 text-center transition-all cursor-pointer group"
                >
                  <div className="text-sm font-black text-[#0B2F5B] group-hover:text-[#00A6C7]">+150 ml</div>
                  <div className="text-[10px] text-slate-500">Tasse</div>
                </button>

                <button
                  type="button"
                  onClick={() => addHydration(250)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 text-center transition-all cursor-pointer group"
                >
                  <div className="text-sm font-black text-[#0B2F5B] group-hover:text-[#00A6C7]">+250 ml</div>
                  <div className="text-[10px] text-slate-500">Verre standard</div>
                </button>

                <button
                  type="button"
                  onClick={() => addHydration(500)}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 text-center transition-all cursor-pointer group"
                >
                  <div className="text-sm font-black text-[#0B2F5B] group-hover:text-[#00A6C7]">+500 ml</div>
                  <div className="text-[10px] text-slate-500">Gourde / Bouteille</div>
                </button>

                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={customMl}
                    onChange={(e) => setCustomMl(e.target.value)}
                    placeholder="ml"
                    className="w-full py-2.5 px-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-center text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => addHydration(Number(customMl) || 0)}
                    className="p-2.5 rounded-xl bg-[#00A6C7] text-white hover:bg-[#008ba8] transition-colors cursor-pointer"
                    title="Ajouter quantité personnalisée"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 7-Days History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-[#0056d6]" />
              <span>Historique des 7 derniers jours</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">Moyenne : 2 235 ml / j</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {history.map((day, idx) => {
              const pct = Math.min(100, Math.round((day.consumedMl / day.targetMl) * 100));
              return (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500">{day.date}</div>
                  <div className="text-xs font-black text-slate-800">{day.consumedMl} ml</div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-[#00A6C7]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicative Disclaimer */}
        <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#00A6C7] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-[#0B2F5B]">Avertissement d'estimation : </span>
            Ceci est une estimation indicative calculée pour un adulte en bonne santé. Vos besoins réels peuvent varier selon la sudation, l’état de santé, la grossesse, l’allaitement ou des contre-indications médicales spécifiques (insuffisance rénale, cardiaque).
          </div>
        </div>

      </div>
    </div>
  );
};

export default OreaHydrationCalculator;
