import React, { useState } from 'react';
import { Household, HouseholdMember } from '../types.ts';
import { UploadIcon, PlusIcon } from './Icons.tsx';

interface AdminHouseholdProps {
  household: Household;
  onBack?: () => void;
  onUpdateAddress?: (newAddress: string) => Promise<void>;
  onSetHead?: (personId: string) => Promise<void>;
  onAddMember?: (member: Partial<HouseholdMember>) => Promise<void>;
  onPrintCard?: () => void;
}

export const AdminHousehold: React.FC<AdminHouseholdProps> = ({
  household,
  onBack,
  onUpdateAddress,
  onSetHead,
  onAddMember,
  onPrintCard,
}) => {
  const [address, setAddress] = useState(household.address);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState(household.address);

  // Group members into categories
  const familyMembers = household.members.filter((m) => m.category === 'family');
  const alsoLivesHereMembers = household.members.filter((m) => m.category === 'also_lives_here');
  const movedOutMembers = household.members.filter((m) => m.category === 'moved_out');

  const totalPeople = familyMembers.length + alsoLivesHereMembers.length;

  const handleAddressSave = async () => {
    if (onUpdateAddress && addressInput.trim()) {
      await onUpdateAddress(addressInput.trim());
      setAddress(addressInput.trim());
    } else {
      setAddress(addressInput.trim());
    }
    setIsEditingAddress(false);
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-[14px] pb-4 border-b border-line flex-wrap">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-ink2 hover:text-ink cursor-pointer p-1"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m14.5 6-6 6 6 6"/>
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-[20px] md:text-[22px] font-serif font-bold text-ink m-0">
              {household.name}
            </h1>
            <div className="text-[12px] text-ink3 mt-1">
              {totalPeople} people &middot; {familyMembers.length} family, {alsoLivesHereMembers.length} others &middot; {address}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrintCard}
            className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
          >
            <UploadIcon size={17} strokeWidth={1.7} />
            <span>Print family card</span>
          </button>
          <button
            type="button"
            onClick={() => onAddMember && onAddMember({ category: 'family' })}
            className="flex items-center gap-2 h-[40px] px-[18px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark transition-colors cursor-pointer"
          >
            <PlusIcon size={17} strokeWidth={1.7} />
            <span>Add a person here</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-7 py-6 overflow-y-auto">
        {/* Left Column: Location & Coordinates & Contacts */}
        <div className="w-full lg:w-[470px] lg:flex-[0_0_470px] flex flex-col gap-4">
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink3">
            WHERE THIS HOUSEHOLD IS
          </div>

          {/* Address Box */}
          <div className="flex flex-col gap-[6px]">
            <span className="text-[12px] font-bold text-ink2">ADDRESS</span>
            {isEditingAddress ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="flex-1 h-[44px] px-[14px] bg-surface border border-accent rounded-input text-[14px] font-semibold text-ink outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddressSave}
                  className="px-4 h-[44px] rounded-input bg-accent text-white text-[13px] font-semibold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-[10px] h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <span className="flex-1 min-w-0 text-[14px] font-semibold text-ink truncate">
                  {address}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="text-[12px] font-bold text-accent hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Map Block (OpenStreetMap style from AdminHousehold.dc.html) */}
          <div className="relative w-full h-[240px] rounded-input overflow-hidden border border-line bg-[#EFE9E0]">
            <svg width="100%" height="240" viewBox="0 0 470 240" preserveAspectRatio="none" className="block w-full h-full">
              <rect x="0" y="0" width="470" height="240" fill="#EFE9E0"/>
              <rect x="18.8" y="14.4" width="122.2" height="72" rx="2" fill="#E4DCD1"/>
              <rect x="169.2" y="14.4" width="141" height="52.8" rx="2" fill="#E4DCD1"/>
              <rect x="338.4" y="24" width="112.8" height="62.4" rx="2" fill="#E4DCD1"/>
              <rect x="18.8" y="148.8" width="103.4" height="72" rx="2" fill="#E4DCD1"/>
              <rect x="159.8" y="158.4" width="141" height="62.4" rx="2" fill="#E4DCD1"/>
              <rect x="329" y="144" width="122.2" height="76.8" rx="2" fill="#E0E7DC"/>
              <line x1="0" y1="120" x2="470" y2="112.8" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round"/>
              <line x1="155.1" y1="0" x2="145.7" y2="240" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
              <line x1="319.6" y1="0" x2="329" y2="240" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
              <line x1="0" y1="206.4" x2="470" y2="201.6" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="235" cy="112.8" r="13" fill="#B4562F" opacity="0.16"/>
              <path d="M235 121.8 c-4.6 -6.4 -7 -9.6 -7 -12.6 a7 7 0 0 1 14 0 c0 3 -2.4 6.2 -7 12.6z" fill="#8E4224"/>
              <circle cx="235" cy="109" r="2.4" fill="#FFFFFF"/>
            </svg>
            <div className="absolute top-2 right-2 flex flex-col bg-surface border border-line rounded-mark overflow-hidden">
              <span className="w-[26px] h-6 flex items-center justify-center text-ink2 border-b border-lineSoft text-sm font-bold select-none cursor-pointer">+</span>
              <span className="w-[26px] h-6 flex items-center justify-center text-ink2 text-sm font-bold select-none cursor-pointer">&minus;</span>
            </div>
            <div className="absolute bottom-0 right-0 p-[2px_6px] bg-white/80 text-[8px] font-semibold text-ink2">
              &copy; OpenStreetMap
            </div>
          </div>

          <div className="flex items-start gap-[10px] p-[12px_14px] bg-surface border border-line rounded-input">
            <span className="text-ink3 flex pt-1">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s6.4-6.2 6.4-10.4A6.4 6.4 0 0 0 5.6 10.6C5.6 14.8 12 21 12 21z"/>
                <circle cx="12" cy="10.4" r="2.3"/>
              </svg>
            </span>
            <div className="flex-1 text-[12px] text-ink2 leading-[1.5]">
              Drag the pin if the address search put it on the wrong gang.
            </div>
          </div>

          {/* Also at this address */}
          <div className="bg-surface border border-line rounded-card overflow-hidden">
            <div className="p-[13px_16px_8px] text-[11px] font-bold tracking-[0.1em] uppercase text-ink3">
              Also at this address
            </div>
            <div className="flex items-center gap-3 p-[0_16px_14px]">
              <div className="w-[38px] h-[38px] flex-[0_0_38px] rounded-input bg-accentTint text-accent flex items-center justify-center text-[12px] font-bold tracking-[0.02em]">
                KH
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-ink">Keluarga Halim</div>
                <div className="text-[11.5px] text-ink3 mt-[2px]">3 people &middot; Andreas H. is head</div>
              </div>
              <span className="text-ink3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9.5 6 6 6-6 6"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Who the office calls */}
          <div className="bg-surface border border-line rounded-card overflow-hidden">
            <div className="p-[13px_16px_8px] text-[11px] font-bold tracking-[0.1em] uppercase text-ink3">
              Who the office calls
            </div>
            <div className="flex items-center gap-3 p-[0_16px_14px]">
              <div className="w-9 h-9 flex-[0_0_36px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[12px] font-bold tracking-[0.02em]">
                {getInitials(household.primary_contact_name || 'BP')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-ink">
                  {household.primary_contact_name || 'Bambang Prasetyo'}
                </div>
                <div className="text-[11.5px] text-ink3 mt-[2px]">
                  {household.primary_contact_phone || '+62 812-3344-9900'}
                </div>
              </div>
              <span className="text-[12.5px] font-bold text-accent cursor-pointer hover:underline">
                Change
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Family, Also Lives Here, Moved Out */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* 1. FAMILY SECTION */}
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink3">
            FAMILY
          </div>
          <div className="bg-surface border border-line rounded-card overflow-hidden divide-y divide-lineSoft">
            {familyMembers.map((member) => (
              <div key={member.person_id} className="flex items-center gap-3 p-[12px_16px]">
                <div className="w-9 h-9 flex-[0_0_36px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[12px] font-bold tracking-[0.02em]">
                  {getInitials(member.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-ink">{member.full_name}</div>
                  <div className="text-[11.5px] text-ink3 mt-[2px]">
                    {member.standing} &middot; {member.age}
                  </div>
                </div>

                <div className="w-[160px] flex-[0_0_160px] flex items-center justify-between">
                  <span className={`text-[12.5px] ${member.is_head ? 'text-accent font-bold' : 'text-ink2 font-semibold'}`}>
                    {member.is_head ? 'Head of household' : member.relationship}
                  </span>
                  {!member.is_head && onSetHead && (
                    <button
                      type="button"
                      onClick={() => onSetHead(member.person_id)}
                      className="text-[11px] text-ink3 hover:text-accent font-semibold px-2 py-1"
                      title="Make Head of Household (BR-1)"
                    >
                      Make head
                    </button>
                  )}
                </div>

                {member.own_address_note && (
                  <span className="inline-flex items-center h-6 px-[9px] rounded-full bg-bg text-ink3 text-[11px] font-bold border border-line whitespace-nowrap">
                    {member.own_address_note}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* 2. ALSO LIVES HERE SECTION */}
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink3 mt-2">
            ALSO LIVES HERE
          </div>
          <div className="bg-surface border border-line rounded-card overflow-hidden divide-y divide-lineSoft">
            {alsoLivesHereMembers.map((member) => (
              <div key={member.person_id} className="flex items-center gap-3 p-[12px_16px]">
                <div className="w-9 h-9 flex-[0_0_36px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[12px] font-bold tracking-[0.02em]">
                  {getInitials(member.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-ink">{member.full_name}</div>
                  <div className="text-[11.5px] text-ink3 mt-[2px]">
                    {member.standing} &middot; {member.age}
                  </div>
                </div>
                <span className="w-[150px] flex-[0_0_150px] text-[12.5px] font-semibold text-ink2">
                  {member.relationship}
                </span>
              </div>
            ))}

            <div
              onClick={() => onAddMember && onAddMember({ category: 'also_lives_here' })}
              className="flex items-center gap-[10px] p-[13px_16px] hover:bg-surfaceAlt cursor-pointer transition-colors"
            >
              <span className="text-accent flex items-center">
                <PlusIcon size={16} strokeWidth={2.2} />
              </span>
              <span className="text-[13px] font-semibold text-accent">
                Add someone who lives here
              </span>
            </div>
          </div>

          {/* 3. MOVED OUT SECTION */}
          <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-ink3 mt-2">
            MOVED OUT
          </div>
          <div className="bg-surface border border-line rounded-card overflow-hidden divide-y divide-lineSoft">
            {movedOutMembers.map((member) => (
              <div key={member.person_id} className="flex items-center gap-3 p-[11px_16px]">
                <div className="w-[34px] h-[34px] flex-[0_0_34px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[11px] font-bold tracking-[0.02em]">
                  {getInitials(member.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink">{member.full_name}</div>
                  <div className="text-[11px] text-ink3 mt-[2px]">
                    {member.relationship} &middot; {member.moved_out_note || 'Moved out'}
                  </div>
                </div>
                {member.new_household && (
                  <span className="text-[12px] font-semibold text-ink2">
                    {member.new_household}
                  </span>
                )}
                <span className="text-ink3 flex items-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9.5 6 6 6-6 6"/>
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
