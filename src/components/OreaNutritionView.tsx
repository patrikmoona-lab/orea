import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Apple,
  Droplets,
  Heart,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  Info,
  Sliders,
  Edit3
} from 'lucide-react';
import { AFRICAN_SUPERFOODS } from '../data';
import { ModuleOnboardingWizard } from './onboarding/ModuleOnboardingWizard';
import { NUTRITION_QUESTIONS } from '../data/modulesOnboardingData';
import { OreaModuleAIWidget } from './common/OreaModuleAIWidget';
import {
  isModuleConfigured,
  getModuleProfile,
  saveModuleProfile,
  clearModuleProfile,
} from '../utils/oreaProfileStorage';
import { useAuth } from '../context/AuthContext';
import { fetchFirestoreModule } from '../lib/firebase';

interface OreaNutritionViewProps {
  onBackToHome: () => void;
}

export const OreaNutritionView: React.FC<OreaNutritionViewProps> = ({ onBackToHome }) => {
  const { currentUser, authLoading } = useAuth();
  const [isConfigured, setIsConfigured] = useState<boolean>(() => {
    return isModuleConfigured('nutrition');
  });
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkConfig() {
      if (authLoading) return;
      if (!currentUser) {
        setDbLoading(false);
        return;
      }
      try {
        const docSnap = await fetchFirestoreModule(currentUser.uid, 'nutrition');
        if (docSnap && docSnap.enabled) {
          const pseudo = docSnap.data?.pseudo || docSnap.data?.name || docSnap.data?.prenom || 'Membre OREA';
          const profile = {
            id: 'profile-nutrition-firestore',
            module: 'nutrition',
            name: pseudo,
            answers: docSnap.data || {},
            createdAt: docSnap.createdAt,
            updatedAt: docSnap.updatedAt,
          };
          localStorage.setItem('orea_profile_nutrition', JSON.stringify(profile));
          localStorage.setItem('orea_configured_nutrition', 'true');
          setIsConfigured(true);
        } else {
          localStorage.removeItem('orea_profile_nutrition');
          localStorage.removeItem('orea_configured_nutrition');
          setIsConfigured(false);
        }
      } catch (err) {
        console.warn("[OreaNutritionView] Firestore check error:", err);
        setIsConfigured(isModuleConfigured('nutrition'));
      } finally {
        setDbLoading(false);
      }
    }
    checkConfig();
  }, [currentUser, authLoading]);

  const moduleProfile = useMemo(() => getModuleProfile('nutrition'), [isConfigured]);

  const [waterGlasses, setWaterGlasses] = useState(4); // Target: 8
  const [activeCategory, setActiveCategory] = useState<'all' | 'fruit' | 'legume' | 'feculent' | 'graine_epice'>('all');

  if (authLoading || dbLoading) {
    return (
      <div className="min-h-screen bg-[#f8fbfe] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 animate-pulse">
          <Apple className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Vérification de votre espace OREA...</p>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <ModuleOnboardingWizard
        moduleId="nutrition"
        moduleTitle="OREA Nutrition & Terroir"
        moduleSubtitle="Aliments locaux, hydratation & équilibre"
        moduleIcon={<Apple className="w-8 h-8 text-emerald-600" />}
        accentColor="emerald"
        questions={NUTRITION_QUESTIONS}
        onComplete={(answers) => {
          saveModuleProfile('nutrition', answers);
          setIsConfigured(true);
        }}
        onCancel={onBackToHome}
      />
    );
  }

  const filteredFoods = AFRICAN_SUPERFOODS.filter((f) =>
    activeCategory === 'all' ? true : f.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#f8fbfe] pb-16">
      {/* Header */}
      <div className="bg-white border-b border-[#e2eaf4] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-500 hover:text-[#0056d6] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Apple className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#0f2347] flex items-center gap-2">
                  <span>OREA Nutrition & Terroir</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    Aliments Locaux
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Bonjour {moduleProfile?.name || 'Membre OREA'} — Valoriser les richesses nutritionnelles d'Afrique centrale.
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                setIsConfigured(false);
              }}
              className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Modifier mes préférences nutritionnelles"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Modifier mon profil</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Hydration Tracker Card */}
        <div className="bg-gradient-to-r from-blue-600 to-[#0056d6] text-white p-6 sm:p-8 rounded-3xl shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Droplets className="w-5 h-5 text-blue-200 fill-blue-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Suivi d'Hydratation Quotidienne
              </span>
            </div>
            <h2 className="text-2xl font-extrabold">{waterGlasses} verres sur 8 recommandés (approx. 1,5L)</h2>
            <p className="text-xs text-blue-100">
              Une bonne hydratation régule la température corporelle, la tension et la concentration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="text-xl font-black px-3">{waterGlasses}</div>
            <button
              onClick={() => setWaterGlasses((prev) => Math.min(12, prev + 1))}
              className="px-4 py-2.5 rounded-xl bg-white text-[#0056d6] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Boire un verre</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {[
            { id: 'all', label: 'Tous les aliments' },
            { id: 'fruit', label: 'Fruits' },
            { id: 'legume', label: 'Légumes & Feuilles' },
            { id: 'feculent', label: 'Féculents & Racines' },
            { id: 'graine_epice', label: 'Plantes & Épices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-[#e2eaf4]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Foods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-3xl border border-[#e2eaf4] p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 capitalize">
                    {food.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {food.region}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#0f2347] mb-1">{food.name}</h3>
                <p className="text-xs text-slate-500 italic mb-3">
                  Noms vernaculaires : {food.localNames.join(', ')}
                </p>

                <div className="space-y-2 mb-4">
                  <span className="text-xs font-semibold text-slate-700 block">Bienfaits démontrés :</span>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    {food.nutritionalBenefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                <strong className="text-[#0f2347]">Conseil culinaire :</strong> {food.culinaryUsage}
              </div>
            </div>
          ))}
        </div>

        {/* The Balanced African Plate Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e2eaf4] shadow-xs">
          <h3 className="text-base sm:text-lg font-bold text-[#0f2347] mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>L'Assiette Équilibrée OREA (Règle 50 / 25 / 25)</span>
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Comment composer un plat familial sain avec les ingrédients du marché sans se ruiner.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
                50% — Légumes & Fibres
              </span>
              <p className="leading-relaxed">
                Feuilles de manioc (saka-saka), épinards sauvages (bitekuteku), gombo ou salades crues locales. Ils ralentissent l'absorption des sucres et nettoient le système digestif.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span className="text-xs font-bold text-blue-800 uppercase block mb-1">
                25% — Protéines Nobles
              </span>
              <p className="leading-relaxed">
                Poisson d'eau douce braisé, volaille sans excès d'huile, œufs frais, pâte d'arachide ou légumineuses (haricots niébé).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
              <span className="text-xs font-bold text-orange-800 uppercase block mb-1">
                25% — Féculents à Énergie Lente
              </span>
              <p className="leading-relaxed">
                Patate douce, manioc bouilli, banane plantain mûre à la vapeur ou riz complet. Évitez les fritures quotidiennes pour préserver vos artères.
              </p>
            </div>
          </div>
        </div>
      </div>

      <OreaModuleAIWidget moduleId="nutrition" moduleTitle="Nutrition & Terroir" />
    </div>
  );
};
