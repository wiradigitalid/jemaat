import React, { useState } from 'react';
import { Person } from '../types.ts';
import { CheckIcon } from './Icons.tsx';

interface WebMergeProps {
  primaryPerson?: Person;
  secondaryPerson?: Person;
  onDismiss: () => void;
  onMergeComplete: (merged: Partial<Person>) => void;
}

export const WebMerge: React.FC<WebMergeProps> = ({
  primaryPerson,
  secondaryPerson,
  onDismiss,
  onMergeComplete,
}) => {
  const p1: Person = primaryPerson || {
    id: 'per-001',
    full_name: 'Budi Halim',
    phone: '0812-1122-3344',
    date_of_birth: '2 May 1977',
    household_name: 'Halim household',
    care_group_name: 'Anugerah',
    standing: 'Registered Member',
    lifecycle: 'Active',
    privacy_opt_in: false,
  };

  const p2: Person = secondaryPerson || {
    id: 'per-999',
    full_name: 'B. Halim',
    phone: '0812-1122-3344',
    date_of_birth: '',
    household_name: 'Keluarga Halim',
    care_group_name: '',
    standing: 'Member',
    lifecycle: 'Active',
    privacy_opt_in: false,
  };

  const [chosenName, setChosenName] = useState<'left' | 'right'>('left');
  const [chosenDob, setChosenDob] = useState<'left' | 'right'>('left');
  const [chosenPhone, setChosenPhone] = useState<'left' | 'right'>('left');
  const [chosenHousehold, setChosenHousehold] = useState<'left' | 'right'>('left');
  const [chosenCareGroup, setChosenCareGroup] = useState<'left' | 'right'>('left');

  const handleMerge = () => {
    const merged: Partial<Person> = {
      id: p1.id,
      full_name: chosenName === 'left' ? p1.full_name : p2.full_name,
      phone: chosenPhone === 'left' ? p1.phone : p2.phone,
      date_of_birth: chosenDob === 'left' ? p1.date_of_birth : p2.date_of_birth,
      household_name: chosenHousehold === 'left' ? p1.household_name : p2.household_name,
      care_group_name: chosenCareGroup === 'left' ? p1.care_group_name : p2.care_group_name,
    };
    onMergeComplete(merged);
  };

  return (
    <div className="flex flex-col gap-[18px] flex-1 min-h-0">
      {/* Top Header */}
      <div className="flex items-end justify-between gap-[10px] pb-2 flex-wrap">
        <div>
          <h1 className="font-serif text-[27px] font-medium tracking-[-0.015em] text-ink m-0">
            Two records, one person
          </h1>
          <div className="text-[13px] text-ink2 mt-1">
            Flagged by duplicate detection. Choose the primary field values for the merged master record.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
          >
            <span>Not the same person</span>
          </button>
          <button
            type="button"
            onClick={handleMerge}
            className="flex items-center gap-2 h-[40px] px-[18px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark transition-colors cursor-pointer"
          >
            <CheckIcon size={14} strokeWidth={2.5} />
            <span>Merge into one</span>
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-surface border border-line rounded-card overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Table Header with User Profiles */}
        <div className="flex items-start gap-[14px] p-[16px_18px] bg-surfaceAlt border-b border-line">
          <div className="w-[104px] flex-[0_0_104px]"></div>
          {/* Left Record */}
          <div className="flex-1 flex items-center gap-[11px] min-w-0">
            <div className="w-[38px] h-[38px] flex-[0_0_38px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[12px] font-bold tracking-[0.02em]">
              BH
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-ink truncate">{p1.full_name}</div>
              <div className="text-[11px] text-ink3 mt-[2px]">Existing Master &middot; Registered</div>
            </div>
          </div>

          {/* Right Record */}
          <div className="flex-1 flex items-center gap-[11px] min-w-0">
            <div className="w-[38px] h-[38px] flex-[0_0_38px] rounded-full bg-bg text-ink3 flex items-center justify-center text-[12px] font-bold tracking-[0.02em]">
              BH
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-ink truncate">{p2.full_name}</div>
              <div className="text-[11px] text-ink3 mt-[2px]">Import Candidate &middot; Unlinked</div>
            </div>
          </div>

          <div className="w-[186px] flex-[0_0_186px] text-[10px] font-bold tracking-[0.07em] text-ink3 uppercase">
            WHY IT MATTERS
          </div>
        </div>

        {/* Row 1: Name */}
        <div className="flex items-start gap-[14px] p-[11px_18px] border-b border-lineSoft">
          <div className="w-[104px] flex-[0_0_104px] text-[10px] font-bold tracking-[0.07em] text-ink3 pt-1">
            NAME
          </div>
          <div
            onClick={() => setChosenName('left')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenName === 'left' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenName === 'left' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p1.full_name}
            </span>
          </div>
          <div
            onClick={() => setChosenName('right')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenName === 'right' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenName === 'right' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p2.full_name}
            </span>
          </div>
          <div className="w-[186px] flex-[0_0_186px] text-[11px] text-ink3 leading-[1.4]">
            Keep the complete official full name without spreadsheet abbreviations.
          </div>
        </div>

        {/* Row 2: Born */}
        <div className="flex items-start gap-[14px] p-[11px_18px] border-b border-lineSoft">
          <div className="w-[104px] flex-[0_0_104px] text-[10px] font-bold tracking-[0.07em] text-ink3 pt-1">
            BORN
          </div>
          <div
            onClick={() => setChosenDob('left')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenDob === 'left' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenDob === 'left' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p1.date_of_birth || 'empty'}
            </span>
          </div>
          <div
            onClick={() => setChosenDob('right')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenDob === 'right' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenDob === 'right' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p2.date_of_birth || 'empty'}
            </span>
          </div>
          <div className="w-[186px] flex-[0_0_186px] text-[11px] text-ink3 leading-[1.4]">
            Never lose a valid date to an empty field from recent imports.
          </div>
        </div>

        {/* Row 3: Phone */}
        <div className="flex items-start gap-[14px] p-[11px_18px] border-b border-lineSoft">
          <div className="w-[104px] flex-[0_0_104px] text-[10px] font-bold tracking-[0.07em] text-ink3 pt-1">
            PHONE
          </div>
          <div
            onClick={() => setChosenPhone('left')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenPhone === 'left' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenPhone === 'left' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p1.phone}
            </span>
          </div>
          <div
            onClick={() => setChosenPhone('right')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenPhone === 'right' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenPhone === 'right' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p2.phone}
            </span>
          </div>
          <div className="w-[186px] flex-[0_0_186px] text-[11px] text-ink3 leading-[1.4]">
            Normalized phone number is identical (+6281211223344).
          </div>
        </div>

        {/* Row 4: Household */}
        <div className="flex items-start gap-[14px] p-[11px_18px] border-b border-lineSoft">
          <div className="w-[104px] flex-[0_0_104px] text-[10px] font-bold tracking-[0.07em] text-ink3 pt-1">
            HOUSEHOLD
          </div>
          <div
            onClick={() => setChosenHousehold('left')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenHousehold === 'left' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenHousehold === 'left' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p1.household_name || 'Unassigned'}
            </span>
          </div>
          <div
            onClick={() => setChosenHousehold('right')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenHousehold === 'right' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenHousehold === 'right' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p2.household_name || 'Unassigned'}
            </span>
          </div>
          <div className="w-[186px] flex-[0_0_186px] text-[11px] text-ink3 leading-[1.4]">
            Retains existing registered household address linkages.
          </div>
        </div>

        {/* Row 5: Care Group */}
        <div className="flex items-start gap-[14px] p-[11px_18px] border-b border-lineSoft">
          <div className="w-[104px] flex-[0_0_104px] text-[10px] font-bold tracking-[0.07em] text-ink3 pt-1">
            CARE GROUP
          </div>
          <div
            onClick={() => setChosenCareGroup('left')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenCareGroup === 'left' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenCareGroup === 'left' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p1.care_group_name || 'Unassigned'}
            </span>
          </div>
          <div
            onClick={() => setChosenCareGroup('right')}
            className="flex-1 flex items-center gap-2 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 rounded-full border-[5px] ${chosenCareGroup === 'right' ? 'border-accent bg-white' : 'border-line'}`}></div>
            <span className={`text-[12px] ${chosenCareGroup === 'right' ? 'font-bold text-ink' : 'text-ink2'}`}>
              {p2.care_group_name || 'Unassigned'}
            </span>
          </div>
          <div className="w-[186px] flex-[0_0_186px] text-[11px] text-ink3 leading-[1.4]">
            Keep small group fellowship assignment.
          </div>
        </div>
      </div>
    </div>
  );
};
