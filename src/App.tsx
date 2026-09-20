/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  AppPermissions,
  UserStats,
  ParentSettings,
  ActivityLog,
} from './types';
import { PermissionsModal } from './components/PermissionsModal';
import { AvatarCreator } from './components/AvatarCreator';
import { PhoneLockScreen } from './components/PhoneLockScreen';
import { PhoneUnlockedScreen } from './components/PhoneUnlockedScreen';
import { ActivityRunner } from './components/ActivityRunner';
import { FamilyChallengeModal } from './components/FamilyChallengeModal';
import { WeekendRewardsHub } from './components/WeekendRewardsHub';
import { ParentalControlModal } from './components/ParentalControlModal';
import { AvatarDisplay } from './components/AvatarDisplay';
import { PWAInstallModal } from './components/PWAInstallModal';
import { triggerAndroidUnlock, triggerAndroidLock } from './services/nativeBridge';
import {
  Lock,
  Unlock,
  Shield,
  Smartphone,
  Award,
  Users,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Settings,
  RefreshCw,
  Download,
} from 'lucide-react';

const STORAGE_PROFILE_KEY = 'bloqescolar_profile_v1';
const STORAGE_PERMS_KEY = 'bloqescolar_permissions_v1';
const STORAGE_STATS_KEY = 'bloqescolar_stats_v1';
const STORAGE_SETTINGS_KEY = 'bloqescolar_settings_v1';

const DEFAULT_PERMISSIONS: AppPermissions = {
  overlayPermission: false,
  accessibilityPermission: false,
  usageStatsPermission: false,
  privacyAccepted: false,
  acceptedAt: null,
};

const DEFAULT_STATS: UserStats = {
  points: 240,
  weekendMinutesTotal: 90, // Minutos ya ganados
  weekendMinutesUsed: 0,
  currentStreakDays: 3,
  completedActivitiesCount: 4,
  familyChallengesCount: 2,
  lastFamilyChallengeDate: null,
  history: [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      title: 'Compras en el Kiosco (Matemática)',
      subject: 'matematica',
      neededAdultHelp: false,
      pointsEarned: 50,
      minutesEarned: 15,
      success: true,
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      title: 'Seguridad en Internet y Redes (Computación)',
      subject: 'computacion',
      neededAdultHelp: true,
      pointsEarned: 60,
      minutesEarned: 20,
      success: true,
    },
  ],
};

const DEFAULT_SETTINGS: ParentSettings = {
  parentPin: '1234',
  defaultTimerMinutes: 15, // 15 o 20 minutos
  strictMode: true,
  weekendRewardMultiplier: 1,
  autoLockEnabled: true,
  scheduleStart: '08:00',
  scheduleEnd: '18:00',
};

