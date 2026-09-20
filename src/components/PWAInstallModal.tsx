import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  HelpCircle,
  X,
  AlertTriangle,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href.split('?')[0];

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      // fallback
    }
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div
      id="pwa-install-modal"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Encabezado */}
        <div className="bg-sky-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white border border-white/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-sky-200">
                Instalación en Celular
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                Instalar BloqEscolar en Android
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-slate-800 text-sm max-h-[80vh] overflow-y-auto">
          {/* Instrucción directa para la captura del usuario */}
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500/60 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wide">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs">
                ✓
              </span>
              <span>Solución inmediata en tu pantalla</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              En el menú de Chrome, cuando te aparece el cartel de <em>"Instalar y crear acceso directo"</em>:
            </p>
            <div className="p-3 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 space-y-1">
              <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                <span>👉 Tocá:</span>
                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                  Crear acceso directo
                </span>
              </p>
              <p className="text-[11px] text-slate-600">
                (Es la opción que tiene el circulito de colores de Chrome con la flecha <strong>&gt;</strong>).
              </p>
            </div>
            <p className="text-[11px] text-emerald-800">
              Al tocar <strong>"Crear acceso directo"</strong> y luego <strong>"Agregar"</strong>, el ícono de <strong>BloqEscolar</strong> queda colocado en la pantalla de inicio de tu celular al instante.
            </p>
          </div>

          {/* Explicación del Error "Página no encontrada" */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>¿Por qué te apareció "Página no encontrada"?</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              El enlace previo era de pre-publicación y aún no estaba activo en el servidor. 
              Para abrir la aplicación real en el celular del estudiante, debés usar el <strong>enlace actual que está corriendo ahora mismo</strong>.
            </p>
          </div>

          {/* Enlace correcto para copiar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              1. Enlace actual de la App para abrir en el celular
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 truncate"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Podés enviarte este enlace por WhatsApp a tu propio número o al celular del chico.
            </p>
          </div>

          {/* Botón de instalación nativa si el navegador lo soporta directamente */}
          {isInstallable && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-2">
              <p className="text-xs font-semibold text-sky-900">
                Tu navegador permite instalación directa con un toque:
              </p>
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Instalar BloqEscolar Ahora</span>
              </button>
            </div>
          )}

          {/* Pasos en Google Chrome de Android */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Pasos exactos en Google Chrome (Android)</span>
            </h4>

            <ol className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  Abrí <strong>Google Chrome</strong> en el celular y pegá el enlace copiado arriba.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  Tocá los <strong>tres puntos verticales (⋮)</strong> en la esquina superior derecha de Chrome.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  Tocá en <strong>"Instalar aplicación"</strong> (o <strong>"Agregar a la pantalla principal"</strong>).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  4
                </span>
                <span>
                  Aparecerá el ícono de <strong>BloqEscolar Argentina</strong> en la pantalla del celular como cualquier otra app.
                </span>
              </li>
            </ol>
          </div>

          {/* Alternativa: Publicar o Compartir desde AI Studio */}
          <div className="p-3.5 rounded-2xl bg-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">
              💡 Para que cualquier persona pueda entrar con un link permanente:
            </p>
            <p>
              En la barra superior de <strong>Google AI Studio</strong> (arriba a la derecha en la computadora), hacé clic en el botón <strong>"Share" (Compartir)</strong> o <strong>"Deploy"</strong>. Eso publica la versión definitiva en internet.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
