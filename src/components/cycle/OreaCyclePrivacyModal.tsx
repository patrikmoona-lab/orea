import React, { useState } from 'react';
import { X, Shield, Lock, Trash2, Download, Check, AlertTriangle, EyeOff } from 'lucide-react';

interface OreaCyclePrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportData: () => void;
  onDeleteAllData: () => Promise<void>;
}

export const OreaCyclePrivacyModal: React.FC<OreaCyclePrivacyModalProps> = ({
  isOpen,
  onClose,
  onExportData,
  onDeleteAllData
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteAllData();
      setShowDeleteConfirm(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-100 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Vos données restent privées 🔒
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Engagements de confidentialité et contrôle total de vos informations
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

        <div className="space-y-4 pt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          {/* Privacy points */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/80 space-y-1">
              <h4 className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chiffrement et protection absolue</span>
              </h4>
              <p className="text-xs text-emerald-900/90 dark:text-emerald-300 leading-relaxed">
                Vos données de cycle, symptômes et notes personnelles sont strictement associées à votre compte OREA. Aucune donnée intime n'est revendue, partagée avec des régies publicitaires ou consultable par des tiers.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <p>
                <strong className="text-slate-900 dark:text-white">Quelles données sont enregistrées ?</strong>
                <br />
                Uniquement les dates de vos règles, les symptômes physiques facultatifs, vos ressentis d'humeur/énergie et vos notes rédigées.
              </p>

              <p>
                <strong className="text-slate-900 dark:text-white">Pourquoi sont-elles utilisées ?</strong>
                <br />
                Exclusivement pour générer vos estimations de cycle déterministes et adapter les conseils d'accompagnement OREA.
              </p>

              <p>
                <strong className="text-slate-900 dark:text-white">Comment les contrôler ?</strong>
                <br />
                Vous pouvez modifier ou effacer chaque entrée individuellement dans votre calendrier et dans l'historique.
              </p>
            </div>
          </div>

          {/* Export & Delete Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Gestion & Exportation de vos données
            </h4>

            <button
              type="button"
              onClick={onExportData}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#0056d6]" />
              <span>Exporter toutes mes données Mon Cycle (JSON)</span>
            </button>

            {showDeleteConfirm ? (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-3">
                <div className="flex items-start gap-2 text-red-900 dark:text-red-200 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Attention :</strong> Cette action supprimera définitivement tous vos cycles enregistrés, vos notes et vos symptômes de votre profil.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-red-100/50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                  >
                    {isDeleting ? 'Suppression...' : 'Confirmer la suppression totale'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2.5 px-4 rounded-2xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Supprimer toutes mes données de Mon Cycle</span>
              </button>
            )}
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-white dark:text-slate-900 font-extrabold text-xs shadow-xs cursor-pointer"
            >
              Compris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
