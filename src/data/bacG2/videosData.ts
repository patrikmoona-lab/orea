import { BacG2Video, BacG2Domain } from '../../types/bacG2';

export const BAC_G2_VIDEOS_DATABASE: BacG2Video[] = [
  {
    id: 'vid-001',
    youtubeId: 'q2K4nI4aV2w',
    title: 'Comprendre la comptabilité générale de A à Z (Cours complet)',
    channel: 'Gestion & Réussite Éducation',
    description: 'Guide pas-à-pas pour maîtriser les bases de la comptabilité, le bilan, le compte de résultat et la partie double.',
    language: 'fr',
    domain: 'comptabilite',
    level: 'Débutant',
    duration: '28:45',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-CPT-001',
    status: 'approved',
    videoType: 'cours',
  },
  {
    id: 'vid-002',
    youtubeId: 'Wd71J_9n_Fk',
    title: 'Le Bilan comptable et le Patrimoine : Exercice d\'application pas à pas',
    channel: 'Professeur Compta OHADA',
    description: 'Construction d\'un bilan d\'ouverture, distinction entre actif immobilisé et circulant, passif et situation nette.',
    language: 'fr',
    domain: 'comptabilite',
    level: 'Débutant',
    duration: '22:15',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-CPT-002',
    status: 'approved',
    videoType: 'exercice_corrige',
  },
  {
    id: 'vid-003',
    youtubeId: '3y_7Y8eT910',
    title: 'Les Amortissements comptables : Linéaire et Dégressif avec tableau',
    channel: 'Académie BAC Technique',
    description: 'Formules de calcul des annuités, valeur nette comptable (VNC) et enregistrement des dotations (681 / 28).',
    language: 'fr',
    domain: 'comptabilite',
    level: 'Intermédiaire',
    duration: '31:10',
    thumbnail: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-CPT-020',
    status: 'approved',
    videoType: 'cours',
  },
  {
    id: 'vid-004',
    youtubeId: 'bA45qV45nO4',
    title: 'La TVA expliquée simplement : Collectée, Déductible et Déclaration',
    channel: 'Fiscalité Pratique Francophone',
    description: 'Mécanismes de calcul de la TVA, fait générateur, encaissements vs débits et calcul du crédit de TVA.',
    language: 'fr',
    domain: 'fiscalite',
    level: 'Intermédiaire',
    duration: '25:30',
    thumbnail: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-FIS-004',
    status: 'approved',
    videoType: 'cours',
  },
  {
    id: 'vid-005',
    youtubeId: 'W3G4r7lYv1M',
    title: 'Détermination du Résultat Fiscal et Impôt sur les Sociétés (IS)',
    channel: 'Gestion & Fiscalité Africaine',
    description: 'Passage du résultat comptable au résultat fiscal : réintégrations des charges non déductibles et déductions.',
    language: 'fr',
    domain: 'fiscalite',
    level: 'Avancé',
    duration: '34:50',
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-FIS-012',
    status: 'approved',
    videoType: 'cours',
  },
  {
    id: 'vid-006',
    youtubeId: 'q2K4nI4aV2w',
    title: 'Théorie générale des Contrats : Formation, Validité et Vices du consentement',
    channel: 'Droit & Juristes d\'Afrique',
    description: 'Conditions de validité d\'un contrat (Consentement, capacité, objet, cause) et résolution des cas pratiques de droit.',
    language: 'fr',
    domain: 'droit',
    level: 'Intermédiaire',
    duration: '29:40',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-DRO-008',
    status: 'approved',
    videoType: 'cours',
  },
  {
    id: 'vid-007',
    youtubeId: 'Wd71J_9n_Fk',
    title: 'Droit du Travail : Le Contrat de travail, la période d\'essai et le licenciement',
    channel: 'Droit & Entreprises',
    description: 'Règles entourant la rupture du contrat de travail, préavis, indemnités de licenciement et litiges prud\'homaux.',
    language: 'fr',
    domain: 'droit',
    level: 'Révision BAC',
    duration: '38:15',
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-DRO-024',
    status: 'approved',
    videoType: 'cours',
  },
  {
    id: 'vid-008',
    youtubeId: '3y_7Y8eT910',
    title: 'Plan comptable SYSCOHADA Révisé : Maîtriser la codification des 9 classes',
    channel: 'Espace Comptable OHADA',
    description: 'Présentation de l\'Acte Uniforme, structure des comptes à 2, 3 et 4 chiffres et règles de fonctionnement des classes.',
    language: 'fr',
    domain: 'syscohada',
    level: 'Débutant',
    duration: '26:55',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-SYS-005',
    status: 'approved',
    videoType: 'cours',
  },
  {
    id: 'vid-009',
    youtubeId: 'bA45qV45nO4',
    title: 'Le Tableau des Flux de Trésorerie (TFT) selon le SYSCOHADA Révisé',
    channel: 'Expertise Comptable Francophone',
    description: 'Méthodologie de construction du TFT : flux d\'exploitation, flux d\'investissement et flux de financement.',
    language: 'fr',
    domain: 'syscohada',
    level: 'Révision BAC',
    duration: '42:20',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-SYS-025',
    status: 'approved',
    videoType: 'revision',
  },
  {
    id: 'vid-010',
    youtubeId: 'W3G4r7lYv1M',
    title: 'Cas pratique Annale BAC G2 : Clôture d\'exercice et Bilan complet',
    channel: 'BAC G2 Excellence',
    description: 'Correction pas à pas d\'un sujet complet de fin d\'exercice du BAC G2 avec régularisations d\'inventaire.',
    language: 'fr',
    domain: 'comptabilite',
    level: 'Révision BAC',
    duration: '48:30',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    courseId: 'BAC-CPT-035',
    status: 'approved',
    videoType: 'examen',
  },
];

export function searchYoutubeVideos(
  query: string,
  options?: {
    domain?: BacG2Domain;
    language?: 'fr' | 'all';
    videoType?: string;
    level?: string;
  }
): BacG2Video[] {
  const q = query.trim().toLowerCase();
  return BAC_G2_VIDEOS_DATABASE.filter((v) => {
    // Only approved videos are returned to users
    if (v.status !== 'approved') return false;

    if (options?.language && options.language !== 'all' && v.language !== options.language) {
      return false;
    }
    if (options?.domain && v.domain !== options.domain) {
      return false;
    }
    if (options?.level && v.level !== options.level) {
      return false;
    }
    if (options?.videoType && v.videoType !== options.videoType) {
      return false;
    }

    if (!q) return true;

    return (
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.channel.toLowerCase().includes(q) ||
      v.domain.toLowerCase().includes(q)
    );
  });
}
