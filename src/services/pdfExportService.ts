import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OreaUserProfile } from '../types';

export interface HealthReportData {
  userProfile: Partial<OreaUserProfile>;
  reportDate?: string;
  startDate?: string;
  endDate?: string;
  habits?: {
    title: string;
    target: string;
    progress: string;
    streak: number;
    period: string;
  }[];
  hydration?: {
    dailyTargetMl: number;
    averageConsumedMl: number;
    progressPercent: number;
    historyDays: { date: string; consumedMl: number; targetMl: number }[];
  };
  physicalActivity?: {
    completedSessions: number;
    weeklyFrequency: string;
    totalDurationMinutes: number;
    progressNote: string;
    recentSessions: { date: string; program: string; duration: string }[];
  };
  nutrition?: {
    dietaryType: string;
    dailyHabits: string[];
    waterGoalAchieved: boolean;
    localFoodsIncorporated: string[];
  };
  cycleData?: {
    active: boolean;
    lastPeriodDate?: string;
    averageCycleDays?: number;
    currentPhase?: string;
    recordedSymptoms?: string[];
  };
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    times: string;
    notes?: string;
  }[];
  appointments?: {
    date: string;
    type: string;
    practitionerOrFacility: string;
    notes?: string;
  }[];
  personalNotes?: string[];
  medicalObservations?: string;
}

/**
 * Generate a genuine A4 vector PDF for OREA Health Report
 * adhering to strict medical styling, tables, headers, footers and disclaimers.
 */
