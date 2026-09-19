export type SchoolLevel = 'primaria' | 'secundaria';

export type SubjectId =
  | 'matematica'
  | 'lengua'
  | 'naturales'
  | 'sociales'
  | 'ingles'
  | 'computacion'
  | 'educacion_fisica';

export type ActivityCategory = 'curricular' | 'extracurricular' | 'familiar';

export interface AvatarConfig {
  skinTone: string;
  hairStyle: 'corto' | 'rulos' | 'largo' | 'trenzas' | 'rapado';
  hairColor: string;
  outfit: 'guardapolvo' | 'remera_celeste' | 'buzo_azul' | 'campera_escolar';
  accessory: 'ninguno' | 'anteojos' | 'gorra' | 'auriculares' | 'escarapela';
  emotion: 'alegre' | 'concentrado' | 'genio';
  bgColor: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  level: SchoolLevel;
  grade: string; // ej: "4° Grado" o "2° Año"
  province: string;
  avatar: AvatarConfig;
  createdAt: string;
}

export interface AppPermissions {
  overlayPermission: boolean;
  accessibilityPermission: boolean;
  usageStatsPermission: boolean;
  privacyAccepted: boolean;
  acceptedAt: string | null;
}

export interface ActivityQuestion {
  id: string;
  subject: SubjectId;
  category: ActivityCategory;
  level: SchoolLevel;
  minGradeNumber: number; // 1 a 7 para primaria, 1 a 6 para secundaria
  subjectLabel: string;
  title: string;
  context?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  adultHint: string; // Pista pedagógica para el tutor
  pedagogicalExplanation: string; // Explicación una vez resuelto
  pointsReward: number;
  weekendMinutesReward: number;
}

export interface FamilyChallenge {
  id: string;
  title: string;
  description: string;
  adultRole: string;
  studentRole: string;
  reflectionQuestion: string;
  durationMinutes: number;
  rewardPoints: number;
  rewardMinutes: number;
  tag: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  title: string;
  subject: SubjectId;
  neededAdultHelp: boolean;
  pointsEarned: number;
  minutesEarned: number;
  success: boolean;
}

export interface UserStats {
  points: number;
  weekendMinutesTotal: number;
  weekendMinutesUsed: number;
  currentStreakDays: number;
  completedActivitiesCount: number;
  familyChallengesCount: number;
  lastFamilyChallengeDate: string | null;
  history: ActivityLog[];
}

export interface ParentSettings {
  parentPin: string;
  defaultTimerMinutes: number; // 15 o 20
  strictMode: boolean;
  weekendRewardMultiplier: number;
  autoLockEnabled: boolean;
  scheduleStart: string; // "08:00"
  scheduleEnd: string; // "18:00"
}
