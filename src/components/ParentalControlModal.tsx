import React, { useState } from 'react';
import { ParentSettings, UserStats, StudentProfile } from '../types';
import {
  Shield,
  KeyRound,
  Unlock,
  Clock,
  Sliders,
  Check,
  X,
  AlertCircle,
  UserCheck,
  Smartphone,
  Calendar,
} from 'lucide-react';

interface ParentalControlModalProps {
  settings: ParentSettings;
  stats: UserStats;
  student: StudentProfile;
  onUpdateSettings: (newSettings: ParentSettings) => void;
  onEmergencyUnlock: (minutes: number) => void;
  onEditStudentProfile: () => void;
  onClose: () => void;
}

export const ParentalControlModal: React.FC<ParentalControlModalProps> = ({
  settings,
  stats,
  student,
  onUpdateSettings,
  onEmergencyUnlock,
  onEditStudentProfile,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [currentTimer, setCurrentTimer] = useState(settings.defaultTimerMinutes);
  const [strictMode, setStrictMode] = useState(settings.strictMode);
  const [newPin, setNewPin] = useState('');
  const [showPinChange, setShowPinChange] = useState(false);
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.parentPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSaveConfig = () => {
    onUpdateSettings({
      ...settings,
      defaultTimerMinutes: currentTimer,
      strictMode,
      parentPin: newPin.length === 4 ? newPin : settings.parentPin,
    });
    if (newPin.length === 4) {
      setPinChangeSuccess(true);
    }
  };

  return (
    <div id="parental-control-modal" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Cabecera de Control Parental */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
                Seguridad Familiar
              </span>
              <h3 className="text-lg font-bold text-white">Panel de Padres y Tutores</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Pantalla de autenticación con PIN de 4 dígitos */
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-700 mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Ingresar PIN de Seguridad</h4>
              <p className="text-xs text-slate-500">
                Solo accesible para adultos responsables. (PIN por defecto: 1234)
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <input
                  id="parent-pin-input"
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value.replace(/\D/g, ''));
                    setPinError(false);
                  }}
                  placeholder="• • • •"
                  className="w-48 mx-auto block text-center tracking-[1em] text-2xl font-bold py-3 px-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                />
                {pinError && (
                  <p className="text-xs text-rose-600 text-center font-medium mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>PIN incorrecto. Intente con 1234 o su clave personalizada.</span>
                  </p>
                )}
              </div>

              <button
                id="submit-parent-pin-btn"
                type="submit"
                disabled={pinInput.length < 4}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm transition-all cursor-pointer"
              >
                Acceder al Panel Parental
              </button>
            </form>
          </div>
        ) : (
          /* Panel de configuración parental desbloqueado */
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Desbloqueo de Emergencia Inmediato */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  Desbloqueo Inmediato de Emergencia
                </h4>
              </div>
              <p className="text-xs text-rose-700 leading-snug">
                ¿Necesitás que el menor use el celular urgentemente sin resolver actividades? Podés habilitar tiempo de emergencia ahora:
              </p>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onEmergencyUnlock(30)}
                  className="py-2 px-3 rounded-xl bg-white border border-rose-300 text-rose-900 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  +30 min
                </button>
                <button
                  type="button"
                  onClick={() => onEmergencyUnlock(60)}
                  className="py-2 px-3 rounded-xl bg-white border border-rose-300 text-rose-900 font-bold text-xs hover:bg-rose-100 transition-colors"
                >
                  +1 hora
                </button>
                <button
                  type="button"
                  onClick={() => onEmergencyUnlock(999)}
                  className="py-2 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-xs"
                >
                  Libre por hoy
                </button>
              </div>
            </div>

            {/* Ajuste del tiempo de resolución de desafíos (15 a 20 minutos) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>Duración del Temporizador de Actividad</span>
                </label>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  {currentTimer} minutos
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tiempo que tiene el estudiante para concentrarse y resolver la actividad antes de recibir su recompensa:
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentTimer(15)}
                  className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                    currentTimer === 15
                      ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  15 Minutos (Recomendado)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTimer(20)}
                  className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                    currentTimer === 20
                      ? 'border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  20 Minutos (Foco Intenso)
                </button>
              </div>
            </div>

            {/* Perfil del Estudiante */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500">Estudiante</span>
                <p className="font-bold text-slate-900 text-sm">{student.name} ({student.age} años)</p>
                <p className="text-xs text-slate-600">
                  {student.level === 'primaria' ? 'Primaria' : 'Secundaria'} • {student.grade}
                </p>
              </div>
              <button
                type="button"
                onClick={onEditStudentProfile}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Editar Perfil / Grado
              </button>
            </div>

            {/* Cambio de Clave PIN */}
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowPinChange(!showPinChange)}
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{showPinChange ? 'Cancelar cambio de PIN' : 'Modificar PIN de 4 dígitos'}</span>
              </button>

              {showPinChange && (
                <div className="p-3 bg-slate-100 rounded-xl space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Nuevo PIN de 4 dígitos
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Nuevo PIN"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm text-center font-bold"
                  />
                  {pinChangeSuccess && (
                    <p className="text-xs text-emerald-600 font-medium">
                      ¡PIN actualizado correctamente!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Guardar cambios y cerrar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Preferencias y Salir</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
