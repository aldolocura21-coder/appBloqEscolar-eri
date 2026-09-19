import React from 'react';
import { UserStats, StudentProfile } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Award,
  Clock,
  Flame,
  Trophy,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Zap,
  Calendar,
  X,
  Smartphone,
} from 'lucide-react';

interface WeekendRewardsHubProps {
  stats: UserStats;
  student: StudentProfile;
  onClose: () => void;
  onUseWeekendMinutes?: (minutes: number) => void;
}

export const WeekendRewardsHub: React.FC<WeekendRewardsHubProps> = ({
  stats,
  student,
  onClose,
  onUseWeekendMinutes,
}) => {
  const hours = Math.floor(stats.weekendMinutesTotal / 60);
  const remainingMins = stats.weekendMinutesTotal % 60;

  // Sistema de ligas y niveles competitivos
  const getLeague = (pts: number) => {
    if (pts >= 600) return { name: 'Liga Diamante', color: 'text-cyan-600 bg-cyan-50 border-cyan-300', icon: '💎', nextThreshold: 1000 };
    if (pts >= 350) return { name: 'Liga Oro', color: 'text-amber-600 bg-amber-50 border-amber-300', icon: '🥇', nextThreshold: 600 };
    if (pts >= 150) return { name: 'Liga Plata', color: 'text-slate-600 bg-slate-50 border-slate-300', icon: '🥈', nextThreshold: 350 };
    return { name: 'Liga Bronce', color: 'text-amber-800 bg-amber-50 border-amber-400', icon: '🥉', nextThreshold: 150 };
  };

  const league = getLeague(stats.points);

  // Tabla de posiciones competitiva escolar de Argentina
  const leaderboard = [
    { rank: 1, name: 'Valentina R.', grade: '6° Grado', province: 'Córdoba', points: 740, weekendMins: 220, isCurrent: false },
    { rank: 2, name: `${student.name} (Vos)`, grade: student.grade, province: student.province, points: Math.max(stats.points, 520), weekendMins: stats.weekendMinutesTotal, isCurrent: true },
    { rank: 3, name: 'Joaquín M.', grade: '5° Grado', province: 'Santa Fe', points: 490, weekendMins: 160, isCurrent: false },
    { rank: 4, name: 'Camila B.', grade: '1° Año', province: 'Mendoza', points: 410, weekendMins: 135, isCurrent: false },
    { rank: 5, name: 'Lucas G.', grade: '4° Grado', province: 'Buenos Aires', points: 380, weekendMins: 110, isCurrent: false },
  ].sort((a, b) => b.points - a.points);

  return (
    <div id="weekend-rewards-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Cabecera Premios de Fin de Semana */}
        <div className="bg-linear-to-r from-sky-600 via-indigo-700 to-purple-800 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold tracking-wider uppercase">
              Sistema Competitivo Escolar
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${league.color} bg-white/90`}>
              {league.icon} {league.name}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            Bolsa de Recompensas de Fin de Semana
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            Cuantos más desafíos curriculares y familiares resolvés, más tiempo de celular tenés el sábado y domingo.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Tarjeta de tiempo acumulado */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 p-5 rounded-2xl bg-linear-to-br from-sky-50 to-indigo-50 border border-sky-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  Tiempo Desbloqueado para Sábado y Domingo
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    {hours > 0 ? `${hours}h ${remainingMins}m` : `${stats.weekendMinutesTotal} min`}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    +{stats.weekendMinutesTotal} min libres
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Ganados completando ejercicios escolares y retos en familia.
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                <Smartphone className="w-7 h-7 text-amber-300" />
                <span className="text-[10px] font-bold mt-0.5">Celular</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Puntaje Total
                </span>
                <p className="text-3xl font-black text-amber-950 mt-1">{stats.points} XP</p>
              </div>
              <p className="text-[11px] text-amber-800 font-medium mt-2">
                Racha actual: {stats.currentStreakDays} días activos
              </p>
            </div>
          </div>

          {/* Tabla de clasificación escolar de Argentina */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Ranking Escolar Semanal (Argentina)</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Se reinicia cada lunes</span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {leaderboard.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 px-4 flex items-center justify-between text-xs transition-colors ${
                    item.isCurrent
                      ? 'bg-sky-50/80 font-bold border-l-4 border-l-sky-600'
                      : 'bg-white hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] ${
                        index === 0
                          ? 'bg-amber-400 text-slate-950'
                          : index === 1
                          ? 'bg-slate-300 text-slate-800'
                          : index === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-slate-900 text-sm">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.grade} • {item.province}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-900">{item.points} pts</span>
                    <span className="text-[11px] text-sky-700 block font-semibold">
                      {item.weekendMins} min finde
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historial de actividades recientes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Registro de Desafíos Realizados
            </h3>
            {stats.history.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                Aún no completaste ningún desafío hoy. ¡Hacé el primero para empezar a acumular minutos de fin de semana!
              </p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {stats.history.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800">{log.title}</p>
                        <p className="text-[10px] text-slate-500">
                          {log.neededAdultHelp
                            ? 'Resuelto con ayuda de un adulto'
                            : 'Resuelto en primer intento'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-bold text-sky-700">
                      +{log.minutesEarned} min • +{log.pointsEarned} pts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de cierre */}
          <div className="pt-2 text-center">
            <button
              id="close-weekend-hub-btn"
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Volver a la Pantalla de Bloqueo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
