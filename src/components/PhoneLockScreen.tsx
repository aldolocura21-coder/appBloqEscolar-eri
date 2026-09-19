import React, { useState, useEffect } from 'react';
import { StudentProfile, UserStats } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Lock,
  Unlock,
  Sparkles,
  Clock,
  Users,
  Shield,
  PhoneCall,
  Calendar,
  Award,
  ChevronRight,
  Flame,
  AlertCircle,
  Wifi,
  BatteryMedium,
  Download,
} from 'lucide-react';

interface PhoneLockScreenProps {
  student: StudentProfile;
  stats: UserStats;
  timerMinutes: number;
  onStartChallenge: () => void;
  onOpenFamilyChallenge: () => void;
  onOpenParentPin: () => void;
  onOpenWeekendHub: () => void;
  onOpenInstallModal?: () => void;
}

export const PhoneLockScreen: React.FC<PhoneLockScreenProps> = ({
  student,
  stats,
  timerMinutes,
  onStartChallenge,
  onOpenFamilyChallenge,
  onOpenParentPin,
  onOpenWeekendHub,
  onOpenInstallModal,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString('es-AR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  // Determinar si hoy corresponde reto familiar (día por medio)
  const isFamilyChallengeRecommended = true;

  return (
    <div id="phone-lock-screen" className="w-full max-w-md mx-auto rounded-[40px] bg-slate-950 text-white shadow-2xl border-8 border-slate-900 overflow-hidden relative min-h-[720px] flex flex-col justify-between select-none">
      {/* Barra superior de estado de celular */}
      <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-slate-300 font-medium z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white tracking-wider">{currentTime || '15:30'}</span>
          <span className="text-[10px] text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/50">
            Escolar
          </span>
        </div>
        <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto -mt-1 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-800 rounded-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-[11px]">4G</span>
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">85%</span>
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Reloj central grande de pantalla de bloqueo */}
      <div className="px-6 pt-6 text-center z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs mb-3 shadow-inner">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Celular Bloqueado por Horario de Estudio</span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-white font-sans">
          {currentTime || '15:30'}
        </h1>
        <p className="text-sm font-medium text-sky-200/80 mt-1 capitalize">{formattedDate}</p>

        {/* Ficha del alumno con avatar */}
        <div className="mt-4 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarDisplay avatar={student.avatar} size="sm" />
            <div className="text-left">
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{student.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {student.level === 'primaria' ? 'Primaria' : 'Secundaria'}
                </span>
              </p>
              <p className="text-xs text-slate-400">
                {student.grade} • {student.province}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.points} pts</span>
          </div>
        </div>
      </div>

      {/* Bolsa de minutos para el fin de semana */}
      <div className="px-6 py-2 z-10">
        <div
          id="weekend-badge-card"
          onClick={onOpenWeekendHub}
          className="p-3.5 rounded-2xl bg-linear-to-r from-sky-900/60 to-indigo-900/60 border border-sky-700/50 cursor-pointer hover:border-sky-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  Bolsa Fin de Semana
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                  Premio
                </span>
              </div>
              <p className="text-sm font-extrabold text-white">
                {stats.weekendMinutesTotal} min acumulados
              </p>
              <p className="text-[11px] text-slate-300">
                ¡Más tareas resueltas = más tiempo libre el sábado y domingo!
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Área de Desafíos y Desbloqueo */}
      <div className="px-6 py-2 space-y-2.5 z-10">
        {/* Botón principal: Iniciar Desafío para Desbloquear */}
        <button
          id="start-challenge-unlock-btn"
          type="button"
          onClick={onStartChallenge}
          className="w-full py-4 px-5 rounded-2xl bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-between transition-all cursor-pointer transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 text-white">
              <Unlock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-extrabold">Resolver Desafío ({timerMinutes} min)</p>
              <p className="text-[11px] text-sky-100 font-normal">
                Curricular / No curricular • Sumá +15 a 20 min
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Botón secundario: Reto Familiar Día por Medio */}
        <button
          id="family-challenge-unlock-btn"
          type="button"
          onClick={onOpenFamilyChallenge}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 text-white font-semibold text-xs flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-200">
                  Reto en Familia (Día por medio)
                </span>
                <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1 rounded">
                  Doble premio
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal">
                Hagan una actividad juntos con un adulto (+40 min y +120 pts)
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Acceso a Instalación en Celular */}
        {onOpenInstallModal && (
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>¿Cómo instalar BloqEscolar en este celular?</span>
          </button>
        )}
      </div>

      {/* Pie de pantalla de bloqueo: Botón de Padres / Emergencia */}
      <div className="p-6 pt-3 border-t border-white/10 bg-slate-950/90 backdrop-blur-md flex items-center justify-between text-xs z-10">
        <button
          id="emergency-call-btn"
          type="button"
          onClick={() => {
            alert(
              'Llamada de emergencia habilitada: 911 (Policía/Emergencias Argentina), 107 (SAME), o contacto directo con mamá/papá.'
            );
          }}
          className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors font-semibold"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Emergencias</span>
        </button>

        <button
          id="parent-pin-access-btn"
          type="button"
          onClick={onOpenParentPin}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
        >
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>Control Parental (PIN)</span>
        </button>
      </div>

      {/* Brillo de fondo atmosférico */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};
