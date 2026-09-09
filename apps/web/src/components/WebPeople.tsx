import React, { useState } from 'react';
import { Person, MembershipStanding } from '../types.ts';
import { SearchIcon } from './Icons.tsx';

interface WebPeopleProps {
  people: Person[];
  onSelectPerson: (person: Person) => void;
  onAddPerson?: () => void;
  onImportExcel?: () => void;
}

export const WebPeople: React.FC<WebPeopleProps> = ({
  people,
  onSelectPerson,
}) => {
  const [query, setQuery] = useState('');
  const [standingFilter, setStandingFilter] = useState<string>('all');
  const [privacyMasked, setPrivacyMasked] = useState(false);

  const filterChips: Array<{ key: string; label: string; count: number }> = [
    { key: 'all', label: 'All', count: people.length },
    {
      key: 'Registered',
      label: 'Registered',
      count: people.filter((p) => p.standing === 'Registered Member').length,
    },
    {
      key: 'Member',
      label: 'Member',
      count: people.filter((p) => p.standing === 'Member').length,
    },
    {
      key: 'Community',
      label: 'Community',
      count: people.filter((p) => p.standing === 'Community').length,
    },
    {
      key: 'Guest',
      label: 'Guests',
      count: people.filter((p) => p.standing === 'Guest').length,
    },
    {
      key: 'Not on our roll',
      label: 'Not on our roll',
      count: people.filter((p) => p.standing === 'Not on our roll').length,
    },
  ];

  const filteredPeople = people.filter((p) => {
    if (standingFilter !== 'all') {
      if (!p.standing.toLowerCase().includes(standingFilter.toLowerCase())) {
        return false;
      }
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchName = p.full_name.toLowerCase().includes(q);
      const matchPhone = p.phone.toLowerCase().includes(q);
      const matchHousehold = p.household_name?.toLowerCase().includes(q) ?? false;
      if (!matchName && !matchPhone && !matchHousehold) {
        return false;
      }
    }
    return true;
  });

  const missingPhoneCount = people.filter((p) => !p.phone || p.phone === '—').length;

  const maskPhoneNumber = (phone: string, optIn: boolean) => {
    if (!privacyMasked || optIn) return phone;
    if (!phone || phone === '—') return '—';
    const cleaned = phone.trim();
    if (cleaned.length < 7) return '••••••••';
    const prefix = cleaned.slice(0, 4);
    const suffix = cleaned.slice(-2);
    return `${prefix}-••••-${suffix}`;
  };

  const renderStandingPill = (standing: MembershipStanding) => {
    switch (standing) {
      case 'Registered Member':
        return (
          <span className="inline-flex items-center h-6 px-[9px] rounded-full bg-sageTint text-sage text-[11px] font-bold tracking-[0.02em]">
            Registered Member
          </span>
        );
      case 'Member':
        return (
          <span className="inline-flex items-center h-6 px-[9px] rounded-full bg-accentTint text-accent text-[11px] font-bold tracking-[0.02em]">
            Member
          </span>
        );
      case 'Community':
        return (
          <span className="inline-flex items-center h-6 px-[9px] rounded-full bg-amberTint text-amber text-[11px] font-bold tracking-[0.02em]">
            Community
          </span>
        );
      case 'Guest':
      default:
        return (
          <span className="inline-flex items-center h-6 px-[9px] rounded-full bg-bg text-ink2 border border-line text-[11px] font-bold">
            {standing}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-[18px] flex-1 min-h-0">
      {/* Search and filter bar */}
      <div className="flex items-center gap-[9px] flex-wrap">
        <div className="flex items-center gap-2 h-[34px] px-3 bg-surface border border-line rounded-full min-w-[200px]">
          <SearchIcon size={15} strokeWidth={1.7} className="text-ink3" />
          <input
            type="text"
            placeholder="Search people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-[13px] text-ink outline-none bg-transparent w-full"
          />
        </div>

        {filterChips.map((chip) => {
          const isActive = standingFilter === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => setStandingFilter(chip.key)}
              className={`inline-flex items-center h-[34px] px-[14px] rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-accent text-white'
                  : 'bg-surface text-ink2 border border-line hover:bg-surfaceAlt'
              }`}
            >
              {chip.label} {chip.count}
            </button>
          );
        })}

        <div className="flex-1 min-w-0"></div>

        {/* Privacy Masking Toggle (AD-3, BR-4) */}
        <button
          type="button"
          onClick={() => setPrivacyMasked(!privacyMasked)}
          title="Toggle Privacy Masking under AD-3 / BR-4"
          className={`inline-flex items-center h-[34px] px-3 rounded-full text-[12px] font-semibold border cursor-pointer transition-colors ${
            privacyMasked
              ? 'bg-accentTint text-accent border-accent'
              : 'bg-surface text-ink3 border-line hover:text-ink'
          }`}
        >
          {privacyMasked ? 'Privacy Masked (AD-3)' : 'Mask Contacts (AD-3)'}
        </button>

        {missingPhoneCount > 0 && (
          <span className="text-[13px] font-bold text-accent whitespace-nowrap">
            {missingPhoneCount} phone numbers missing
          </span>
        )}
      </div>

      {/* Table container */}
      <div className="bg-surface border border-line rounded-card overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
        {/* Table header */}
        <div className="flex items-center gap-4 px-[22px] h-[44px] bg-surfaceAlt border-b border-line text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase select-none">
          <div className="w-4 flex-[0_0_16px] h-4 border border-line rounded-mark"></div>
          <div className="w-[200px] flex-[0_0_200px]">NAME</div>
          <div className="w-[188px] flex-[0_0_188px]">HOUSEHOLD</div>
          <div className="w-[100px] flex-[0_0_100px]">ROLE</div>
          <div className="w-[52px] flex-[0_0_52px]">AGE</div>
          <div className="w-[148px] flex-[0_0_148px]">PHONE</div>
          <div className="w-[128px] flex-[0_0_128px]">CARE GROUP</div>
          <div className="w-[172px] flex-[0_0_172px]">STATUS</div>
          <div className="w-[30px] flex-[0_0_30px]"></div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-lineSoft overflow-y-auto flex-1">
          {filteredPeople.length === 0 ? (
            <div className="p-8 text-center text-ink3 text-[13px]">
              No matching records found.
            </div>
          ) : (
            filteredPeople.map((person) => {
              const initials = person.full_name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={person.id}
                  onClick={() => onSelectPerson(person)}
                  className="flex items-center gap-4 px-[22px] h-[48px] hover:bg-surfaceAlt cursor-pointer transition-colors text-[13px]"
                >
                  <div className="w-4 flex-[0_0_16px] h-4 border border-line rounded-mark"></div>
                  <div className="w-[200px] flex-[0_0_200px] flex items-center gap-[10px] min-w-0">
                    <div className="w-[30px] h-[30px] flex-[0_0_30px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[10px] font-bold tracking-[0.02em]">
                      {initials}
                    </div>
                    <span className="font-semibold text-ink truncate">{person.full_name}</span>
                  </div>
                  <div className="w-[188px] flex-[0_0_188px] text-ink2 truncate">
                    {person.household_name || '—'}
                  </div>
                  <div className="w-[100px] flex-[0_0_100px] text-ink2">
                    {person.role_in_household || '—'}
                  </div>
                  <div className="w-[52px] flex-[0_0_52px] text-ink2">
                    {person.age ?? '—'}
                  </div>
                  <div className="w-[148px] flex-[0_0_148px] text-ink2 font-mono text-[12.5px]">
                    {maskPhoneNumber(person.phone, person.privacy_opt_in)}
                  </div>
                  <div className="w-[128px] flex-[0_0_128px] text-ink2 truncate">
                    {person.care_group_name || '—'}
                  </div>
                  <div className="w-[172px] flex-[0_0_172px]">
                    {renderStandingPill(person.standing)}
                  </div>
                  <div className="w-[30px] flex-[0_0_30px] text-ink3 flex justify-end">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="6" cy="12" r="1.3" fill="currentColor" stroke="none"/>
                      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>
                      <circle cx="18" cy="12" r="1.3" fill="currentColor" stroke="none"/>
                    </svg>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
