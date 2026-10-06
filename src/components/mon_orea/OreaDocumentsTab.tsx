import React, { useState, useEffect } from 'react';
import { FileText, Download, Sparkles, Plus, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { OreaButton } from '../common/OreaButton';
import { fetchUserDocuments, saveUserDocument, OreaDocumentItemDoc, logUserActivity } from '../../lib/firebase';

interface OreaDocumentsTabProps {
  userId: string;
  userEmail?: string;
  userName?: string;
}

export const OreaDocumentsTab: React.FC<OreaDocumentsTabProps> = ({ userId, userEmail, userName }) => {
  const [documents, setDocuments] = useState<OreaDocumentItemDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadDocs();
  }, [userId]);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const list = await fetchUserDocuments(userId);
      setDocuments(list);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummaryPDF = async () => {
    if (!userId) return;
    setGenerating(true);
    try {
      const title = `Bilan Synthétique OREA - ${new Date().toLocaleDateString('fr-FR')}`;
      const summary = `Synthèse complète d'activité et de santé générée pour ${userName || 'Membre OREA'} (${userEmail || ''}).`;
      const content = `DOCUMENT OFFICIEL OREA\nMembre: ${userName || 'Membre OREA'}\nEmail: ${userEmail || ''}\nDate: ${new Date().toISOString()}\n\nRésumé des modules:\n- Mon Cycle: Suivi actif\n- Sport & Workout: Bilan régulier\n- Nutrition: Profil enregistré\n- BAC G2: Révisions en cours\n- Finance: Budget FCFA équilibré\n- Planner: Organisation quotidienne\n\nCréateur d'OREA: Mr Tsoumou Patrick Bonheur`;

      const docItem = await saveUserDocument(userId, {
        title,
        module: 'mon_orea',
        type: 'rapport',
        summary,
        content,
      });

      await logUserActivity(userId, {
        title: 'Bilan PDF Généré',
        description: title,
        module: 'mon_orea',
        type: 'autre',
      });

      setDocuments((prev) => [docItem, ...prev]);
    } catch (err) {
      console.error('Error generating doc:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (docItem: OreaDocumentItemDoc) => {
    const element = document.createElement('a');
    const file = new Blob([docItem.content || docItem.summary || 'Document OREA'], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${docItem.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 rounded-3xl shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <FileText className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              RAPPORTS & EXPORTS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Mes Documents OREA</h2>
          <p className="text-xs text-blue-200 mt-1">
            Téléchargez vos bilans de santé, exports financiers et synthèses d'études.
          </p>
        </div>

        <OreaButton
          variant="primary"
          onClick={handleGenerateSummaryPDF}
          disabled={generating}
          className="shrink-0 flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>{generating ? 'Génération...' : 'Générer un bilan PDF'}</span>
        </OreaButton>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200/80">
          <Sparkles className="w-8 h-8 text-blue-500 mx-auto animate-spin mb-3" />
          <p className="text-xs font-medium">Chargement de vos documents depuis Firestore...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#0f2347]">Aucun document disponible</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Générez un premier bilan synthétique pour exporter vos données personnelles en toute sécurité.
          </p>
          <OreaButton variant="outline" size="sm" onClick={handleGenerateSummaryPDF}>
            Créer un bilan synthétique
          </OreaButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((docItem) => (
            <div
              key={docItem.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0056d6] text-[10px] font-bold uppercase">
                    {docItem.type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(docItem.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0f2347] mb-1">{docItem.title}</h3>
                {docItem.summary && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{docItem.summary}</p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400">Stocké dans Firestore</span>
                <OreaButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(docItem)}
                  className="flex items-center gap-1.5 text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </OreaButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
