import { BacG2Course, BacG2Domain } from '../../types/bacG2';
import { COMPTABILITE_COURSES } from './comptabiliteCourses';
import { FISCALITE_COURSES } from './fiscaliteCourses';
import { DROIT_COURSES } from './droitCourses';
import { SYSCOHADA_COURSES } from './syscohadaCourses';

export const ALL_BAC_G2_COURSES: BacG2Course[] = [
  ...COMPTABILITE_COURSES,
  ...FISCALITE_COURSES,
  ...DROIT_COURSES,
  ...SYSCOHADA_COURSES,
];

export const BAC_G2_DOMAIN_LABELS: Record<BacG2Domain, { label: string; iconName: string; color: string; bg: string; border: string }> = {
  comptabilite: {
    label: 'Comptabilité',
    iconName: 'Calculator',
    color: '#0056d6',
    bg: '#ebf4ff',
    border: '#cde1fe',
  },
  fiscalite: {
    label: 'Fiscalité',
    iconName: 'Receipt',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a',
  },
  droit: {
    label: 'Droit',
    iconName: 'Scale',
    color: '#7c3aed',
    bg: '#f3e8ff',
    border: '#e9d5ff',
  },
  syscohada: {
    label: 'SYSCOHADA',
    iconName: 'BookMarked',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
};

export function getCoursesByDomain(domain: BacG2Domain): BacG2Course[] {
  return ALL_BAC_G2_COURSES.filter((c) => c.domain === domain);
}

export function getCourseById(id: string): BacG2Course | undefined {
  return ALL_BAC_G2_COURSES.find((c) => c.id === id);
}
