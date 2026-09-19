import React, { useState, useEffect } from 'react';
import { StudentProfile, UserStats } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
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
    <div id="phone-unlocked-screen" className="w-full max-w-md mx-auto rounded-[40px] bg-linear-to-b from-sky-900 via-slate-900 to-indigo-950 text-white shadow-2xl border-8 border-slate-900 overflow-hidden relative min-h-[720px] flex flex-col justify-between select-none">
      {/* Barra superior del celular */}
      <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-slate-300 font-medium z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-white tracking-wider">16:45</span>
          <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/50 flex items-center gap-1">
            <Unlock className="w-2.5 h-2.5" /> Desbloqueado
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

      {/* Cuadrícula de Apps Simula el escritorio de un smartphone */}
      <div className="p-6 z-10">
        <p className="text-xs text-slate-300 mb-4 font-semibold uppercase tracking-wider text-center">
          Aplicaciones Habilitadas por Esfuerzo Escolar
        </p>

        <div className="grid grid-cols-3 gap-5">
          {apps.map((app, i) => {
            const Icon = app.icon;
            return (
              <div
                key={i}
                onClick={() => {
                  alert(
                    `¡App "${app.name}" abierta exitosamente! Podés disfrutar mientras tengas minutos disponibles.`
                  );
                }}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-200 group-hover:text-white text-center">
                  {app.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banner de Bolsa de Fin de semana y botón para seguir sumando */}
      <div className="px-6 py-2 z-10 space-y-2">
        <div
          onClick={onOpenWeekendHub}
          className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:bg-amber-500/20 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-amber-300">
                Bolsa Fin de Semana: {stats.weekendMinutesTotal} min
              </span>
              <p className="text-[10px] text-slate-300">
                ¡Acumulá más tiempo para jugar sin límites el finde!
              </p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        <button
          type="button"
          onClick={onOpenAnotherChallenge}
          className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Hacer otro desafío escolar (+minutos)</span>
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
