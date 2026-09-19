import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { FamilyChallenge } from '../types';
import { FAMILY_CHALLENGES } from '../data/activities';
import {
  Users,
  Heart,
  Clock,
  Award,
  Sparkles,
  CheckCircle2,
  X,
  MessageCircle,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface FamilyChallengeModalProps {
  onComplete: (earnedPoints: number, earnedMinutes: number) => void;
  onClose: () => void;
}

export const FamilyChallengeModal: React.FC<FamilyChallengeModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<FamilyChallenge>(
    FAMILY_CHALLENGES[0]
  );
  const [reflectionAnswer, setReflectionAnswer] = useState('');
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleFinish = () => {
    if (!adultConfirmed) return;
    setIsFinished(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#ec4899', '#38bdf8', '#10b981'],
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      onComplete(selectedChallenge.rewardPoints, selectedChallenge.rewardMinutes);
    }, 1200);
  };

  return (
    <div id="family-challenge-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Cabecera temática familiar */}
        <div className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wider uppercase">
              Día por medio • Interacción Familiar
            </span>
            <span className="flex items-center gap-1 text-[11px] bg-amber-900/30 px-2 py-0.5 rounded-full text-amber-100 border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Premio Doble
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <span>Reto en Familia con un Adulto</span>
            <Heart className="w-5 h-5 text-rose-200 fill-rose-200" />
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1">
            Una actividad compartida para fortalecer el vínculo familiar, desconectar de las pantallas y ganar minutos extra de fin de semana.
          </p>
        </div>

        {/* Selector de Retos */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Elegir Reto Familiar de Hoy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FAMILY_CHALLENGES.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setSelectedChallenge(ch);
                    setAdultConfirmed(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedChallenge.id === ch.id
                      ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-2 ring-orange-400/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-[10px] font-semibold text-orange-600 block mb-0.5">
                    {ch.tag}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{ch.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {ch.durationMinutes} min
                    </span>
                    <span className="font-semibold text-amber-600">
                      +{ch.rewardMinutes} min finde
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta del reto seleccionado con roles */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{selectedChallenge.title}</h3>
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                  +{selectedChallenge.rewardPoints} pts
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedChallenge.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-sky-700 block mb-1">
                  Rol del Estudiante
                </span>
                <p className="text-xs text-slate-700 leading-snug">
                  {selectedChallenge.studentRole}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-orange-700 block mb-1">
                  Rol del Adulto (Mamá, Papá, Tutor)
                </span>
                <p className="text-xs text-slate-700 leading-snug">
                  {selectedChallenge.adultRole}
                </p>
              </div>
            </div>

            {/* Pregunta para reflexionar juntos */}
            <div className="p-3 rounded-xl bg-orange-100/50 border border-orange-200 text-xs">
              <span className="font-bold text-orange-900 block mb-0.5">
                Para responder juntos al terminar:
              </span>
              <p className="text-orange-950 font-medium mb-2">
                "{selectedChallenge.reflectionQuestion}"
              </p>
              <input
                type="text"
                value={reflectionAnswer}
                onChange={(e) => setReflectionAnswer(e.target.value)}
                placeholder="Escriban acá una breve conclusión familiar (opcional)..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-orange-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Confirmación del adulto */}
          <div
            onClick={() => setAdultConfirmed(!adultConfirmed)}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
              adultConfirmed
                ? 'border-emerald-500 bg-emerald-50/60'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Validación del Adulto Responsable
                </p>
                <p className="text-[11px] text-slate-600">
                  Confirmo que realizamos juntos la actividad familiar propuesta.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={adultConfirmed}
              onChange={() => {}}
              className="w-5 h-5 text-emerald-600 rounded border-slate-300 cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Botón de finalización */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 px-3"
            >
              Hacer más tarde
            </button>

            <button
              id="confirm-family-challenge-btn"
              type="button"
              disabled={!adultConfirmed || isFinished}
              onClick={handleFinish}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all ${
                adultConfirmed && !isFinished
                  ? 'bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white cursor-pointer shadow-orange-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isFinished ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>¡Reto Registrado con Éxito!</span>
                </>
              ) : (
                <>
                  <span>¡Validar y Sumar +{selectedChallenge.rewardMinutes} min de Finde!</span>
                  <Award className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