export function generateOreaHealthReportPdf(data: HealthReportData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryNavy = [11, 47, 91]; // #0B2F5B
  const primaryCyan = [0, 166, 199]; // #00A6C7
  const accentGreen = [0, 196, 159]; // #00C49F
  const darkSlate = [30, 41, 59]; // #1E293B
  const mutedGray = [100, 116, 139]; // #64748B
  const lightBg = [241, 245, 249]; // #F1F5F9
  const borderGray = [226, 232, 240]; // #E2E8F0

  let currentY = margin;

  // Format Dates
  const today = new Date();
  const reportDateStr = data.reportDate || today.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const periodStart = data.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const periodEnd = data.endDate || today.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const reportId = `OREA-REP-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  // =========================================================================
  // 1. HEADER (Official OREA Branding & Title)
  // =========================================================================
  // Top Banner Stripe
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(margin, currentY, contentWidth, 24, 'F');

  // Cyan Accent Line
  doc.setFillColor(primaryCyan[0], primaryCyan[1], primaryCyan[2]);
  doc.rect(margin, currentY + 23, contentWidth, 1.2, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('OREA', margin + 6, currentY + 9);

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Mieux comprendre. Mieux vivre. Mieux évoluer.', margin + 6, currentY + 15);

  // Document Title on right side of banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('BILAN DE SANTÉ PERSONNEL', pageWidth - margin - 6, currentY + 9, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Réf: ${reportId}`, pageWidth - margin - 6, currentY + 15, { align: 'right' });

  currentY += 28;

  // =========================================================================
  // 2. PATIENT & REPORT METADATA BOX
  // =========================================================================
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, currentY, contentWidth, 19, 2, 2, 'FD');

  const fullName = `${data.userProfile.firstName || 'Membre'} ${data.userProfile.lastName || 'OREA'}`.trim();
  const userCountry = data.userProfile.country || 'Non spécifié';
  const userPlan = (data.userProfile.plan || 'Standard').toUpperCase();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('TITULAIRE DU BILAN :', margin + 4, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(fullName, margin + 45, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('PAYS & RÉSIDENCE :', margin + 4, currentY + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(userCountry, margin + 45, currentY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('DATE DU RAPPORT :', margin + 100, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(reportDateStr, margin + 135, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('PÉRIODE ANALYSÉE :', margin + 100, currentY + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`${periodStart} — ${periodEnd}`, margin + 135, currentY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('FORFAIT OREA :', margin + 4, currentY + 15.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(accentGreen[0], accentGreen[1], accentGreen[2]);
  doc.text(userPlan, margin + 45, currentY + 15.5);

  currentY += 23;

  // Helper function for section headings
  const addSectionHeader = (title: string, number: string) => {
    // Page break protection
    if (currentY > pageHeight - 35) {
      doc.addPage();
      currentY = margin + 5;
    }

    doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.rect(margin, currentY, 3, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(`${number}. ${title.toUpperCase()}`, margin + 5, currentY + 4.8);

    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin + 5, currentY + 6.5, pageWidth - margin, currentY + 6.5);

    currentY += 10;
  };

  // =========================================================================
  // SECTION 1 — SYNTHÈSE GLOBALE
  // =========================================================================
  addSectionHeader('Synthèse des données enregistrées', '1');

  const habitsCount = data.habits?.length || 0;
  const completedHabits = data.habits?.filter((h) => h.progress.includes('100%') || h.streak > 0).length || 0;
  const avgHydration = data.hydration ? `${data.hydration.averageConsumedMl} ml / jour` : 'Non renseigné';
  const totalWorkouts = data.physicalActivity ? `${data.physicalActivity.completedSessions} séances terminées` : 'Non renseigné';
  const medsCount = data.medications?.length || 0;
  const rdvCount = data.appointments?.length || 0;

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Indicateur de suivi', 'Donnée enregistrée', 'Statut / Régularité']],
    body: [
      ['Habitudes actives', `${habitsCount} configurée(s)`, `${completedHabits} activement suivie(s)`],
      ['Hydratation moyenne', avgHydration, data.hydration ? `${data.hydration.progressPercent}% de l'objectif` : '—'],
      ['Activité physique', totalWorkouts, data.physicalActivity?.weeklyFrequency || 'Régulier'],
      ['Médicaments & Traitements', `${medsCount} médicament(s) enregistré(s)`, medsCount > 0 ? 'Rappels actifs' : 'Aucun'],
      ['Consultations & Examens', `${rdvCount} événement(s) au calendrier`, rdvCount > 0 ? 'Planifié' : 'Aucun'],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [11, 47, 91],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 2.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // =========================================================================
  // SECTION 2 — HABITUDES & SÉRIES
  // =========================================================================
  addSectionHeader('Suivi des habitudes quotidiennes', '2');

  if (data.habits && data.habits.length > 0) {
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Habitude', 'Objectif fixé', 'Progression', 'Série (Jours)', 'Période']],
      body: data.habits.map((h) => [h.title, h.target, h.progress, `${h.streak} j`, h.period]),
      theme: 'grid',
      headStyles: {
        fillColor: [0, 166, 199],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        cellPadding: 2.5,
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text('Aucune habitude active enregistrée sur la période sélectionnée.', margin + 2, currentY);
    currentY += 8;
  }

  // =========================================================================
  // SECTION 3 — HYDRATATION
  // =========================================================================
  addSectionHeader('Hydratation & Apport liquidien', '3');

  if (data.hydration) {
    const hydra = data.hydration;
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Objectif quotidien', 'Consommation moyenne', 'Taux de réussite', 'Avertissement']],
      body: [
        [
          `${hydra.dailyTargetMl} ml`,
          `${hydra.averageConsumedMl} ml`,
          `${hydra.progressPercent}%`,
          'Estimation indicative calculée selon le profil',
        ],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [11, 47, 91],
        textColor: [255, 255, 255],
        fontSize: 8.5,
      },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text('Données d’hydratation non renseignées.', margin + 2, currentY);
    currentY += 8;
  }

  // =========================================================================
  // SECTION 4 — ACTIVITÉ PHYSIQUE & SPORT
  // =========================================================================
  addSectionHeader('Activité physique & Entraînements', '4');

  if (data.physicalActivity && data.physicalActivity.recentSessions.length > 0) {
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Date', 'Programme / Type de séance', 'Durée']],
      body: data.physicalActivity.recentSessions.map((s) => [s.date, s.program, s.duration]),
      theme: 'grid',
      headStyles: {
        fillColor: [0, 166, 199],
        textColor: [255, 255, 255],
        fontSize: 8.5,
      },
      styles: { fontSize: 8, cellPadding: 2 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text('Séances d’entraînement régulières au poids du corps suivies dans OREA.', margin + 2, currentY);
    currentY += 8;
  }

  // =========================================================================
  // SECTION 5 — NUTRITION & TERROIR
  // =========================================================================
  addSectionHeader('Nutrition & Équilibre alimentaire', '5');

  if (data.nutrition) {
    const nut = data.nutrition;
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Régime / Préférence', 'Habitudes alimentaires', 'Aliments locaux & super-aliments']],
      body: [
        [
          nut.dietaryType || 'Équilibré',
          nut.dailyHabits.join(', ') || 'Repas réguliers',
          nut.localFoodsIncorporated.join(', ') || 'Moringa, Fonio, Hibiscus, Safou',
        ],
      ],
      theme: 'striped',
      headStyles: { fillColor: [11, 47, 91], textColor: [255, 255, 255], fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text('Données nutritionnelles générales enregistrées.', margin + 2, currentY);
    currentY += 8;
  }

  // =========================================================================
  // SECTION 6 — CYCLE FÉMININ & SANTÉ HORMONALE (Si actif)
  // =========================================================================
  if (data.cycleData && data.cycleData.active) {
    addSectionHeader('Suivi physiologique du cycle féminin', '6');
    const cyc = data.cycleData;
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Dernières règles', 'Durée moyenne cycle', 'Phase estimée', 'Symptômes observés']],
      body: [
        [
          cyc.lastPeriodDate || 'Renseignée',
          `${cyc.averageCycleDays || 28} jours`,
          cyc.currentPhase || 'Folliculaire',
          cyc.recordedSymptoms?.join(', ') || 'Aucun symptôme invalidant',
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [219, 39, 119], textColor: [255, 255, 255], fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 2.5 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // =========================================================================
  // SECTION 7 — MÉDICAMENTS & POSOLOGIES ENREGISTRÉES
  // =========================================================================
  addSectionHeader('Traitements & Médicaments enregistrés', '7');

  if (data.medications && data.medications.length > 0) {
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Médicament', 'Dosage saisi', 'Fréquence', 'Horaires de prise', 'Notes du patient']],
      body: data.medications.map((m) => [m.name, m.dosage, m.frequency, m.times, m.notes || '—']),
      theme: 'grid',
      headStyles: {
        fillColor: [11, 47, 91],
        textColor: [255, 255, 255],
        fontSize: 8.5,
      },
      styles: { fontSize: 8, cellPadding: 2 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text('Aucun traitement médicamenteux récurrent enregistré dans l’armoire à pharmacie.', margin + 2, currentY);
    currentY += 8;
  }

  // =========================================================================
  // SECTION 8 — AGENDA DES CONSULTATIONS & EXAMENS
  // =========================================================================
  addSectionHeader('Agenda médical & Historique des rendez-vous', '8');

  if (data.appointments && data.appointments.length > 0) {
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Date & Heure', 'Type de consultation', 'Praticien / Établissement', 'Notes']],
      body: data.appointments.map((a) => [a.date, a.type, a.practitionerOrFacility, a.notes || '—']),
      theme: 'grid',
      headStyles: {
        fillColor: [0, 166, 199],
        textColor: [255, 255, 255],
        fontSize: 8.5,
      },
      styles: { fontSize: 8, cellPadding: 2 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 8;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text('Aucun rendez-vous médical enregistré sur cette période.', margin + 2, currentY);
    currentY += 8;
  }

  // =========================================================================
  // SECTION 9 — NOTES PERSONNELLES EXPORTÉES
  // =========================================================================
  addSectionHeader('Notes personnelles & Journal de bord', '9');

  if (data.personalNotes && data.personalNotes.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    data.personalNotes.forEach((note) => {
      if (currentY > pageHeight - 30) {
        doc.addPage();
        currentY = margin + 5;
      }
      doc.text(`• ${note}`, margin + 3, currentY);
      currentY += 5;
    });
    currentY += 3;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text('Aucune note particulière exportée.', margin + 2, currentY);
    currentY += 8;
  }

  // =========================================================================
  // SECTION 10 — OBSERVATIONS DU PROFESSIONNEL DE SANTÉ
  // =========================================================================
  addSectionHeader('Observations & Recommandations professionnelles', '10');

  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = margin + 5;
  }

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.4);
  doc.rect(margin, currentY, contentWidth, 22);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text(
    'Zone réservée au médecin, professionnel de santé ou notes de suivi lors de la consultation :',
    margin + 3,
    currentY + 5
  );

  currentY += 28;

  // =========================================================================
  // FOOTER ON EVERY PAGE (Page Numbers, Disclaimers, Official Seal)
  // =========================================================================
  const totalPages = (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    // Legal Disclaimer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text(
      'Ce document rassemble les informations enregistrées dans OREA. Il ne constitue pas, à lui seul, un diagnostic médical, une ordonnance ou un avis médical.',
      margin,
      pageHeight - 10
    );

    // Document Generation Timestamp & Page Number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(
      `OREA • Rapport généré le ${reportDateStr} • Page ${i} sur ${totalPages}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: 'right' }
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.text(`Identifiant: ${reportId}`, margin, pageHeight - 6);
  }

  return doc;
}

/**
 * Downloads the PDF directly with formatted name OREA_Bilan_Sante_YYYY-MM-DD.pdf
 */
export function downloadOreaHealthReportPdf(data: HealthReportData): void {
  const doc = generateOreaHealthReportPdf(data);
  const today = new Date();
  const dateFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const filename = `OREA_Bilan_Sante_${dateFormatted}.pdf`;
  doc.save(filename);
}

/**
 * Opens browser print dialog for the generated PDF
 */
export function printOreaHealthReportPdf(data: HealthReportData): void {
  const doc = generateOreaHealthReportPdf(data);
  doc.autoPrint();
  const blobUrl = doc.output('bloburl');
  const printWindow = window.open(blobUrl);
  if (printWindow) {
    printWindow.focus();
  }
}
