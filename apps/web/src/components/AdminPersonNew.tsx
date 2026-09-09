import React, { useState } from 'react';
import { CreatePersonPayload, MembershipStanding, HouseholdRole } from '../types.ts';
import { CheckIcon, PlusIcon } from './Icons.tsx';

interface AdminPersonNewProps {
  onClose: () => void;
  onSave: (person: CreatePersonPayload, addAnother: boolean) => Promise<void>;
  churchName?: string;
}

export const AdminPersonNew: React.FC<AdminPersonNewProps> = ({
  onClose,
  onSave,
  churchName = 'Immanuel Church, Sunter',
}) => {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [withUsSince, setWithUsSince] = useState('March 2026');
  const [phone, setPhone] = useState('');
  const [secondPhone, setSecondPhone] = useState('');
  const [standing, setStanding] = useState<MembershipStanding>('Registered Member');
  const [memberOf, setMemberOf] = useState(churchName);
  const [householdQuery, setHouseholdQuery] = useState('Keluarga Prasetyo');
  const [householdRole, setHouseholdRole] = useState<HouseholdRole>('Head');
  const [address, setAddress] = useState('Sunter Agung Q4/12, Jakarta Utara');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (addAnother: boolean) => {
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    setLoading(true);
    setError(null);

    const fullPhone = phone.trim() ? (phone.startsWith('+62') ? phone : '+62' + phone.replace(/\D/g, '')) : '';
    const fullSecondPhone = secondPhone.trim() ? (secondPhone.startsWith('+62') ? secondPhone : '+62' + secondPhone.replace(/\D/g, '')) : '';

    const payload: CreatePersonPayload = {
      full_name: fullName.trim(),
      date_of_birth: dateOfBirth.trim(),
      with_us_since: withUsSince.trim(),
      phone: fullPhone,
      second_phone: fullSecondPhone,
      standing: standing,
      household_name: householdQuery.trim(),
      role_in_household: householdRole,
      privacy_opt_in: false,
    };

    try {
      await onSave(payload, addAnother);
      if (addAnother) {
        setFullName('');
        setPhone('');
        setSecondPhone('');
        setDateOfBirth('');
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save person');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[1140px] max-h-[92vh] bg-bg rounded-card border border-line shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <header className="flex items-center gap-[14px] px-8 py-5 bg-surfaceAlt border-b border-line flex-[0_0_auto]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-ink2 hover:text-ink cursor-pointer p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.2 6.2l11.6 11.6"/>
              <path d="M17.8 6.2 6.2 17.8"/>
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-bold text-ink m-0">Add a person</h2>
            <div className="text-[12px] text-ink3 mt-[2px]">{churchName}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckIcon size={14} strokeWidth={2.5} />
              <span>Save and close</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex items-center gap-2 h-[40px] px-[18px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark transition-colors cursor-pointer disabled:opacity-50"
            >
              <PlusIcon size={17} strokeWidth={1.7} />
              <span>Save and add another</span>
            </button>
          </div>
        </header>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-center">
          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-input mb-4 md:hidden">
              {error}
            </div>
          )}

          {/* Left Column: Who they are & Standing */}
          <div className="w-full md:w-[470px] md:flex-[0_0_470px] flex flex-col gap-4">
            {error && (
              <div className="hidden md:block p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-input mb-2">
                {error}
              </div>
            )}

            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink3">
              WHO THEY ARE
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">FULL NAME</span>
              <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Yosafat Prasetyo"
                  className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Date of Birth & With us since */}
            <div className="flex gap-[14px]">
              <div className="flex-1 flex flex-col gap-[6px]">
                <span className="text-[12px] font-bold text-ink2">DATE OF BIRTH</span>
                <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input">
                  <input
                    type="text"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    placeholder="14 June 1979"
                    className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-[6px]">
                <span className="text-[12px] font-bold text-ink2">WITH US SINCE</span>
                <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input">
                  <input
                    type="text"
                    value={withUsSince}
                    onChange={(e) => setWithUsSince(e.target.value)}
                    placeholder="March 2026"
                    className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">PHONE</span>
              <div className="flex items-center gap-[10px] h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <span className="text-[14px] font-semibold text-ink2">+62</span>
                <span className="w-[1px] h-5 bg-line"></span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="812-7788-2200"
                  className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Second Phone */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-ink2">SECOND PHONE</span>
                <span className="text-[11px] font-semibold text-ink3">optional</span>
              </div>
              <div className="flex items-center gap-[10px] h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <span className="text-[14px] font-semibold text-ink2">+62</span>
                <span className="w-[1px] h-5 bg-line"></span>
                <input
                  type="text"
                  value={secondPhone}
                  onChange={(e) => setSecondPhone(e.target.value)}
                  placeholder="Add another number"
                  className="flex-1 text-[14px] font-normal text-ink3 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Standing */}
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink3 mt-2">
              STANDING
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">MEMBERSHIP</span>
              <div className="flex gap-1 p-1 bg-bg border border-line rounded-input">
                {(['Guest', 'Member', 'Registered Member'] as MembershipStanding[]).map((st) => {
                  const isSelected = standing === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStanding(st)}
                      className={`flex-1 flex items-center justify-center h-[36px] rounded-[9px] text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-accent text-white font-bold'
                          : 'text-ink2 font-semibold hover:bg-surface'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Member Of */}
            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">MEMBER OF</span>
              <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <input
                  type="text"
                  value={memberOf}
                  onChange={(e) => setMemberOf(e.target.value)}
                  placeholder="Church name"
                  className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                />
              </div>
              <span className="text-[11px] text-ink3">Where their membership is held.</span>
            </div>
          </div>

          {/* Right Column: Where they live (Household & Map) */}
          <div className="w-full md:w-[540px] md:flex-[0_0_540px] flex flex-col gap-4">
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink3">
              WHERE THEY LIVE
            </div>

            {/* Household Picker */}
            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">HOUSEHOLD</span>
              <div className="flex items-center h-[44px] px-[14px] bg-surface border border-accent rounded-input">
                <input
                  type="text"
                  value={householdQuery}
                  onChange={(e) => setHouseholdQuery(e.target.value)}
                  className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Autocomplete cards list */}
            <div className="bg-surface border border-line rounded-card overflow-hidden -mt-1 divide-y divide-lineSoft shadow-sm">
              <div
                onClick={() => {
                  setHouseholdQuery('Keluarga Prasetyo');
                  setAddress('Sunter Agung Q4/12, Jakarta Utara');
                }}
                className="flex items-center gap-[11px] p-[11px_14px] bg-accentTint cursor-pointer hover:opacity-90"
              >
                <span className="text-accent flex items-center">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3.6 10.2 12 3.8l8.4 6.4V19a1.4 1.4 0 0 1-1.4 1.4h-4.2v-5.6H9.2v5.6H5a1.4 1.4 0 0 1-1.4-1.4z"/>
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-ink">Keluarga Prasetyo</div>
                  <div className="text-[11px] text-ink3 mt-[2px]">8 people · Sunter Agung Q4/12</div>
                </div>
              </div>

              <div
                onClick={() => {
                  setHouseholdQuery('Keluarga Prasetya');
                  setAddress('Kelapa Gading Barat, Jakarta Utara');
                }}
                className="flex items-center gap-[11px] p-[11px_14px] hover:bg-surfaceAlt cursor-pointer"
              >
                <span className="text-ink3 flex items-center">
                  <PlusIcon size={17} strokeWidth={1.7} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink">Keluarga Prasetya</div>
                  <div className="text-[11px] text-ink3 mt-[2px]">2 people · Kelapa Gading</div>
                </div>
              </div>

              <div
                onClick={() => {
                  setHouseholdQuery('');
                  setAddress('');
                }}
                className="flex items-center gap-[11px] p-[11px_14px] hover:bg-surfaceAlt cursor-pointer"
              >
                <span className="text-ink3 flex items-center">
                  <PlusIcon size={17} strokeWidth={1.7} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink">Create a new household</div>
                  <div className="text-[11px] text-ink3 mt-[2px]">For a different address</div>
                </div>
              </div>
            </div>

            {/* Household Role */}
            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">ROLE IN HOUSEHOLD</span>
              <div className="flex gap-1 p-1 bg-bg border border-line rounded-input">
                {(['Head', 'Spouse', 'Child', 'Other'] as HouseholdRole[]).map((role) => {
                  const isSelected = householdRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setHouseholdRole(role)}
                      className={`flex-1 flex items-center justify-center h-[34px] rounded-[8px] text-[12.5px] whitespace-nowrap transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-accent text-white font-bold'
                          : 'text-ink2 font-semibold hover:bg-surface'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-ink2">ADDRESS</span>
                <span className="text-[11px] font-semibold text-ink3">from the household</span>
              </div>
              <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Map Preview Block */}
            <div className="relative w-full h-[180px] rounded-input overflow-hidden border border-line bg-[#EFE9E0]">
              <svg width="100%" height="180" viewBox="0 0 590 190" preserveAspectRatio="none" className="block w-full h-full">
                <rect x="0" y="0" width="590" height="190" fill="#EFE9E0"/>
                <rect x="23.6" y="11.4" width="153.4" height="57" rx="2" fill="#E4DCD1"/>
                <rect x="212.4" y="11.4" width="177" height="41.8" rx="2" fill="#E4DCD1"/>
                <rect x="424.8" y="19" width="141.6" height="49.4" rx="2" fill="#E4DCD1"/>
                <rect x="23.6" y="117.8" width="129.8" height="57" rx="2" fill="#E4DCD1"/>
                <rect x="200.6" y="125.4" width="177" height="49.4" rx="2" fill="#E4DCD1"/>
                <rect x="413" y="114" width="153.4" height="60.8" rx="2" fill="#E0E7DC"/>
                <line x1="0" y1="95" x2="590" y2="89.3" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round"/>
                <line x1="194.7" y1="0" x2="182.9" y2="190" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
                <line x1="401.2" y1="0" x2="413" y2="190" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
                <line x1="0" y1="163.4" x2="590" y2="159.6" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="295" cy="89.3" r="13" fill="#B4562F" opacity="0.16"/>
                <path d="M295 98.3 c-4.6 -6.4 -7 -9.6 -7 -12.6 a7 7 0 0 1 14 0 c0 3 -2.4 6.2 -7 12.6z" fill="#8E4224"/>
                <circle cx="295" cy="85.5" r="2.4" fill="#FFFFFF"/>
              </svg>
              <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] text-ink3 font-semibold">
                Sunter Agung Map Block
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
