import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ActivityQuestion,
  StudentProfile,
  SubjectId,
  ActivityCategory,
} from '../types';
import { EDUCATIONAL_ACTIVITIES } from '../data/activities';
import {
  Clock,
  HelpCircle,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  AlertTriangle,
  RotateCcw,
  Check,
  ShieldAlert,
} from 'lucide-react';

interface ActivityRunnerProps {
  student: StudentProfile;
  initialMinutes?: number; // 15 o 20
  onComplete: (earnedPoints: number, earnedMinutes: number, neededHelp: boolean) => void;
  onCancel: () => void;
}

export const ActivityRunner: React.FC<ActivityRunnerProps> = ({
  student,
  initialMinutes = 15,
  onComplete,
  onCancel,
}) => {
  // Filtrar actividades según nivel del estudiante (primaria o secundaria)
  const availableQuestions = EDUCATIONAL_ACTIVITIES.filter(
    (q) => q.level === student.level
  );

  const [questionIndex, setQuestionIndex] = useState<number>(() =>
    Math.floor(Math.random() * availableQuestions.length)
  );

  const currentQuestion = availableQuestions[questionIndex] || availableQuestions[0];

  // Temporizador de 15 a 20 minutos (en segundos)
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [timerActive, setTimerActive] = useState(true);

  // Estados de respuesta
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasFailedFirstAttempt, setHasFailedFirstAttempt] = useState(false);
  const [failedOptionIndex, setFailedOptionIndex] = useState<number | null>(null);
  const [showAdultHelpModal, setShowAdultHelpModal] = useState(false);
  const [adultAssisted, setAdultAssisted] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || secondsLeft <= 0 || isResolved) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, secondsLeft, isResolved]);

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  // Manejo de selección de respuesta
  const handleSelectOption = (idx: number) => {
    if (isResolved || (hasFailedFirstAttempt && !adultAssisted)) return;
    if (idx === failedOptionIndex) return; // Ya se equivocó acá
    setSelectedIndex(idx);
  };

  const handleValidateAnswer = () => {
    if (selectedIndex === null) return;

    if (selectedIndex === currentQuestion.correctIndex) {
      // Correcto
      setIsSuccess(true);
      setIsResolved(true);
      setTimerActive(false);

      // Tirar papelitos de festejo
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#fbbf24', '#34d399', '#6366f1'],
        });
      } catch (e) {
        // Fallback silencioso si canvas-confetti tiene restricción
      }
    } else {
      // Incorrecto: Se activa la SEGUNDA OPCIÓN CON AYUDA DE UN ADULTO
      setFailedOptionIndex(selectedIndex);
      setHasFailedFirstAttempt(true);
      setAdultAssisted(false);
      setShowAdultHelpModal(true);
      setSelectedIndex(null);
    }
  };

  const handleAdultAssistanceConfirmed = () => {
    setAdultAssisted(true);
    setShowAdultHelpModal(false);
  };

  const handleFinishAndReward = () => {
    onComplete(
      currentQuestion.pointsReward,
      currentQuestion.weekendMinutesReward,
      adultAssisted
    );
  };

  const handleChangeQuestion = () => {
    const nextIdx = (questionIndex + 1) % availableQuestions.length;
    setQuestionIndex(nextIdx);
    setSelectedIndex(null);
    setHasFailedFirstAttempt(false);
    setFailedOptionIndex(null);
    setAdultAssisted(false);
    setShowAdultHelpModal(false);
    setIsResolved(false);
    setIsSuccess(false);
  };

  return (
    <div id="activity-runner-container" className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
      {/* Barra superior con cronómetro de 15-20 min */}
      <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
              {currentQuestion.category === 'curricular' ? 'Curricular' : 'Extracurricular'} • {currentQuestion.subjectLabel}
            </span>
            <h3 className="text-sm font-bold text-white line-clamp-1">{currentQuestion.title}</h3>
          </div>
        </div>

        {/* Cronómetro regresivo */}
        <div className="flex items-center gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700">
          <Clock className={`w-4 h-4 ${secondsLeft < 180 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
          <div className="text-right">
            <span className="text-xs text-slate-400 block -mb-1">Tiempo Restante</span>
            <span className={`text-sm font-mono font-bold ${secondsLeft < 180 ? 'text-rose-400' : 'text-white'}`}>
              {formatMinutes(secondsLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de progreso de tiempo de 15 a 20 min */}
      <div className="w-full bg-slate-200 h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            secondsLeft < 180 ? 'bg-rose-500' : 'bg-sky-500'
          }`}
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>

      {/* Contenido principal del ejercicio */}
      <div className="p-6 space-y-6">
        {/* Contexto didáctico */}
        {currentQuestion.context && (
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-sky-950 text-sm leading-relaxed">
            <span className="font-semibold text-sky-800 block text-xs uppercase mb-1">
              Situación de Aprendizaje
            </span>
            {currentQuestion.context}
          </div>
        )}

        {/* Pregunta o Desafío */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQuestion.prompt}
          </h2>
        </div>

        {/* Alerta de segunda oportunidad si falló en el 1er intento */}
        {hasFailedFirstAttempt && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Segunda Oportunidad con Adulto
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  {adultAssisted
                    ? '¡Excelente! Un adulto te brindó la pista. Ahora podés elegir la opción correcta.'
                    : 'Te equivocaste en el primer intento. Es obligatorio consultar con un adulto para habilitar la segunda opción.'}
                </p>
              </div>
            </div>
            {!adultAssisted && (
              <button
                id="open-adult-help-btn"
                type="button"
                onClick={() => setShowAdultHelpModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                Ver Pista de Adulto
              </button>
            )}
          </div>
        )}

        {/* Opciones de respuesta */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isFailed = failedOptionIndex === idx;
            const isCorrectAndResolved = isResolved && idx === currentQuestion.correctIndex;

            return (
              <button
                key={idx}
                type="button"
                disabled={isResolved || isFailed || (hasFailedFirstAttempt && !adultAssisted)}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${
                  isFailed
                    ? 'border-rose-300 bg-rose-50 text-rose-800 opacity-60 cursor-not-allowed line-through'
                    : isCorrectAndResolved
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-500/30'
                    : isSelected
                    ? 'border-sky-600 bg-sky-50 text-sky-950 font-semibold shadow-xs ring-2 ring-sky-500/20'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-sky-600 text-white'
                        : isFailed
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isSelected && !isResolved && (
                  <Check className="w-5 h-5 text-sky-600 shrink-0" />
                )}
                {isFailed && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
                {isCorrectAndResolved && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Mensaje de resolución y explicación */}
        {isResolved && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-sm">¡Desafío Resuelto Correctamente!</h4>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {currentQuestion.pedagogicalExplanation}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-emerald-950">
              <span className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                +{currentQuestion.pointsReward} Puntos de experiencia
              </span>
              <span className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-300">
                <Award className="w-3.5 h-3.5 text-sky-600" />
                +{currentQuestion.weekendMinutesReward} Minutos para el Fin de Semana
              </span>
            </div>
          </div>
        )}

        {/* Botones de acción inferiores */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleChangeQuestion}
              disabled={isResolved}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cambiar pregunta</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-rose-600 py-2 px-3 rounded-lg hover:bg-rose-50 transition-colors"
            >
              Cancelar y volver
            </button>
          </div>

          {!isResolved ? (
            <button
              id="validate-answer-btn"
              type="button"
              disabled={selectedIndex === null || (hasFailedFirstAttempt && !adultAssisted)}
              onClick={handleValidateAnswer}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                selectedIndex !== null && (!hasFailedFirstAttempt || adultAssisted)
                  ? 'bg-sky-600 hover:bg-sky-700 text-white cursor-pointer shadow-sky-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Validar Respuesta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="finish-reward-btn"
              type="button"
              onClick={handleFinishAndReward}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all animate-bounce"
            >
              <span>¡Canjear Minutos y Desbloquear Celular!</span>
              <Award className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modal Obligatorio: Segunda Opción con Ayuda de un Adulto */}
      {showAdultHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                <Users className="w-7 h-7 text-amber-700" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Segunda Oportunidad • Ayuda de un Adulto
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                ¡Pedile una mano a un adulto!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Para desbloquear tu segunda oportunidad, un adulto (mamá, papá o tutor) debe leer esta guía didáctica con vos y ayudarte a razonar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>Pista Pedagógica para el Adulto</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                "{currentQuestion.adultHint}"
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Regla de Aprendizaje:</strong> El adulto no debe decir la respuesta directa, sino orientar al estudiante para que descubra la solución por sí mismo.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                id="adult-confirm-assistance-btn"
                type="button"
                onClick={handleAdultAssistanceConfirmed}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Un adulto me ayudó a entenderlo (Habilitar 2° intento)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAdultHelpModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 py-1.5 text-center font-medium"
              >
                Cerrar por ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
