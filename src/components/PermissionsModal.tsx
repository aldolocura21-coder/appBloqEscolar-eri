import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { AppPermissions } from '../types';

interface PermissionsModalProps {
  permissions: AppPermissions;
  onAccept: (updated: AppPermissions) => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ permissions, onAccept }) => {
  const [overlay, setOverlay] = useState(permissions.overlayPermission);
  const [accessibility, setAccessibility] = useState(permissions.accessibilityPermission);
  const [usageStats, setUsageStats] = useState(permissions.usageStatsPermission);
  const [privacyAgreed, setPrivacyAgreed] = useState(permissions.privacyAccepted);
  const [showLegalDetails, setShowLegalDetails] = useState(false);

  const allSelected = overlay && accessibility && usageStats && privacyAgreed;

  const handleConfirm = () => {
    if (!allSelected) return;
    onAccept({
      overlayPermission: overlay,
      accessibilityPermission: accessibility,
      usageStatsPermission: usageStats,
      privacyAccepted: privacyAgreed,
      acceptedAt: new Date().toISOString(),
    });
  };

  const handleGrantAll = () => {
    setOverlay(true);
    setAccessibility(true);
    setUsageStats(true);
    setPrivacyAgreed(true);
  };

  return (
    <div id="permissions-modal-overlay" className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div id="permissions-container" className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Encabezado con bandera y escudo de protección */}
        <div className="bg-linear-to-r from-sky-600 via-sky-700 to-indigo-800 p-6 text-white text-center relative">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner border border-white/20">
            <ShieldCheck className="w-9 h-9 text-amber-300" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold tracking-wide uppercase mb-1">
            BloqEscolar Argentina
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Permisos de Bloqueo y Resguardo de Datos
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-md mx-auto">
            Configuración segura de control parental para menores de edad en edad escolar.
          </p>
        </div>

        {/* Cuerpo con los permisos requeridos */}
        <div className="p-6 space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Resguardo de datos sensibles garantizado</p>
              <p className="text-sky-800 leading-relaxed">
                Cumple con la Ley 25.326 de Protección de Datos Personales de la República Argentina y la Convención sobre los Derechos del Niño. La información nunca se comercializa ni se comparte con terceros.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {/* Permiso 1: Superposición de pantalla */}
            <div
              id="perm-overlay"
              onClick={() => setOverlay(!overlay)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                overlay
                  ? 'border-sky-500 bg-sky-50/50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-700 mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    Permiso de superposición (Bloqueo de Celular)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Permite desplegar la pantalla de candado escolar sobre juegos y redes durante las horas de estudio acordadas.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={overlay}
                onChange={() => {}}
                className="w-5 h-5 text-sky-600 rounded border-slate-300 mt-1 cursor-pointer accent-sky-600"
              />
            </div>

            {/* Permiso 2: Accesibilidad */}
            <div
              id="perm-accessibility"
              onClick={() => setAccessibility(!accessibility)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                accessibility
                  ? 'border-sky-500 bg-sky-50/50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    Servicio de control y accesibilidad
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Detecta el intento de abrir aplicaciones recreativas cuando aún no se completó la actividad curricular o no hay saldo de fin de semana.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={accessibility}
                onChange={() => {}}
                className="w-5 h-5 text-sky-600 rounded border-slate-300 mt-1 cursor-pointer accent-sky-600"
              />
            </div>

            {/* Permiso 3: Estadísticas de uso */}
            <div
              id="perm-usage"
              onClick={() => setUsageStats(!usageStats)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                usageStats
                  ? 'border-sky-500 bg-sky-50/50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    Medición de tiempo y premios de fin de semana
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Permite calcular los minutos ganados por resolver tareas escolares y sumarlos a la bolsa de tiempo de ocio del sábado y domingo.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={usageStats}
                onChange={() => {}}
                className="w-5 h-5 text-sky-600 rounded border-slate-300 mt-1 cursor-pointer accent-sky-600"
              />
            </div>

            {/* Aceptación de términos y condiciones */}
            <div
              id="perm-privacy"
              onClick={() => setPrivacyAgreed(!privacyAgreed)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                privacyAgreed
                  ? 'border-amber-500 bg-amber-50/40'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    Términos de uso y supervisión parental informada
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Acepto que el uso de la aplicación tiene fines pedagógicos, con mediación de un adulto responsable y resguardo seguro local de datos.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={() => {}}
                className="w-5 h-5 text-amber-600 rounded border-slate-300 mt-1 cursor-pointer accent-amber-600"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="toggle-legal-details-btn"
              type="button"
              onClick={() => setShowLegalDetails(!showLegalDetails)}
              className="text-xs text-sky-700 hover:text-sky-900 font-medium underline flex items-center gap-1 mx-auto"
            >
              {showLegalDetails ? 'Ocultar cláusula de privacidad' : 'Ver detalle legal de protección infantil (Ley 25.326)'}
            </button>
            {showLegalDetails && (
              <div className="mt-2 p-3 bg-slate-100 rounded-xl text-xs text-slate-600 space-y-1.5 border border-slate-200">
                <p>
                  <strong>Seguridad Infantil:</strong> BloqEscolar opera bajo consentimiento explícito del padre, madre o tutor legal. Los datos escolares, notas de actividades y avatares se almacenan localmente en el dispositivo.
                </p>
                <p>
                  <strong>Desbloqueo de emergencia:</strong> La app cuenta con botón de llamada de emergencia y desbloqueo parental inmediato mediante clave PIN de 4 dígitos.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <button
            id="grant-all-permissions-btn"
            type="button"
            onClick={handleGrantAll}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Marcar todos
          </button>
          <button
            id="confirm-permissions-btn"
            type="button"
            disabled={!allSelected}
            onClick={handleConfirm}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              allSelected
                ? 'bg-sky-600 hover:bg-sky-700 text-white cursor-pointer hover:shadow-md'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Aceptar y configurar Avatar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
