import React, { useState } from 'react';
import { StudentProfile, AvatarConfig, SchoolLevel } from '../types';
import { PROVINCES_ARGENTINA, PRIMARY_GRADES, SECONDARY_GRADES } from '../data/activities';
import { AvatarDisplay } from './AvatarDisplay';
import { User, Sparkles, GraduationCap, MapPin, Check, Palette, Smile } from 'lucide-react';

interface AvatarCreatorProps {
  initialProfile?: StudentProfile | null;
  onSave: (profile: StudentProfile) => void;
  onCancel?: () => void;
}

const SKIN_TONES = [
  { id: '#fed7aa', label: 'Claro' },
  { id: '#fcd34d', label: 'Cálido' },
  { id: '#f59e0b', label: 'Trigueño' },
  { id: '#d97706', label: 'Bronce' },
  { id: '#78350f', label: 'Moreno' },
];

const HAIR_COLORS = [
  { id: '#1c1917', label: 'Negro' },
  { id: '#78350f', label: 'Castaño' },
  { id: '#b45309', label: 'Castaño Claro' },
  { id: '#f59e0b', label: 'Rubio' },
  { id: '#dc2626', label: 'Pelirrojo' },
  { id: '#0284c7', label: 'Fantasía Celeste' },
];

const BG_COLORS = [
  '#e0f2fe', // celeste suave
  '#fef3c7', // dorado suave
  '#dcfce7', // verde suave
  '#f3e8ff', // lila suave
  '#ffe4e6', // rosado suave
  '#f1f5f9', // gris neutro
];

