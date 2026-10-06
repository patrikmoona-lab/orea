import React from 'react';
import { X, Phone, Clock, MapPin, ExternalLink, ShieldCheck, HeartPulse } from 'lucide-react';
import { HEALTH_RESOURCES } from '../data';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResourcesModal: React.FC<ResourcesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#f8fbfe] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100/60 border border-blue-200/60 flex items-center justify-center text-[#2563eb] shrink-0">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#2563eb] uppercase tracking-wider">
                Services & Orientation
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2347]">
                Ressources de Santé & Urgences
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resources List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
            Consultez les numéros d'urgence officiels et les services d'accompagnement sanitaire recommandés par OREA Santé. En cas d'urgence vitale, composez immédiatement le 15 ou le 112.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {HEALTH_RESOURCES.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl border border-[#deecf8] bg-[#fafcff] hover:bg-white hover:border-[#93c5fd] hover:shadow-xs transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-md">
                      {res.category}
                    </span>
                    {res.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        res.badge === 'Urgence' 
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {res.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-[15px] font-bold text-[#0f2347] mt-2">
                    {res.title}
                  </h3>

                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {res.phone ? (
                    <a
                      href={`tel:${res.phone.replace(/\s/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{res.phone}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Proximité
                    </span>
                  )}

                  {res.availableHours && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {res.availableHours}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#f8fbfe] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Accès libre & vérifié</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2563eb] text-white font-semibold text-xs hover:bg-[#1d4ed8] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
