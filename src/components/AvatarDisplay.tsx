import React from 'react';
import { AvatarConfig } from '../types';
import { Glasses, Sparkles, Smile, GraduationCap, Headphones } from 'lucide-react';

interface AvatarDisplayProps {
  avatar: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatar,
  size = 'md',
  showBadge = false,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  }[size];

  const getOutfitBadge = () => {
    switch (avatar.outfit) {
      case 'guardapolvo':
        return { label: 'Guardapolvo Blanco', color: 'bg-white text-slate-800 border-slate-300' };
      case 'remera_celeste':
        return { label: 'Remera Celeste y Blanca', color: 'bg-sky-500 text-white border-sky-600' };
      case 'buzo_azul':
        return { label: 'Buzo Azul Marino', color: 'bg-blue-900 text-white border-blue-950' };
      case 'campera_escolar':
        return { label: 'Campera Escolar', color: 'bg-emerald-700 text-white border-emerald-800' };
    }
  };

  const outfit = getOutfitBadge();

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      <div
        className={`${sizeClasses} rounded-full flex items-center justify-center relative overflow-hidden border-4 shadow-md transition-all`}
        style={{
          backgroundColor: avatar.bgColor || '#e0f2fe',
          borderColor: '#ffffff',
        }}
      >
        {/* Cuerpo / Ropa en la parte inferior */}
        <div
          className="absolute -bottom-2 w-full h-2/5 rounded-t-2xl flex items-center justify-center shadow-inner"
          style={{
            backgroundColor:
              avatar.outfit === 'guardapolvo'
                ? '#f8fafc'
                : avatar.outfit === 'remera_celeste'
                ? '#38bdf8'
                : avatar.outfit === 'buzo_azul'
                ? '#1e3a8a'
                : '#047857',
          }}
        >
          {/* Si tiene escarapela en el pecho o guardapolvo */}
          {avatar.accessory === 'escarapela' && (
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-white flex items-center justify-center shadow-xs">
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
          )}
          {avatar.outfit === 'guardapolvo' && avatar.accessory !== 'escarapela' && (
            <div className="w-1 h-3 bg-slate-300 rounded-full"></div>
          )}
        </div>

        {/* Cabeza / Rostro */}
        <div
          className="w-3/5 h-3/5 rounded-full relative flex flex-col items-center justify-center -mt-1 shadow-xs"
          style={{ backgroundColor: avatar.skinTone || '#fcd34d' }}
        >
          {/* Cabello */}
          <div
            className="absolute -top-1.5 w-full h-2.5 rounded-t-full"
            style={{
              backgroundColor: avatar.hairColor || '#78350f',
              borderTopLeftRadius: avatar.hairStyle === 'rulos' ? '9999px' : '10px',
              borderTopRightRadius: avatar.hairStyle === 'rulos' ? '9999px' : '10px',
            }}
          >
            {avatar.hairStyle === 'rulos' && (
              <div className="flex justify-around -mt-1 px-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: avatar.hairColor }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: avatar.hairColor }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: avatar.hairColor }} />
              </div>
            )}
            {avatar.hairStyle === 'largo' && (
              <div
                className="absolute top-1 -left-1 w-1.5 h-5 rounded-b-md"
                style={{ backgroundColor: avatar.hairColor }}
              />
            )}
            {avatar.hairStyle === 'largo' && (
              <div
                className="absolute top-1 -right-1 w-1.5 h-5 rounded-b-md"
                style={{ backgroundColor: avatar.hairColor }}
              />
            )}
          </div>

          {/* Ojos */}
          <div className="flex gap-2 items-center justify-center z-10">
            <div className="w-1.5 h-2 bg-slate-900 rounded-full"></div>
            <div className="w-1.5 h-2 bg-slate-900 rounded-full"></div>
          </div>

          {/* Anteojos */}
          {avatar.accessory === 'anteojos' && (
            <div className="absolute inset-x-1 top-2.5 flex items-center justify-center gap-1 z-20">
              <div className="w-3 h-2.5 rounded-sm border-2 border-slate-900 bg-white/20"></div>
              <div className="w-1 h-0.5 bg-slate-900"></div>
              <div className="w-3 h-2.5 rounded-sm border-2 border-slate-900 bg-white/20"></div>
            </div>
          )}

          {/* Auriculares */}
          {avatar.accessory === 'auriculares' && (
            <div className="absolute -inset-x-0.5 top-1 flex items-center justify-between z-20">
              <div className="w-2 h-3.5 bg-indigo-700 rounded-sm -ml-0.5 shadow-xs"></div>
              <div className="w-2 h-3.5 bg-indigo-700 rounded-sm -mr-0.5 shadow-xs"></div>
            </div>
          )}

          {/* Gorra */}
          {avatar.accessory === 'gorra' && (
            <div className="absolute -top-2 inset-x-0 h-3 bg-sky-600 rounded-t-full z-20 border-b border-sky-800">
              <div className="absolute -right-2 top-1.5 w-3 h-1 bg-sky-800 rounded-r-full"></div>
            </div>
          )}

          {/* Boca / Expresión */}
          <div className="mt-1">
            {avatar.emotion === 'alegre' && (
              <div className="w-3 h-1.5 border-b-2 border-slate-800 rounded-full"></div>
            )}
            {avatar.emotion === 'concentrado' && (
              <div className="w-2 h-0.5 bg-slate-800 rounded-full"></div>
            )}
            {avatar.emotion === 'genio' && (
              <div className="w-2.5 h-1 border-b-2 border-slate-800 rounded-md -rotate-6"></div>
            )}
          </div>
        </div>
      </div>

      {showBadge && (
        <span
          className={`mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium border ${outfit.color}`}
        >
          {outfit.label}
        </span>
      )}
    </div>
  );
};