export default function App() {
  // Estados principales con persistencia en localStorage
  const [permissions, setPermissions] = useState<AppPermissions>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PERMS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PERMISSIONS;
    } catch (e) {
      return DEFAULT_PERMISSIONS;
    }
  });

  const [student, setStudent] = useState<StudentProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            id: 'student-default',
            name: 'Mateo',
            age: 10,
            level: 'primaria',
            grade: '5° Grado',
            province: 'Buenos Aires',
            avatar: {
              skinTone: '#fcd34d',
              hairStyle: 'corto',
              hairColor: '#78350f',
              outfit: 'guardapolvo',
              accessory: 'escarapela',
              emotion: 'alegre',
              bgColor: '#e0f2fe',
            },
            createdAt: new Date().toISOString(),
          };
    } catch (e) {
      return null;
    }
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STATS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch (e) {
      return DEFAULT_STATS;
    }
  });

  const [settings, setSettings] = useState<ParentSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  // Vistas y navegación de la app de bloqueo
  const [isPhoneLocked, setIsPhoneLocked] = useState(true);
  const [unlockedRemainingMinutes, setUnlockedRemainingMinutes] = useState(30);

  const [activeModal, setActiveModal] = useState<
    'none' | 'activity' | 'family' | 'weekend' | 'parental' | 'edit_avatar' | 'install'
  >('none');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PERMS_KEY, JSON.stringify(permissions));
    } catch (e) {}
  }, [permissions]);

  useEffect(() => {
    if (student) {
      try {
        localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(student));
      } catch (e) {}
    }
  }, [student]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
    } catch (e) {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Mensaje flotante de notificación
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Manejador de aceptación de permisos
  const handleAcceptPermissions = (updated: AppPermissions) => {
    setPermissions(updated);
    showToast('¡Permisos y resguardo de datos configurados con éxito!');
  };

  // Guardar perfil de estudiante
  const handleSaveStudentProfile = (profile: StudentProfile) => {
    setStudent(profile);
    setActiveModal('none');
    showToast(`¡Avatar de ${profile.name} guardado correctamente!`);
  };

  // Completar actividad escolar (curricular o extracurricular)
  const handleActivityComplete = (
    points: number,
    weekendMinutes: number,
    neededHelp: boolean
  ) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: `Desafío Escolar (${student?.grade || 'Primaria'})`,
      subject: 'matematica',
      neededAdultHelp: neededHelp,
      pointsEarned: points,
      minutesEarned: weekendMinutes,
      success: true,
    };

    setStats((prev) => ({
      ...prev,
      points: prev.points + points,
      weekendMinutesTotal: prev.weekendMinutesTotal + weekendMinutes,
      completedActivitiesCount: prev.completedActivitiesCount + 1,
      history: [newLog, ...prev.history],
    }));

    setActiveModal('none');
    // Desbloquear celular temporalmente (ej: 30 minutos de recreo)
    setUnlockedRemainingMinutes(30);
    setIsPhoneLocked(false);

    // Disparar desbloqueo nativo (pasar app a segundo plano en Android)
    triggerAndroidUnlock();

    showToast(
      `¡Felicitaciones! Ganaste +${weekendMinutes} min para el fin de semana y 30 min de uso libre ahora.`
    );
  };

  // Completar reto familiar (Día por medio con adulto)
  const handleFamilyChallengeComplete = (points: number, weekendMinutes: number) => {
    const newLog: ActivityLog = {
      id: `fam-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: 'Reto en Familia con un Adulto',
      subject: 'lengua',
      neededAdultHelp: true,
      pointsEarned: points,
      minutesEarned: weekendMinutes,
      success: true,
    };

    setStats((prev) => ({
      ...prev,
      points: prev.points + points,
      weekendMinutesTotal: prev.weekendMinutesTotal + weekendMinutes,
      familyChallengesCount: prev.familyChallengesCount + 1,
      lastFamilyChallengeDate: new Date().toISOString(),
      history: [newLog, ...prev.history],
    }));

    setActiveModal('none');
    // Habilita recreo
    setUnlockedRemainingMinutes(45);
    setIsPhoneLocked(false);

    triggerAndroidUnlock();

    showToast(
      `¡Reto familiar completado! Sumaron +${weekendMinutes} min de fin de semana y +${points} puntos.`
    );
  };

  // Desbloqueo parental de emergencia
  const handleEmergencyUnlock = (minutes: number) => {
    setUnlockedRemainingMinutes(minutes);
    setIsPhoneLocked(false);
    setActiveModal('none');

    triggerAndroidUnlock();

    showToast(
      minutes >= 999
        ? 'Celular desbloqueado libremente por hoy por el adulto.'
        : `Desbloqueo de emergencia activado por ${minutes} minutos.`
    );
  };

  // Volver a bloquear
  const handleLockPhone = () => {
    setIsPhoneLocked(true);
    triggerAndroidLock();
    showToast('El celular volvió al modo bloqueo escolar.');
  };

  return (
    <div
      id="bloqescolar-app"
      className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white"
    >
      {/* Toast flotante para avisos pedagógicos y puntos ganados */}
      {toastMessage && (
        <div
          id="app-toast-notification"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-sky-600 text-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-semibold border border-sky-400 animate-in fade-in slide-in-from-top-4"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Contenedor principal a pantalla completa real */}
      <main id="app-main-canvas" className="flex-1 w-full min-h-screen flex flex-col items-center justify-center p-0">
        {student ? (
          isPhoneLocked ? (
            <PhoneLockScreen
              student={student}
              stats={stats}
              timerMinutes={settings.defaultTimerMinutes}
              onStartChallenge={() => setActiveModal('activity')}
              onOpenFamilyChallenge={() => setActiveModal('family')}
              onOpenParentPin={() => setActiveModal('parental')}
              onOpenWeekendHub={() => setActiveModal('weekend')}
              onOpenInstallModal={() => setActiveModal('install')}
            />
          ) : (
            <PhoneUnlockedScreen
              student={student}
              stats={stats}
              remainingMinutes={unlockedRemainingMinutes}
              onLockAgain={handleLockPhone}
              onOpenAnotherChallenge={() => setActiveModal('activity')}
              onOpenWeekendHub={() => setActiveModal('weekend')}
              onOpenParentPin={() => setActiveModal('parental')}
            />
          )
        ) : (
          <div className="w-full max-w-xl text-center p-8 bg-slate-800/80 rounded-3xl border border-slate-700">
            <h2 className="text-xl font-bold mb-2">Comenzá configurando el Avatar Escolar</h2>
            <button
              onClick={() => setActiveModal('edit_avatar')}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 rounded-xl text-white font-bold"
            >
              Crear Perfil y Avatar
            </button>
          </div>
        )}
      </main>

      {/* Modales según interacción */}

      {/* 1. Modal de Permisos y Condiciones Iniciales */}
      {(!permissions.privacyAccepted || !permissions.overlayPermission) && (
        <PermissionsModal
          permissions={permissions}
          onAccept={handleAcceptPermissions}
        />
      )}

      {/* 2. Modal de Creación / Edición de Avatar */}
      {activeModal === 'edit_avatar' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-6">
            <AvatarCreator
              initialProfile={student}
              onSave={handleSaveStudentProfile}
              onCancel={student ? () => setActiveModal('none') : undefined}
            />
          </div>
        </div>
      )}

      {/* 3. Modal de Resolución de Actividad (Temporizador de 15-20 min y 2da opción con adulto) */}
      {activeModal === 'activity' && student && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="w-full h-full sm:h-auto sm:max-w-2xl sm:my-6">
            <ActivityRunner
              student={student}
              initialMinutes={settings.defaultTimerMinutes}
              onComplete={handleActivityComplete}
              onCancel={() => setActiveModal('none')}
            />
          </div>
        </div>
      )}

      {/* 4. Modal de Reto Familiar (Día por medio con un adulto) */}
      {activeModal === 'family' && (
        <FamilyChallengeModal
          onComplete={handleFamilyChallengeComplete}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* 5. Modal de Bolsa de Recompensas de Fin de Semana */}
      {activeModal === 'weekend' && student && (
        <WeekendRewardsHub
          stats={stats}
          student={student}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* 6. Modal de Control Parental (PIN) */}
      {activeModal === 'parental' && student && (
        <ParentalControlModal
          settings={settings}
          stats={stats}
          student={student}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
            showToast('Configuración parental actualizada.');
          }}
          onEmergencyUnlock={handleEmergencyUnlock}
          onEditStudentProfile={() => setActiveModal('edit_avatar')}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* 7. Modal de Instalación en Celular PWA */}
      <PWAInstallModal
        isOpen={activeModal === 'install'}
        onClose={() => setActiveModal('none')}
      />
    </div>
  );
}
