export type BacG2Domain = 'comptabilite' | 'fiscalite' | 'droit' | 'syscohada';

export type BacG2Level = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Révision BAC';

export type BacG2ContentType = 'cours' | 'exercice' | 'video' | 'annale' | 'simulation' | 'fiche';

export interface BacG2Course {
  id: string; // e.g. 'BAC-CPT-001'
  title: string;
  domain: BacG2Domain;
  subcategory: string;
  level: BacG2Level;
  durationMinutes: number;
  description: string;
  objectives: string[];
  introduction: string;
  content: string; // Markdown or rich structured text
  keyNotions: string[];
  definitions: { term: string; definition: string }[];
  example: {
    title: string;
    statement: string;
    solution: string;
  };
  methodology: string[];
  exercise: {
    question: string;
    options?: string[];
    correctOptionIndex?: number;
    practicalTask?: string;
    correction: string;
    explanation: string;
  };
  summary: string[]; // Points clés à retenir
  youtubeId?: string; // Real verified French educational video ID
  videoTitle?: string;
  resources?: { name: string; type: string; url?: string }[];
  keywords: string[];
}

export interface BacG2Video {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  description: string;
  language: 'fr' | 'all';
  domain: BacG2Domain;
  level: BacG2Level;
  duration: string;
  thumbnail?: string;
  courseId?: string;
  status: 'approved' | 'pending' | 'rejected';
  videoType: 'cours' | 'exercice_corrige' | 'revision' | 'methode' | 'examen';
}

export interface BacG2UserProgress {
  completedCourseIds: string[];
  inProgressCourseIds: Record<string, number>; // courseId -> percentage (0-100)
  lastVisitedCourseId?: string;
  lastVisitedTimestamp?: number;
  favoriteCourseIds: string[];
  favoriteVideoIds: string[];
  totalStudyTimeMinutes: number;
  simulatorScores: {
    id: string;
    domain: string;
    score: number; // out of 20
    totalQuestions: number;
    correctQuestions: number;
    date: string;
  }[];
  earnedBadgeIds: string[];
}

export interface BacG2Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface BacG2ExamQuestion {
  id: string;
  domain: BacG2Domain;
  subcategory: string;
  level: BacG2Level;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface BacG2Annale {
  id: string;
  title: string;
  session: string;
  year: number;
  domain: BacG2Domain;
  durationMinutes: number;
  coefficient: number;
  instructions: string;
  statement: string;
  sections: {
    title: string;
    points: number;
    questions: {
      question: string;
      answerKey: string;
      points: number;
    }[];
  }[];
}

export interface BacG2CheatSheet {
  id: string;
  title: string;
  domain: BacG2Domain;
  readTime: string;
  highlights: string[];
  content: string;
  formulasOrRules: { label: string; formula: string; explanation: string }[];
}
