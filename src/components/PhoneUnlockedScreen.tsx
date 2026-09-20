import React, { useState, useEffect } from 'react';
import { StudentProfile, UserStats } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { triggerAndroidUnlock } from '../services/nativeBridge';
import {
  Lock,
  Unlock,
  Clock,
  Sparkles,
  Award,
  Play,
  Gamepad2,
  Tv,
  MessageCircle,
  Camera,
  Music,
  Compass,
  Wifi,
  BatteryMedium,
  Shield,
  BookOpen,
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

  // Al entrar al estado desbloqueado, solicitar inmediatamente a Android pasar a segundo plano
  useEffect(() => {
    triggerAndroidUnlock();
  }, []);

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

  const apps = [
    { name: 'Juegos Libres', icon: Gamepad2, color: 'bg-rose-500' },
    { name: 'Videos / Series', icon: Tv, color: 'bg-red-600' },
    { name: 'Mensajes', icon: MessageCircle, color: 'bg-emerald-500' },
    { name: 'Música', icon: Music, color: 'bg-violet-600' },
    { name: 'Cámara', icon: Camera, color: 'bg-sky-500' },
    { name: 'Explorar', icon: Compass, color: 'bg-amber-500' },
  ];

  return (
    <div id="phone-unlocked-screen" className="w-full min-h-screen bg-linear-to-b from-sky-900 via-slate-900 to-indigo-950 text-white overflow-hidden relative flex flex-col justify-between select-none">
      {/* Barra superior del celular */}
      <div className="pt-4 px-6 pb-2 flex items-center justify-between text-xs text-slate-300 font-medium z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white tracking-wider">16:45</span>
          <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/50 flex items-center gap-1">
            <Unlock className="w-2.5 h-2.5" /> Desbloqueado
          </span>
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

      {/* Widget Flotante de Tiempo de Recreo Ganado */}
      <div className="p-4 mx-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-between z-10 mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
            <Clock className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Tiempo Libre en Uso
            </span>
            <p className="text-xl font-mono font-extrabold text-white">{timeFormatted}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLockAgain}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Bloquear Celu</span>
        </button>
      </div>

      {/* Tarjeta de Celular Desbloqueado y botón gigante para pasar al celular */}
      <div className="mx-5 my-auto py-8 px-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-center space-y-4 z-10">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <Unlock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/60">
            Recreo Activo • Celular Libre
          </span>
          <h2 className="text-2xl font-black text-white mt-2">
            ¡Tu celular está desbloqueado!
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Podés usar WhatsApp, YouTube, tus juegos reales o cualquier aplicación instalada en tu teléfono.
          </p>
        </div>

        {/* Contador regresivo grande */}
        <div className="py-3 px-4 rounded-2xl bg-black/40 border border-white/10 inline-flex items-center gap-3">
          <Clock className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Tiempo Libre Restante</span>
            <span className="text-2xl font-mono font-black text-emerald-300">{timeFormatted}</span>
          </div>
        </div>

        {/* BOTÓN GIGANTE: SALIR AL CELULAR / MINIMIZAR APP */}
        <div className="pt-2">
          <button
            id="exit-to-phone-home-btn"
            type="button"
            onClick={() => {
              triggerAndroidUnlock();
            }}
            className="w-full py-4 px-6 rounded-2xl font-black text-base bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/40 border-2 border-emerald-300 cursor-pointer transition-all animate-bounce"
          >
            <span className="text-xl">📱</span>
            <span>IR AL CELULAR (MINIMIZAR APP)</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2">
            Tocá aquí para ir a tus aplicaciones normales de Android.
          </p>
        </div>
      </div>

      {/* Acciones secundarias en la parte inferior */}
      <div className="px-6 pb-6 z-10 space-y-2.5">
        <button
          type="button"
          onClick={onLockAgain}
          className="w-full py-3 px-4 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/30 transition-all cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>Volver a bloquear el celular ahora</span>
        </button>

        <button
          type="button"
          onClick={onOpenAnotherChallenge}
          className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Hacer más actividades para sumar fin de semana</span>
        </button>
      </div>

      {/* Pie de navegación */}
      <div className="p-4 px-6 border-t border-white/10 bg-slate-950/80 backdrop-blur-md flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-2">
          <AvatarDisplay avatar={student.avatar} size="sm" />
          <span className="font-semibold text-slate-200">{student.name}</span>
        </div>

        <button
          type="button"
          onClick={onOpenParentPin}
          className="text-slate-400 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5"
        >
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>Padres</span>
        </button>
      </div>

      {/* Efectos de fondo */}
      <div className="absolute top-1/4 -right-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};
