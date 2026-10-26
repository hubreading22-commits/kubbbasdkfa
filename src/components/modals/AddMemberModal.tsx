import React, { useState, useRef } from 'react';
import { X, AlertCircle, Camera, Trash2 } from 'lucide-react';
import {
  Language,
  HouseholdMemberItem,
  readFileAsDataUrl,
} from '../../types/vault';
import { Button } from '../ui/DesignSystem';

export const AddMemberModal = ({
  lang,
  onClose,
  onSave,
}: {
  lang: Language;
  onClose: () => void;
  onSave: (m: HouseholdMemberItem) => void;
}) => {
  const [nameEn, setNameEn] = useState('');
  const [nameMl, setNameMl] = useState('');
  const [relationEn, setRelationEn] = useState('');
  const [relationMl, setRelationMl] = useState('');
  const [location, setLocation] = useState('');
  const [avatarBg, setAvatarBg] = useState('#F4F5F7');
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDpFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await readFileAsDataUrl(file);
      setAvatarDataUrl(result.dataUrl);
    } catch {
      // Ignore file read errors
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim() && !nameMl.trim()) {
      setError(lang === 'ml' ? 'ദയവായി പേര് നൽകുക' : 'Please enter the member’s name');
      return;
    }
    const finalEn = nameEn.trim() || nameMl.trim();
    const finalMl = nameMl.trim() || finalEn;
    const relEn = relationEn.trim() || 'Family Member';
    const relMl = relationMl.trim() || relEn;
    onSave({
      id: `mem-${Date.now()}`,
      nameEn: finalEn,
      nameMl: finalMl,
      relationEn: relEn,
      relationMl: relMl,
      location: location.trim() || 'Kochi',
      avatarBg,
      avatarDataUrl,
      initials: finalEn.slice(0, 2).toUpperCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white rounded-t-[24px] md:rounded-[24px] border border-[#E6E8EC] w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E8EC]">
          <h3 className="text-[20px] font-semibold text-[#0B0B0C] font-malayalam">
            {lang === 'ml' ? 'പുതിയ കുടുംബാംഗത്തെ ചേർക്കുക' : 'Add Family Member'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-12 h-12 rounded-full bg-[#F4F5F7] border border-[#E6E8EC] flex items-center justify-center text-[#0B0B0C] hover:bg-[#E6E8EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#FDECEE] border border-[#B3121F]/30 text-[#B3121F] text-[16px]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Profile Photo (DP) Upload */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E6E8EC]">
            {avatarDataUrl ? (
              <img
                src={avatarDataUrl}
                alt="Member DP"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#FDECEE] shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#EB4D4B] text-white text-xl font-bold flex items-center justify-center border-2 border-[#FDECEE] shrink-0">
                {(nameEn || 'FM').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-bold text-[#0B0B0C]">
                {lang === 'ml' ? 'പ്രൊഫൈൽ ഫോട്ടോ (DP)' : 'Profile Picture (DP)'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleDpFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#E6E8EC] hover:border-[#0B0B0C] px-3 py-1.5 text-xs font-bold text-[#0B0B0C] cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#E03A45]" />
                  <span>{lang === 'ml' ? 'ഫോട്ടോ ചേർക്കുക' : 'Upload DP'}</span>
                </button>
                {avatarDataUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarDataUrl(undefined)}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#E6E8EC] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#B3121F] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] font-medium text-[#0B0B0C] mb-1.5">
                {lang === 'ml' ? 'പേര് (English) *' : 'Full Name (English) *'}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => {
                  setNameEn(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Meenakshi Nair"
                className="w-full h-12 px-4 rounded-xl bg-white border border-[#E6E8EC] text-[16px] font-normal text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#E03A45]"
              />
            </div>
            <div>
              <label className="block text-[16px] font-medium text-[#0B0B0C] mb-1.5 font-malayalam">
                {lang === 'ml' ? 'പേര് (മലയാളം)' : 'Name (Malayalam)'}
              </label>
              <input
                type="text"
                value={nameMl}
                onChange={(e) => setNameMl(e.target.value)}
                placeholder="ഉദാ: മീനാക്ഷി നായർ"
                className="w-full h-12 px-4 rounded-xl bg-white border border-[#E6E8EC] text-[16px] font-normal text-[#0B0B0C] placeholder:text-[#8A949E] font-malayalam focus:outline-none focus:border-[#E03A45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] font-medium text-[#0B0B0C] mb-1.5">
                {lang === 'ml' ? 'ബന്ധം (English)' : 'Relation (English)'}
              </label>
              <input
                type="text"
                value={relationEn}
                onChange={(e) => setRelationEn(e.target.value)}
                placeholder="e.g., Sister / Daughter"
                className="w-full h-12 px-4 rounded-xl bg-white border border-[#E6E8EC] text-[16px] font-normal text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#E03A45]"
              />
            </div>
            <div>
              <label className="block text-[16px] font-medium text-[#0B0B0C] mb-1.5 font-malayalam">
                {lang === 'ml' ? 'ബന്ധം (മലയാളം)' : 'Relation (Malayalam)'}
              </label>
              <input
                type="text"
                value={relationMl}
                onChange={(e) => setRelationMl(e.target.value)}
                placeholder="ഉദാ: സഹോദരി / മകൾ"
                className="w-full h-12 px-4 rounded-xl bg-white border border-[#E6E8EC] text-[16px] font-normal text-[#0B0B0C] placeholder:text-[#8A949E] font-malayalam focus:outline-none focus:border-[#E03A45]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[16px] font-medium text-[#0B0B0C] mb-1.5">
              {lang === 'ml' ? 'സ്ഥലം (Kochi / Dubai / Doha)' : 'Current Location'}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Kochi / Sharjah"
              className="w-full h-12 px-4 rounded-xl bg-white border border-[#E6E8EC] text-[16px] font-normal text-[#0B0B0C] placeholder:text-[#8A949E] focus:outline-none focus:border-[#E03A45]"
            />
          </div>

          <div>
            <label className="block text-[16px] font-medium text-[#0B0B0C] mb-2">
              {lang === 'ml' ? 'അവതാർ നിറം' : 'Profile Badge Colour'}
            </label>
            <div className="flex gap-3">
              {['#F4F5F7', '#FEF3C7', '#E4F7EC', '#E0E7FF', '#FCE7F3'].map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setAvatarBg(bg)}
                  className={`w-11 h-11 rounded-full border-2 cursor-pointer transition-transform ${
                    avatarBg === bg ? 'border-[#E03A45] scale-110' : 'border-[#E6E8EC]'
                  }`}
                  style={{ backgroundColor: bg }}
                  aria-label={`Select color ${bg}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex gap-3 border-t border-[#E6E8EC]">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              {lang === 'ml' ? 'റദ്ദാക്കുക' : 'Cancel'}
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {lang === 'ml' ? 'ചേർക്കുക' : 'Save Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
