import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/DesignSystem';
import { WorkerRecordItem } from '../../types/vault';

export interface AddWorkerModalProps {
  lang: 'ml' | 'en';
  onClose: () => void;
  onSave: (worker: WorkerRecordItem) => void;
}

export const AddWorkerModal: React.FC<AddWorkerModalProps> = ({
  lang,
  onClose,
  onSave,
}) => {
  const [nameEn, setNameEn] = useState('');
  const [roleEn, setRoleEn] = useState('Electrician');
  const [areaEn, setAreaEn] = useState('Edappally');
  const [phone, setPhone] = useState('98470 11223');
  const [notesEn, setNotesEn] = useState('Base visit charge: ₹400');
  const [firstWorkEn, setFirstWorkEn] = useState(
    'Initial service & inspection'
  );
  const [firstAmount, setFirstAmount] = useState('450');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameEn.trim() || 'Manoj Kumar';
    const cleanPhone = phone.trim() || '98470 11223';
    const cleanArea = areaEn.trim() || 'Kochi';
    const amt = parseInt(firstAmount.replace(/\D/g, ''), 10) || 450;
    const today = new Date().toISOString().slice(0, 10);

    onSave({
      id: `wrk-${Date.now()}`,
      nameEn: cleanName,
      nameMl: cleanName,
      roleEn,
      roleMl: roleEn,
      tradeEn: roleEn,
      tradeMl: roleEn,
      areaEn: cleanArea,
      areaMl: cleanArea,
      countryCode: '+91',
      phone: cleanPhone,
      whatsapp: '91' + cleanPhone.replace(/\D/g, '').slice(-10),
      lastServiceDate: today,
      lastVisit: today,
      notesEn,
      notesMl: notesEn,
      rating: 5,
      favourite: false,
      history: [
        {
          id: `wh-${Date.now()}`,
          date: today,
          workEn: firstWorkEn.trim() || 'Service visit',
          workMl: firstWorkEn.trim() || 'സർവീസ് സന്ദർശനം',
          amount: amt,
          paid: true,
        },
      ],
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-3">
          <h3 className="text-xl font-extrabold text-[#0B0B0C]">
            {lang === 'ml'
              ? 'പുതിയ ജോലിക്കാരനെ ചേർക്കുക'
              : 'Add Trusted Household Worker'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F4F5F7] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-[#0B0B0C] mb-1">
                {lang === 'ml' ? 'പേര്' : 'Worker Name'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Sasi Nair"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full min-h-[46px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] px-3.5 text-base font-semibold text-[#0B0B0C]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B0B0C] mb-1">
                {lang === 'ml' ? 'ജോലി വിഭാഗം' : 'Trade / Role'}
              </label>
              <select
                value={roleEn}
                onChange={(e) => setRoleEn(e.target.value)}
                className="w-full min-h-[46px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] px-3.5 text-base font-semibold text-[#0B0B0C]"
              >
                <option value="Electrician">Electrician (ഇലക്ട്രീഷ്യൻ)</option>
                <option value="Plumber">Plumber (പ്ലംബർ)</option>
                <option value="AC Service">AC Service (എസി സർവീസ്)</option>
                <option value="Coconut Climber">
                  Coconut Climber (തെങ്ങുകയറ്റം)
                </option>
                <option value="Carpenter">Carpenter (ആശാരി)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-[#0B0B0C] mb-1">
                {lang === 'ml' ? 'സ്ഥലം (Area)' : 'Locality / Area'}
              </label>
              <input
                type="text"
                value={areaEn}
                onChange={(e) => setAreaEn(e.target.value)}
                className="w-full min-h-[46px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] px-3.5 text-base font-semibold text-[#0B0B0C]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B0B0C] mb-1">
                {lang === 'ml' ? 'ഫോൺ നമ്പർ' : 'Phone / WhatsApp'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[46px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] px-3.5 font-mono-tabular text-base font-bold text-[#0B0B0C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0B0B0C] mb-1">
              {lang === 'ml' ? 'നിരക്കുകൾ / കുറിപ്പുകൾ' : 'Rate & Notes'}
            </label>
            <input
              type="text"
              value={notesEn}
              onChange={(e) => setNotesEn(e.target.value)}
              className="w-full min-h-[46px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] px-3.5 text-base font-semibold text-[#0B0B0C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[#0B0B0C] mb-1">
                {lang === 'ml' ? 'അവസാനം ചെയ്ത ജോലി' : 'Recent Work Done'}
              </label>
              <input
                type="text"
                value={firstWorkEn}
                onChange={(e) => setFirstWorkEn(e.target.value)}
                className="w-full min-h-[46px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] px-3.5 text-base font-semibold text-[#0B0B0C]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0B0B0C] mb-1">
                {lang === 'ml' ? 'നൽകിയ തുക (₹)' : 'Paid Amount (₹)'}
              </label>
              <input
                type="text"
                value={firstAmount}
                onChange={(e) => setFirstAmount(e.target.value)}
                className="w-full min-h-[46px] rounded-xl border border-[#E6E8EC] bg-[#F4F5F7] px-3.5 font-mono-tabular text-base font-bold text-[#0B0B0C]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline-ink" onClick={onClose}>
              {lang === 'ml' ? 'റദ്ദാക്കുക' : 'Cancel'}
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="h-4 w-4" />
              <span>{lang === 'ml' ? 'സേവ് ചെയ്യുക' : 'Save Worker'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
