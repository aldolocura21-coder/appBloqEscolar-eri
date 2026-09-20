import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, UserStats } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { triggerAndroidUnlock } from '../services/nativeBridge';
import {
  Lock,
  Unlock,
  Clock,
  Award,
  Wifi,
  BatteryMedium,
  Shield,
  Smartphone,
  ExternalLink,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';

interface PhoneUnlockedScreenProps {
  student: StudentProfile;
  stats: UserStats;
  remainingMinutes: number;
  onLockAgain: () => void;
  onOpenAnotherChallenge: () => void;
  onOpenWeekendHub: () => void;
  onOpenParentPin: () => void;
}

export const PhoneUnlockedScreen: React.FC<PhoneUnlockedScreenProps> = ({
  student,
  stats,
  remainingMinutes,
  onLockAgain,
  onOpenAnotherChallenge,
  onOpenWeekendHub,
  onOpenParentPin,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(remainingMinutes * 60);
  const [autoExitCountdown, setAutoExitCountdown] = useState<number>(4);
  const [isAutoExitPaused, setIsAutoExitPaused] = useState(false);
  const exitCalledRef = useRef(false);

  // Contador de salida automática al inicio de Android
  useEffect(() => {
    if (isAutoExitPaused) return;

    if (autoExitCountdown <= 0) {
      if (!exitCalledRef.current) {
        exitCalledRef.current = true;
        triggerAndroidUnlock();
      }
      return;
    }

    const timer = setTimeout(() => {
      setAutoExitCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoExitCountdown, isAutoExitPaused]);

  // Contador regresivo de tiempo libre ganado
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onLockAgain();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onLockAgain]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handleManualExit = () => {
    exitCalledRef.current = true;
    triggerAndroidUnlock();
  };

  return (
    <div
      id="phone-unlocked-screen"
      className="w-full h-screen h-dvh max-h-screen max-h-dvh bg-gradient-to-b from-sky-950 via-slate-900 to-indigo-950 text-white overflow-hidden relative flex flex-col justify-between select-none p-3 sm:p-5"
    >
      {/* Cabecera superior compacta */}
      <div className="flex items-center justify-between text-xs text-slate-300 font-medium shrink-0 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-600/60 font-bold flex items-center gap-1">
            <Unlock className="w-3 h-3 text-emerald-400" /> Celular Desbloqueado
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLockAgain}
            className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>Bloquear</span>
          </button>
        </div>
      </div>

      {/* Widget compacto de Tiempo de Recreo Restante */}
      <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex items-center justify-between shrink-0 my-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Tiempo Libre Ganado
            </span>
            <p className="text-base sm:text-lg font-mono font-black text-white leading-tight">
              {timeFormatted}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenWeekendHub}
          className="px-2.5 py-1 rounded-xl bg-sky-950/70 hover:bg-sky-900/80 border border-sky-600/40 text-sky-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>+{stats.weekendMinutesTotal}m Finde</span>
        </button>
      </div>

      {/* Tarjeta Central Adaptable: Mensaje de Éxito y Cierre Automático */}
      <div className="flex-1 flex flex-col justify-center items-center py-2 px-3 sm:px-4 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/15 shadow-xl text-center min-h-0 overflow-hidden my-1">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md mb-2 shrink-0">
          <Unlock className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-600/60 mb-1.5 shrink-0">
          ¡Ronda Escolar Completada!
        </span>

        <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
          ¡Tu celular está libre!
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-xs mx-auto line-clamp-2">
          Podés usar WhatsApp, YouTube, tus juegos o cualquier app normalmente.
        </p>

        {/* Caja de Salida Automática con Contador */}
        <div className="w-full mt-3 p-2.5 sm:p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center shrink-0">
          {!isAutoExitPaused && autoExitCountdown > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-emerald-200 flex items-center justify-center gap-1.5">
                <span>Minimizando app en</span>
                <span className="text-sm font-mono font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full animate-bounce">
                  {autoExitCountdown}s
                </span>
              </p>
              {/* Barra de progreso animada */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(autoExitCountdown / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-xs font-bold text-emerald-300">
              {isAutoExitPaused ? 'Salida automática pausada' : '¡Listo para usar tu celular!'}
            </p>
          )}

          {/* BOTÓN PRINCIPAL: SALIR AL CELULAR AHORA */}
          <button
            id="exit-to-phone-home-btn"
            type="button"
            onClick={handleManualExit}
            className="w-full mt-2 py-2.5 sm:py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 border border-emerald-300 cursor-pointer transition-all"
          >
            <Smartphone className="w-4 h-4" />
            <span>IR AL CELULAR (SALIR AHORA)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Pausar/Reanudar salida automática */}
          <button
            type="button"
            onClick={() => setIsAutoExitPaused((prev) => !prev)}
            className="text-[10px] text-slate-400 hover:text-slate-200 mt-1.5 inline-flex items-center gap-1"
          >
            {isAutoExitPaused ? (
              <>
                <PlayCircle className="w-3 h-3 text-emerald-400" />
                <span>Reanudar salida automática</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-3 h-3 text-amber-400" />
                <span>Pausar y quedarme en BloqEscolar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Botones de acción rápida inferiores (más compactos) */}
      <div className="space-y-1.5 shrink-0 my-1">
        <button
          type="button"
          onClick={onOpenAnotherChallenge}
          className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 border border-amber-500/20 transition-all cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Hacer más tareas para sumar minutos de fin de semana</span>
        </button>
      </div>

      {/* Pie de navegación ultracompacto */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1.5">
          <AvatarDisplay avatar={student.avatar} size="sm" />
          <span className="font-semibold text-slate-200 text-xs">{student.name}</span>
        </div>

        <button
          type="button"
          onClick={onOpenParentPin}
          className="text-slate-400 hover:text-white flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white/5 text-[11px]"
        >
          <Shield className="w-3 h-3 text-sky-400" />
          <span>Control Padres</span>
        </button>
      </div>
    </div>
  );
};