export const AvatarCreator: React.FC<AvatarCreatorProps> = ({
  initialProfile,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Mateo');
  const [age, setAge] = useState<number>(initialProfile?.age || 10);
  const [level, setLevel] = useState<SchoolLevel>(initialProfile?.level || 'primaria');
  const [grade, setGrade] = useState<string>(
    initialProfile?.grade || (initialProfile?.level === 'secundaria' ? '1° Año' : '5° Grado')
  );
  const [province, setProvince] = useState<string>(
    initialProfile?.province || 'Buenos Aires'
  );

  const [avatar, setAvatar] = useState<AvatarConfig>(
    initialProfile?.avatar || {
      skinTone: '#fcd34d',
      hairStyle: 'corto',
      hairColor: '#78350f',
      outfit: 'guardapolvo',
      accessory: 'escarapela',
      emotion: 'alegre',
      bgColor: '#e0f2fe',
    }
  );

  const handleLevelChange = (newLevel: SchoolLevel) => {
    setLevel(newLevel);
    if (newLevel === 'primaria') {
      setGrade('5° Grado');
      if (age > 13) setAge(11);
      if (avatar.outfit !== 'guardapolvo' && avatar.outfit !== 'remera_celeste') {
        setAvatar((prev) => ({ ...prev, outfit: 'guardapolvo' }));
      }
    } else {
      setGrade('2° Año');
      if (age < 12) setAge(14);
      if (avatar.outfit === 'guardapolvo') {
        setAvatar((prev) => ({ ...prev, outfit: 'buzo_azul' }));
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const profile: StudentProfile = {
      id: initialProfile?.id || `student-${Date.now()}`,
      name: name.trim(),
      age: Number(age),
      level,
      grade,
      province,
      avatar,
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
    };

    onSave(profile);
  };

  return (
    <div id="avatar-creator-container" className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Cabecera */}
      <div className="bg-linear-to-r from-sky-600 to-indigo-700 p-6 text-white flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-sky-200">
            Ficha Escolar
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">
            {initialProfile ? 'Editar Avatar y Nivel Escolar' : 'Crear tu Avatar y Datos Escolares'}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            Los desafíos de bloqueo y desbloqueo se adaptarán automáticamente a tu grado y edad.
          </p>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
          <GraduationCap className="w-8 h-8 text-amber-300" />
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        {/* Vista previa del Avatar y datos básicos */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col items-center">
            <AvatarDisplay avatar={avatar} size="xl" showBadge />
            <span className="text-xs text-slate-500 mt-1 font-medium">Vista Previa</span>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre o Apodo del Alumno/a
              </label>
              <div className="relative">
                <input
                  id="student-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Joaquín, Sofía, Mateo"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Edad ({age} años)
                </label>
                <input
                  id="student-age-input"
                  type="number"
                  min={6}
                  max={18}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Provincia
                </label>
                <select
                  id="student-province-select"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm bg-white"
                >
                  {PROVINCES_ARGENTINA.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Nivel y Grado Escolar en Argentina */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Nivel Educativo y Grado / Año (Argentina)
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              id="select-level-primaria"
              type="button"
              onClick={() => handleLevelChange('primaria')}
              className={`p-3 rounded-xl border text-left transition-all ${
                level === 'primaria'
                  ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">Nivel Primario</span>
                {level === 'primaria' && <Check className="w-4 h-4 text-sky-600" />}
              </div>
              <p className="text-xs text-slate-600 mt-1">1° a 7° Grado (6 a 12 años)</p>
            </button>

            <button
              id="select-level-secundaria"
              type="button"
              onClick={() => handleLevelChange('secundaria')}
              className={`p-3 rounded-xl border text-left transition-all ${
                level === 'secundaria'
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">Nivel Secundario</span>
                {level === 'secundaria' && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-600 mt-1">1° a 6° Año (13 a 18 años)</p>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seleccionar Grado o Año actual
            </label>
            <select
              id="student-grade-select"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              {level === 'primaria'
                ? PRIMARY_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))
                : SECONDARY_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* Personalización visual del Avatar */}
        <div className="space-y-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-sky-600" />
              <span>Personalizar Aspecto del Avatar</span>
            </h3>
          </div>

          {/* Ropa escolar argentina */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Indumentaria Escolar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'guardapolvo', label: 'Guardapolvo Blanco' },
                { id: 'remera_celeste', label: 'Remera Celeste y Blanca' },
                { id: 'buzo_azul', label: 'Buzo Azul Marino' },
                { id: 'campera_escolar', label: 'Campera Deportiva' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setAvatar((prev) => ({
                      ...prev,
                      outfit: item.id as AvatarConfig['outfit'],
                    }))
                  }
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    avatar.outfit === item.id
                      ? 'border-sky-600 bg-sky-100 text-sky-900 font-semibold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Estilo y Color de Cabello */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Corte / Peinado
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['corto', 'rulos', 'largo', 'trenzas', 'rapado'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setAvatar((prev) => ({ ...prev, hairStyle: style }))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs capitalize border transition-all ${
                      avatar.hairStyle === style
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Color de Cabello
              </label>
              <div className="flex items-center gap-2">
                {HAIR_COLORS.map((hc) => (
                  <button
                    key={hc.id}
                    type="button"
                    title={hc.label}
                    onClick={() => setAvatar((prev) => ({ ...prev, hairColor: hc.id }))}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      avatar.hairColor === hc.id
                        ? 'scale-125 border-sky-600 shadow-xs'
                        : 'border-white hover:scale-110'
                    }`}
                    style={{ backgroundColor: hc.id }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Accesorios y Expresión */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Accesorio
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'escarapela', label: 'Escarapela 🇦🇷' },
                  { id: 'anteojos', label: 'Anteojos' },
                  { id: 'gorra', label: 'Gorra' },
                  { id: 'auriculares', label: 'Auriculares' },
                  { id: 'ninguno', label: 'Ninguno' },
                ].map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() =>
                      setAvatar((prev) => ({
                        ...prev,
                        accessory: acc.id as AvatarConfig['accessory'],
                      }))
                    }
                    className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                      avatar.accessory === acc.id
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Expresión
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'alegre', label: 'Alegre' },
                  { id: 'concentrado', label: 'Concentrado' },
                  { id: 'genio', label: 'Genio' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() =>
                      setAvatar((prev) => ({
                        ...prev,
                        emotion: exp.id as AvatarConfig['emotion'],
                      }))
                    }
                    className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${
                      avatar.emotion === exp.id
                        ? 'border-sky-600 bg-sky-50 text-sky-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tono de piel y Fondo */}
          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tono de Piel
              </label>
              <div className="flex items-center gap-2">
                {SKIN_TONES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    title={st.label}
                    onClick={() => setAvatar((prev) => ({ ...prev, skinTone: st.id }))}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      avatar.skinTone === st.id
                        ? 'scale-125 border-sky-600 shadow-xs'
                        : 'border-white hover:scale-110'
                    }`}
                    style={{ backgroundColor: st.id }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Color de Fondo
              </label>
              <div className="flex items-center gap-2">
                {BG_COLORS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setAvatar((prev) => ({ ...prev, bgColor: bg }))}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      avatar.bgColor === bg
                        ? 'scale-125 border-sky-600 shadow-xs'
                        : 'border-slate-300 hover:scale-110'
                    }`}
                    style={{ backgroundColor: bg }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de guardar o cancelar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            id="save-avatar-profile-btn"
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Perfil y Comenzar</span>
          </button>
        </div>
      </form>
    </div>
  );
};
