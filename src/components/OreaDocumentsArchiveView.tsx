import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Plus,
  Search,
  FolderOpen,
  Calendar,
  ShieldCheck,
  Tag,
  CheckCircle2,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { OreaUserProfile } from '../types';
import { OreaButton } from './common/OreaButton';

export interface StoredDocument {
  id: string;
  name: string;
  category: 'bilan' | 'ordonnance' | 'analyse' | 'etude' | 'personnel';
  dateAdded: string;
  sizeKb: number;
  note?: string;
  fileType: string;
}

interface OreaDocumentsArchiveViewProps {
  userProfile: OreaUserProfile;
  onOpenPdfExport?: () => void;
}

export const OreaDocumentsArchiveView: React.FC<OreaDocumentsArchiveViewProps> = ({
  userProfile,
  onOpenPdfExport,
}) => {
  const [documents, setDocuments] = useState<StoredDocument[]>([
    {
      id: 'doc-1',
      name: 'OREA_Bilan_Sante_2026-09-01.pdf',
      category: 'bilan',
      dateAdded: '01/09/2026',
      sizeKb: 142,
      note: 'Bilan mensuel complet exporté avec succès.',
      fileType: 'PDF',
    },
    {
      id: 'doc-2',
      name: 'Ordonnance_Ophtalmologie_Clinique.pdf',
      category: 'ordonnance',
      dateAdded: '15/08/2026',
      sizeKb: 380,
      note: 'Contrôle verres correcteurs et acuité visuelle.',
      fileType: 'PDF',
    },
    {
      id: 'doc-3',
      name: 'Bilan_Sanguin_Glycemie_NFS.pdf',
      category: 'analyse',
      dateAdded: '20/07/2026',
      sizeKb: 520,
      note: 'Analyses à jeun - Paramètres normaux.',
      fileType: 'PDF',
    },
    {
      id: 'doc-4',
      name: 'Fiche_Revision_SYSCOHADA_Compta.pdf',
      category: 'etude',
      dateAdded: '05/09/2026',
      sizeKb: 210,
      note: 'Synthèse des écritures de fin d’exercice.',
      fileType: 'PDF',
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCat, setNewDocCat] = useState<StoredDocument['category']>('ordonnance');
  const [newDocNote, setNewDocNote] = useState('');

  const filteredDocs = documents.filter((doc) => {
    const matchCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchQuery =
      searchQuery.trim() === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.note && doc.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: StoredDocument = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : `${newDocName.trim()}.pdf`,
      category: newDocCat,
      dateAdded: new Date().toLocaleDateString('fr-FR'),
      sizeKb: Math.floor(120 + Math.random() * 400),
      note: newDocNote.trim(),
      fileType: 'PDF',
    };

    setDocuments([newDoc, ...documents]);
    setNewDocName('');
    setNewDocNote('');
    setIsUploadModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const getCategoryBadge = (cat: StoredDocument['category']) => {
    switch (cat) {
      case 'bilan':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0056d6] text-[10px] font-bold border border-blue-200">Bilan OREA</span>;
      case 'ordonnance':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">Ordonnance</span>;
      case 'analyse':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">Analyse / Labo</span>;
      case 'etude':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">Études / BAC</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">Personnel</span>;
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056d6] text-xs font-black uppercase tracking-wider mb-2">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Coffre Sécurisé OREA</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2F5B] tracking-tight">
              Espace Documents & Archivage
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Conservez et organisez vos bilans médicaux OREA, ordonnances, résultats et synthèses d'études.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenPdfExport && (
              <OreaButton
                variant="sante"
                size="md"
                onClick={onOpenPdfExport}
                icon={<FileText className="w-4 h-4" />}
              >
                Générer un bilan PDF
              </OreaButton>
            )}

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#0B2F5B] hover:bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ajouter un document</span>
            </button>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un document par nom ou note..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#0056d6]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Tous les documents' },
              { id: 'bilan', label: 'Bilans OREA' },
              { id: 'ordonnance', label: 'Ordonnances' },
              { id: 'analyse', label: 'Analyses médicales' },
              { id: 'etude', label: 'Études & BAC' },
              { id: 'personnel', label: 'Personnel' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-[#0B2F5B] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0056d6] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                    {getCategoryBadge(doc.category)}
                  </div>
                  {doc.note && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{doc.note}</p>
                  )}
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span>Ajouté le {doc.dateAdded}</span>
                    <span>•</span>
                    <span>{doc.sizeKb} Ko</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button
                  onClick={() => alert(`Téléchargement sécurisé de ${doc.name}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  title="Télécharger"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">Aucun document dans cette section</h4>
              <p className="text-xs text-slate-500 mt-1">
                Générez un bilan de santé ou téléversez un nouveau document.
              </p>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
            <form
              onSubmit={handleAddDocument}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">Archiver un nouveau document</h3>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nom du document :
                </label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="ex: Bilan_Cardio_Septembre"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catégorie :
                </label>
                <select
                  value={newDocCat}
                  onChange={(e) => setNewDocCat(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="ordonnance">Ordonnance</option>
                  <option value="analyse">Résultats d'analyses</option>
                  <option value="bilan">Bilan médical</option>
                  <option value="etude">Études / Certificat</option>
                  <option value="personnel">Personnel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Note / Observation (facultatif) :
                </label>
                <textarea
                  value={newDocNote}
                  onChange={(e) => setNewDocNote(e.target.value)}
                  placeholder="ex: Prescrit par Dr. Kouadio..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0056d6] hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default OreaDocumentsArchiveView;
