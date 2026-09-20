import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ActivityQuestion,
  StudentProfile,
  SubjectId,
  ActivityCategory,
} from '../types';
import { EDUCATIONAL_ACTIVITIES } from '../data/activities';
import { triggerAndroidUnlock } from '../services/nativeBridge';
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
  Smartphone,
  ChevronRight,
  Zap,
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

  // Meta de actividades: mínimo 5, máximo 10 (por defecto 5)
  const [targetCount, setTargetCount] = useState<number>(5);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Historial de preguntas usadas en la sesión para no repetir
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);

  // Selección aleatoria inicial
  const getNextQuestion = (excludeIds: string[] = []): ActivityQuestion => {
    const unpicked = availableQuestions.filter((q) => !excludeIds.includes(q.id));
    const pool = unpicked.length > 0 ? unpicked : availableQuestions;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex] || availableQuestions[0];
  };

  const [currentQuestion, setCurrentQuestion] = useState<ActivityQuestion>(() => {
    const q = getNextQuestion([]);
    return q;
  });

  // Temporizador de sesión
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [timerActive, setTimerActive] = useState(true);

  // Puntos y minutos acumulados en la ronda
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);
  const [accumulatedWeekendMinutes, setAccumulatedWeekendMinutes] = useState(0);
  const [hadAnyHelp, setHadAnyHelp] = useState(false);

  // Estados de la pregunta actual
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasFailedFirstAttempt, setHasFailedFirstAttempt] = useState(false);
  const [failedOptionIndex, setFailedOptionIndex] = useState<number | null>(null);
  const [showAdultHelpModal, setShowAdultHelpModal] = useState(false);
  const [adultAssisted, setAdultAssisted] = useState(false);
  const [isCurrentQuestionResolved, setIsCurrentQuestionResolved] = useState(false);

  // Estado final de la ronda completa (5 a 10 resueltas)
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const hasTriggeredUnlockRef = useRef(false);

  // Timer regresivo general
  useEffect(() => {
    if (!timerActive || secondsLeft <= 0 || isAllCompleted) return;
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
  }, [timerActive, secondsLeft, isAllCompleted]);

  // Cuenta regresiva para pasar a segundo plano automáticamente al completar todas las actividades
  useEffect(() => {
    if (!isAllCompleted) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !hasTriggeredUnlockRef.current) {
      hasTriggeredUnlockRef.current = true;
      handleFinishAndExit();
    }
  }, [isAllCompleted, countdown]);

  const formatMinutes = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  // Selección de respuesta
  const handleSelectOption = (idx: number) => {
    if (isCurrentQuestionResolved || (hasFailedFirstAttempt && !adultAssisted)) return;
    if (idx === failedOptionIndex) return;
    setSelectedIndex(idx);
  };

  // Validación de respuesta
  const handleValidateAnswer = () => {
    if (selectedIndex === null) return;

    if (selectedIndex === currentQuestion.correctIndex) {
      // Respuesta correcta
      setIsCurrentQuestionResolved(true);
      const points = currentQuestion.pointsReward;
      const weekendMin = currentQuestion.weekendMinutesReward;

      setAccumulatedPoints((prev) => prev + points);
      setAccumulatedWeekendMinutes((prev) => prev + weekendMin);
      if (adultAssisted) setHadAnyHelp(true);

      const nextUsed = [...usedQuestionIds, currentQuestion.id];
      setUsedQuestionIds(nextUsed);

      // Si alcanzó la meta (ej. 5 de 5)
      if (currentStep >= targetCount) {
        setIsAllCompleted(true);
        setTimerActive(false);
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#fbbf24', '#34d399', '#6366f1', '#f43f5e'],
          });
        } catch (e) {}
      } else {
        // Confetti sutil por cada acierto
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 },
          });
        } catch (e) {}
      }
    } else {
      // Respuesta incorrecta: requiere ayuda de adulto para 2do intento
      setFailedOptionIndex(selectedIndex);
      setHasFailedFirstAttempt(true);
      setAdultAssisted(false);
      setShowAdultHelpModal(true);
      setSelectedIndex(null);
    }
  };

  // Avanzar a la siguiente pregunta dentro de la ronda
  const handleNextStep = () => {
    const nextStepNum = currentStep + 1;
    setCurrentStep(nextStepNum);
    const nextQ = getNextQuestion(usedQuestionIds);
    setCurrentQuestion(nextQ);
    setSelectedIndex(null);
    setHasFailedFirstAttempt(false);
    setFailedOptionIndex(null);
    setAdultAssisted(false);
    setShowAdultHelpModal(false);
    setIsCurrentQuestionResolved(false);
  };

  // Finalizar y pasar inmediatamente al celular
  const handleFinishAndExit = () => {
    // 1. Notificar a React el desbloqueo y sumar puntos
    onComplete(accumulatedPoints, accumulatedWeekendMinutes, hadAnyHelp);

    // 2. Disparar el desbloqueo nativo en Android (minimizar y pasar a segundo plano)
    triggerAndroidUnlock();
  };

  const handleAdultAssistanceConfirmed = () => {
    setAdultAssisted(true);
    setShowAdultHelpModal(false);
  };

  return (
    <div
      id="activity-runner-container"
      className="w-full min-h-screen sm:min-h-0 sm:max-w-2xl mx-auto bg-white sm:rounded-3xl border-0 sm:border border-slate-200 shadow-xl overflow-hidden relative flex flex-col justify-between"
    >
      {/* Barra superior con cronómetro y barra de progreso */}
      <div className="bg-slate-900 text-white p-4 px-6 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
                  {currentQuestion.category === 'curricular' ? 'Curricular' : 'Extracurricular'} • {currentQuestion.subjectLabel}
                </span>
                <span className="text-[10px] bg-sky-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                  Actividad {currentStep} de {targetCount}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1">{currentQuestion.title}</h3>
            </div>
          </div>

          {/* Cronómetro regresivo */}
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
            <Clock className={`w-4 h-4 ${secondsLeft < 180 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={`text-sm font-mono font-bold ${secondsLeft < 180 ? 'text-rose-400' : 'text-white'}`}>
              {formatMinutes(secondsLeft)}
            </span>
          </div>
        </div>

        {/* Barra de progreso de actividades completadas */}
        <div className="mt-3 flex items-center gap-1.5">
          {Array.from({ length: targetCount }).map((_, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep || (stepNum === currentStep && isCurrentQuestionResolved);
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-400 shadow-xs shadow-emerald-400/50'
                    : isCurrent
                    ? 'bg-sky-400 animate-pulse'
                    : 'bg-slate-700'
                }`}
                title={`Paso ${stepNum} de ${targetCount}`}
              />
            );
          })}
        </div>
      </div>

      {/* Selector de Meta (solo antes de resolver la 1ra pregunta) */}
      {currentStep === 1 && !isCurrentQuestionResolved && (
        <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Meta para desbloquear:</span>
          <div className="flex items-center gap-1.5">
            {[5, 7, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setTargetCount(num)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  targetCount === num
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {num} {num === 5 ? '(Mínimo)' : num === 10 ? '(Máximo)' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="p-6 space-y-6">
        {/* PANTALLA DE VICTORIA TOTAL: META DE 5 A 10 ACTIVIDADES CUMPLIDA */}
        {isAllCompleted ? (
          <div className="p-6 rounded-3xl bg-linear-to-b from-emerald-500 to-emerald-700 text-white space-y-5 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="w-16 h-16 rounded-3xl bg-white/20 text-white flex items-center justify-center mx-auto shadow-inner border border-white/30">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 bg-black/20 px-3 py-1 rounded-full border border-white/20">
                ¡Objetivo Escolar Logrado!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                ¡{targetCount} de {targetCount} Actividades Completadas!
              </h2>
              <p className="text-sm text-emerald-100 mt-1 max-w-md mx-auto">
                Has cumplido con tu tiempo de estudio. Tu celular ya está desbloqueado para usar normalmente.
              </p>
            </div>

            {/* Tarjeta de Recompensas */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
              <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-[10px] text-emerald-200 uppercase font-semibold">Puntos</span>
                </div>
                <p className="text-xl font-black text-white mt-0.5">+{accumulatedPoints} pts</p>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span className="text-[10px] text-emerald-200 uppercase font-semibold">Fin de semana</span>
                </div>
                <p className="text-xl font-black text-white mt-0.5">+{accumulatedWeekendMinutes} min</p>
              </div>
            </div>

            {/* AVISO DE PASO A SEGUNDO PLANO AUTOMÁTICO */}
            <div className="bg-black/30 p-4 rounded-2xl border border-white/20 max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm animate-pulse">
                <Smartphone className="w-5 h-5" />
                <span>Pasando al celular en segundo plano en {countdown} segundos...</span>
              </div>
              <p className="text-xs text-emerald-100">
                La aplicación se minimizará sola para que uses tus juegos, WhatsApp o YouTube.
              </p>
            </div>

            {/* BOTÓN GIGANTE PARA SALIR AL INSTANTE */}
            <button
              id="instant-exit-to-phone-btn"
              type="button"
              onClick={handleFinishAndExit}
              className="w-full max-w-md mx-auto py-4 px-6 rounded-2xl font-black text-lg bg-white text-emerald-800 hover:bg-emerald-50 active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl cursor-pointer transition-all border-2 border-emerald-300"
            >
              <span className="text-2xl">📱</span>
              <span>IR AL CELULAR LIBRE YA</span>
            </button>
          </div>
        ) : (
          <>
            {/* Contexto didáctico */}
            {currentQuestion.context && (
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 text-sky-950 text-sm leading-relaxed">
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
                        ? '¡Excelente! El adulto brindó la ayuda. Ahora podés marcar la opción correcta.'
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
                const isCorrectAndResolved =
                  isCurrentQuestionResolved && idx === currentQuestion.correctIndex;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={
                      isCurrentQuestionResolved ||
                      isFailed ||
                      (hasFailedFirstAttempt && !adultAssisted)
                    }
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

                    {isSelected && !isCurrentQuestionResolved && (
                      <Check className="w-5 h-5 text-sky-600 shrink-0" />
                    )}
                    {isFailed && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                    {isCorrectAndResolved && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mensaje didáctico al acertar pregunta intermedia */}
            {isCurrentQuestionResolved && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-sm">
                      ¡Actividad {currentStep} de {targetCount} Correcta!
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    +{currentQuestion.pointsReward} pts
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {currentQuestion.pedagogicalExplanation}
                </p>
              </div>
            )}

            {/* Botones de acción inferiores */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-rose-600 py-2 px-3 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Cancelar y salir
              </button>

              {!isCurrentQuestionResolved ? (
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
                  id="next-step-activity-btn"
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Siguiente Actividad ({currentStep + 1} de {targetCount})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal Obligatorio: Ayuda de un Adulto para 2da Oportunidad */}
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
                ¡Consultá con un adulto!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Para desbloquear tu segunda oportunidad, un adulto (mamá, papá o tutor) debe leer esta guía didáctica con vos.
              </p>
            </div>

            {/* Pista Pedagógica para el Adulto */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase block">
                Pista Didáctica para el Tutor:
              </span>
              <p className="text-xs text-amber-950 leading-relaxed">
                {currentQuestion.adultHint}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdultHelpModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Revisar solo
              </button>
              <button
                id="confirm-adult-help-btn"
                type="button"
                onClick={handleAdultAssistanceConfirmed}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Adulto Presente: Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
