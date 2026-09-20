import React, { useState, useEffect } from 'react';
import { StudentProfile, UserStats } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Lock,
  Unlock,
  Users,
  Shield,
  PhoneCall,
  Award,
  ChevronRight,
  Flame,
  Wifi,
  BatteryMedium,
  Download,
  Maximize,
  Minimize,
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

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

  return (
    <div
      id="phone-lock-screen"
      className="w-full h-screen h-dvh max-h-screen max-h-dvh bg-slate-950 text-white overflow-hidden relative flex flex-col justify-between select-none p-3 sm:p-5"
    >
      {/* Barra superior de estado compacta */}
      <div className="flex items-center justify-between text-xs text-slate-300 font-medium z-10 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white tracking-wider">{currentTime || '15:30'}</span>
          <span className="text-[10px] text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-800/60 font-semibold">
            Modo Escolar
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-950/80 hover:bg-sky-900 border border-sky-600/40 text-sky-300 text-[10px] transition-colors cursor-pointer"
            title="Pantalla Completa"
          >
            {isFullscreen ? <Minimize className="w-2.5 h-2.5" /> : <Maximize className="w-2.5 h-2.5" />}
            <span>{isFullscreen ? 'Salir' : 'Pantalla Completa'}</span>
          </button>
        </div>
      </div>

      {/* Reloj central grande y adaptable */}
      <div className="text-center z-10 my-auto py-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-[11px] shadow-inner mb-1.5">
          <Lock className="w-3 h-3 text-amber-400" />
          <span>Celular Bloqueado por Horario de Estudio</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans leading-none my-1">
          {currentTime || '15:30'}
        </h1>
        <p className="text-xs sm:text-sm font-medium text-sky-200/80 capitalize">{formattedDate}</p>

        {/* Ficha del alumno con avatar (compacta) */}
        <div className="mt-2.5 p-2 sm:p-2.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AvatarDisplay avatar={student.avatar} size="sm" />
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 leading-tight">
                <span>{student.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {student.level === 'primaria' ? 'Primaria' : 'Secundaria'}
                </span>
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {student.grade} • {student.province}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>{stats.points} pts</span>
          </div>
        </div>
      </div>

      {/* Bolsa de minutos para el fin de semana */}
      <div className="z-10 shrink-0 my-1">
        <div
          id="weekend-badge-card"
          onClick={onOpenWeekendHub}
          className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-sky-900/60 to-indigo-900/60 border border-sky-700/50 cursor-pointer hover:border-sky-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-300">
                  Bolsa Fin de Semana
                </span>
                <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                  Premio
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-white mt-0.5 leading-tight">
                {stats.weekendMinutesTotal} min acumulados
              </p>
              <p className="text-[10px] text-slate-300 leading-tight">
                ¡Más tareas resueltas = más tiempo libre el fin de semana!
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>
      </div>

      {/* Área de Desafíos y Desbloqueo */}
      <div className="space-y-1.5 sm:space-y-2 z-10 shrink-0 my-1">
        {/* Botón principal: Iniciar Desafío para Desbloquear */}
        <button
          id="start-challenge-unlock-btn"
          type="button"
          onClick={onStartChallenge}
          className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-between transition-all cursor-pointer transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 text-white shrink-0">
              <Unlock className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs sm:text-sm font-extrabold">Resolver Ronda Escolar (5 Actividades)</p>
              <p className="text-[10px] text-sky-100 font-normal">
                Completá las 5 actividades para liberar el celular
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white shrink-0" />
        </button>

        {/* Botón secundario: Reto Familiar Día por Medio */}
        <button
          id="family-challenge-unlock-btn"
          type="button"
          onClick={onOpenFamilyChallenge}
          className="w-full py-2 sm:py-2.5 px-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 text-white font-semibold text-xs flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-amber-200">
                  Reto en Familia (Día por medio)
                </span>
                <span className="text-[8px] bg-amber-500 text-slate-950 font-bold px-1 rounded">
                  Doble premio
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-normal">
                Hagan una actividad juntos (+40 min y +120 pts)
              </p>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        {/* Acceso a Instalación en Celular */}
        {onOpenInstallModal && (
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 font-semibold text-[10px] sm:text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3 h-3 text-emerald-400" />
            <span>¿Cómo instalar BloqEscolar en este celular?</span>
          </button>
        )}
      </div>

      {/* Pie de pantalla de bloqueo: Botón de Padres / Emergencia */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs z-10 shrink-0">
        <button
          id="emergency-call-btn"
          type="button"
          onClick={() => {
            alert(
              'Llamada de emergencia habilitada: 911 (Policía/Emergencias Argentina), 107 (SAME), o contacto directo con mamá/papá.'
            );
          }}
          className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors font-semibold text-[11px]"
        >
          <PhoneCall className="w-3 h-3" />
          <span>Emergencias</span>
        </button>

        <button
          id="parent-pin-access-btn"
          type="button"
          onClick={onOpenParentPin}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 text-[11px]"
        >
          <Shield className="w-3 h-3 text-sky-400" />
          <span>Control Parental (PIN)</span>
        </button>
      </div>

      {/* Brillo de fondo atmosférico */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};
