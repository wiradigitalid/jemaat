import React from 'react';
import { Person, LifecycleStatus } from '../types.ts';

interface WebPersonProps {
  person: Person;
  onBack: () => void;
  onUpdateLifecycle?: (newLifecycle: LifecycleStatus) => void;
}

export const WebPerson: React.FC<WebPersonProps> = ({
  person,
  onBack,
  onUpdateLifecycle,
}) => {
  const initials = person.full_name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const lifecycleOptions: Array<{ key: LifecycleStatus; label: string; desc: string }> = [
    { key: 'Active', label: 'Active', desc: 'Appears everywhere, counted in every total' },
    { key: 'Inactive', label: 'Inactive', desc: 'Not seen for months. Stays in the directory, drops out of reminders' },
    { key: 'Transferred out', label: 'Transferred out', desc: 'Moved to another church with a letter. History stays here' },
    { key: 'Passed away', label: 'Passed away', desc: 'Standing and lifecycle are separate fields. Remains a record of this church' },
  ];

  return (
    <div className="flex flex-col gap-[18px] flex-1 min-h-0">
      {/* Back button link */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-[12px] font-semibold text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          &larr; Back to people directory
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
        {/* Left Column: Details & History */}
        <div className="flex-1 min-w-0 flex flex-col gap-[18px] overflow-y-auto">
          {/* Standing & Identity Card */}
          <div className="bg-surface border border-line rounded-card overflow-hidden">
            <div className="p-[18px_16px_14px] flex items-center gap-[14px]">
              <div className="w-[52px] h-[52px] flex-[0_0_52px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[17px] font-bold tracking-[0.02em]">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[9px] flex-wrap">
                  <span className="inline-flex items-center h-6 px-[9px] rounded-full bg-sageTint text-sage text-[11px] font-bold tracking-[0.02em]">
                    {person.standing}
                  </span>
                  <span className="inline-flex items-center h-6 px-[9px] rounded-full bg-bg text-ink2 border border-line text-[11px] font-bold">
                    {person.lifecycle}
                  </span>
                </div>
                <div className="text-[12px] text-ink3 mt-[7px]">
                  Standing and lifecycle are separate fields. Member remains on record with historic footprint.
                </div>
              </div>
            </div>

            <div className="divide-y divide-lineSoft border-t border-lineSoft">
              <div className="flex items-baseline gap-4 p-[11px_16px]">
                <span className="w-[130px] flex-[0_0_130px] text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                  BORN
                </span>
                <span className="flex-1 text-[13px] font-semibold text-ink">
                  {person.date_of_birth || '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-4 p-[11px_16px]">
                <span className="w-[130px] flex-[0_0_130px] text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                  PHONE
                </span>
                <span className="flex-1 text-[13px] font-semibold text-ink font-mono">
                  {person.phone || '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-4 p-[11px_16px]">
                <span className="w-[130px] flex-[0_0_130px] text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                  HOUSEHOLD
                </span>
                <span className="flex-1 text-[13px] font-semibold text-ink">
                  {person.household_name ? `${person.household_name} · ${person.role_in_household || 'Member'}` : '—'}
                </span>
              </div>

              <div className="flex items-baseline gap-4 p-[11px_16px]">
                <span className="w-[130px] flex-[0_0_130px] text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                  CARE GROUP
                </span>
                <span className="flex-1 text-[13px] font-semibold text-ink">
                  {person.care_group_name || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* History Card */}
          <div className="bg-surface border border-line rounded-card overflow-hidden">
            <div className="p-[14px_16px_8px]">
              <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink3">
                History — kept in full
              </div>
            </div>
            <div className="divide-y divide-lineSoft border-t border-lineSoft">
              <div className="flex items-baseline gap-4 p-[11px_16px]">
                <span className="w-[130px] flex-[0_0_130px] text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                  ATTENDANCE
                </span>
                <span className="flex-1 text-[13px] font-semibold text-ink">
                  184 meetings recorded (2021 to 2026)
                </span>
              </div>
              <div className="flex items-baseline gap-4 p-[11px_16px]">
                <span className="w-[130px] flex-[0_0_130px] text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                  HOSTED
                </span>
                <span className="flex-1 text-[13px] font-semibold text-ink">
                  11 care group evenings
                </span>
              </div>
              <div className="flex items-baseline gap-4 p-[11px_16px]">
                <span className="w-[130px] flex-[0_0_130px] text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase">
                  SERVED
                </span>
                <span className="flex-1 text-[13px] font-semibold text-ink">
                  Hospitality team &middot; Welcome Desk
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Lifecycle in this church */}
        <div className="w-full lg:w-[428px] lg:flex-[0_0_428px] flex flex-col gap-[18px]">
          <div className="bg-surface border border-line rounded-card overflow-hidden">
            <div className="p-[14px_16px_8px]">
              <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink3">
                Lifecycle in this church
              </div>
            </div>
            <div className="divide-y divide-lineSoft border-t border-lineSoft">
              {lifecycleOptions.map((opt) => {
                const isCurrent = person.lifecycle === opt.key;
                return (
                  <div
                    key={opt.key}
                    onClick={() => onUpdateLifecycle && onUpdateLifecycle(opt.key)}
                    className="flex items-start gap-3 p-[13px_16px] hover:bg-surfaceAlt cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-[18px] h-[18px] flex-[0_0_18px] rounded-full mt-[2px] transition-all ${
                        isCurrent
                          ? 'border-[5.5px] border-accent bg-white'
                          : 'border-[1.5px] border-line'
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-semibold ${isCurrent ? 'text-accent' : 'text-ink'}`}>
                        {opt.label}
                      </div>
                      <div className="text-[11px] text-ink3 mt-[3px] leading-[1.4]">{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
