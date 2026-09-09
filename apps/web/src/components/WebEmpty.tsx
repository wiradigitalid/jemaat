import React from 'react';
import { UsersIcon, PlusIcon } from './Icons.tsx';

interface WebEmptyProps {
  onAddPerson: () => void;
  onHowHouseholdsWork?: () => void;
  onImportExcel?: () => void;
}

export const WebEmpty: React.FC<WebEmptyProps> = ({ onAddPerson, onHowHouseholdsWork }) => {
  const steps = [
    {
      num: '1',
      title: 'Add your church council or elders',
      desc: 'The leaders who govern the church and need access to governance roles.',
    },
    {
      num: '2',
      title: 'Add ministry heads and team leads',
      desc: 'Department heads for worship, ushering, multimedia, and children ministries.',
    },
    {
      num: '3',
      title: 'Add care group leaders and their members',
      desc: 'Small group shepherds who track weekly attendance and pastoral alerts.',
    },
    {
      num: '4',
      title: 'Add families and households',
      desc: 'Link parents and children so address updates apply to the whole family.',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
      {/* Left main guidance card */}
      <div className="flex-1 min-w-0 bg-surface border border-line rounded-card p-8 md:p-14 flex flex-col items-start">
        <div className="w-14 h-14 rounded-card bg-accentTint text-accent flex items-center justify-center">
          <UsersIcon size={30} strokeWidth={1.7} />
        </div>

        <h2 className="font-serif text-[27px] font-medium tracking-[-0.01em] mt-[22px] leading-[1.2] text-ink">
          Nothing here yet
        </h2>

        <div className="text-[14px] text-ink2 leading-[1.65] mt-[14px] max-w-[520px]">
          One thing is worth knowing before you type anything.{' '}
          <span className="font-bold text-ink">
            A household holds the address. A person holds their standing.
          </span>{' '}
          So change an address once and the whole family moves; change someone from Community to Registered and only they change.
        </div>

        <div className="text-[14px] text-ink2 leading-[1.65] mt-[14px] max-w-[520px]">
          Six fields per person, two of them optional. Nothing else is asked for, and nothing else has to be filled in later either.
        </div>

        <div className="flex flex-wrap gap-[11px] mt-[26px]">
          <button
            type="button"
            onClick={onAddPerson}
            className="flex items-center gap-2 h-[40px] px-[18px] rounded-input bg-accent text-white font-semibold text-[13px] hover:bg-accentDark transition-colors cursor-pointer"
          >
            <PlusIcon size={17} strokeWidth={1.7} />
            <span>Add the first person</span>
          </button>
          <button
            type="button"
            onClick={onHowHouseholdsWork}
            className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line font-semibold text-[13px] text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
          >
            <span>How households work</span>
          </button>
        </div>

        <div className="text-[12px] text-ink3 leading-[1.6] mt-[26px] max-w-[520px]">
          Bulk import from a spreadsheet arrives in the next release. Until then this is typing — which is why the order on the right matters more than the total.
        </div>
      </div>

      {/* Right side guide card */}
      <div className="w-full lg:w-[428px] lg:flex-[0_0_428px] bg-surface border border-line rounded-card border-opacity-70">
        <div className="p-[16px_18px_10px]">
          <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-ink3">
            An hour, in this order
          </div>
          <div className="text-[12px] text-ink2 mt-[7px] leading-[1.55]">
            The register does not have to be complete to be useful. It has to be useful before it is complete, or nobody finishes it.
          </div>
        </div>

        <div className="divide-y divide-lineSoft">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-[14px] p-[12px_18px]">
              <span className="w-6 h-6 flex-[0_0_24px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[12px] font-bold">
                {step.num}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink">{step.title}</div>
                <div className="text-[12px] text-ink3 mt-1 leading-[1.45]">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
