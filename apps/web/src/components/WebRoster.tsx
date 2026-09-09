import React, { useState } from 'react';
import { RosterMatrix, RosterAssignment } from '../types.ts';
import { CalendarIcon, ChatIcon, PlusIcon } from './Icons.tsx';

interface WebRosterProps {
  matrix?: RosterMatrix;
  onViewDepartments?: () => void;
  onAssignSlot?: (serviceId: string, teamName: string) => void;
  onAssignSubstitute?: (assignmentId: string, volunteerName: string) => void;
  onSendReminders?: () => void;
}

const defaultMatrix: RosterMatrix = {
  month: 'March 2026',
  services: [
    { id: 'srv-01', name: 'Sunday 09:00', date: '2026-03-07', date_label: 'SAT 7 MAR', time_slot: '09:00' },
    { id: 'srv-02', name: 'Sunday 09:00', date: '2026-03-14', date_label: 'SAT 14 MAR', time_slot: '09:00' },
    { id: 'srv-03', name: 'Sunday 09:00', date: '2026-03-21', date_label: 'SAT 21 MAR', time_slot: '09:00' },
    { id: 'srv-04', name: 'Sunday 09:00', date: '2026-03-28', date_label: 'SAT 28 MAR', time_slot: '09:00' },
  ],
  teams: ['Media', 'Music', 'Hospitality', 'Preaching'],
  summary: {
    open_slots: 3,
    not_confirmed: 4,
    confirmed: 19,
    declined: 0,
  },
  assignments: [
    // Media assignments
    {
      id: 'asg-01',
      service_id: 'srv-01',
      service_date: '2026-03-07',
      date_label: 'SAT 7 MAR',
      team_id: 'team-02',
      team_name: 'Media',
      role_id: 'role-202',
      role_name: 'Slides',
      person_name: 'Gavriel Halim',
      person_initials: 'GH',
      status: 'confirmed',
      notes_list: ['Slides', 'Sound: Fandi T.'],
      notes: 'Sound: Fandi T.',
    },
    {
      id: 'asg-02',
      service_id: 'srv-02',
      service_date: '2026-03-14',
      date_label: 'SAT 14 MAR',
      team_id: 'team-02',
      team_name: 'Media',
      role_id: 'role-202',
      role_name: 'Slides',
      person_name: 'Andreas Wibowo',
      person_initials: 'AW',
      status: 'confirmed',
      notes_list: ['Slides', 'Sound: Fandi T.'],
      notes: 'Sound: Fandi T.',
    },
    {
      id: 'asg-03',
      service_id: 'srv-03',
      service_date: '2026-03-21',
      date_label: 'SAT 21 MAR',
      team_id: 'team-02',
      team_name: 'Media',
      role_id: 'role-201',
      role_name: 'Sound desk unfilled',
      person_name: '—',
      person_initials: '+',
      status: 'open',
      notes: 'Sound desk unfilled',
    },
    {
      id: 'asg-04',
      service_id: 'srv-04',
      service_date: '2026-03-28',
      date_label: 'SAT 28 MAR',
      team_id: 'team-02',
      team_name: 'Media',
      role_id: 'role-202',
      role_name: 'Slides',
      person_name: 'Gavriel Halim',
      person_initials: 'GH',
      status: 'pending',
      notes: 'Not confirmed',
    },
    // Music assignments
    {
      id: 'asg-05',
      service_id: 'srv-01',
      service_date: '2026-03-07',
      date_label: 'SAT 7 MAR',
      team_id: 'team-01',
      team_name: 'Music',
      role_id: 'role-101',
      role_name: 'Worship lead',
      person_name: 'Melisa Halim',
      person_initials: 'MH',
      status: 'confirmed',
      notes_list: ['Worship lead', 'Keys: Kayla H.'],
      notes: 'Keys: Kayla H.',
    },
    {
      id: 'asg-06',
      service_id: 'srv-02',
      service_date: '2026-03-14',
      date_label: 'SAT 14 MAR',
      team_id: 'team-01',
      team_name: 'Music',
      role_id: 'role-101',
      role_name: 'Worship lead',
      person_name: 'Grace Sutanto',
      person_initials: 'GS',
      status: 'confirmed',
      notes_list: ['Worship lead', 'Keys: Melisa H.'],
      notes: 'Keys: Melisa H.',
    },
    {
      id: 'asg-07',
      service_id: 'srv-03',
      service_date: '2026-03-21',
      date_label: 'SAT 21 MAR',
      team_id: 'team-01',
      team_name: 'Music',
      role_id: 'role-103',
      role_name: 'Keys, guest pianist',
      person_name: 'Rio Panjaitan',
      person_initials: 'RP',
      status: 'confirmed',
      is_external: true,
      notes_list: ['Keys, guest pianist'],
      notes: 'Not on our roll',
    },
    {
      id: 'asg-08',
      service_id: 'srv-04',
      service_date: '2026-03-28',
      date_label: 'SAT 28 MAR',
      team_id: 'team-01',
      team_name: 'Music',
      role_id: 'role-101',
      role_name: 'Worship lead',
      person_name: 'Grace Sutanto',
      person_initials: 'GS',
      status: 'pending',
      notes: 'Not confirmed',
    },
    // Hospitality assignments
    {
      id: 'asg-09',
      service_id: 'srv-01',
      service_date: '2026-03-07',
      date_label: 'SAT 7 MAR',
      team_id: 'team-05',
      team_name: 'Hospitality',
      role_id: 'role-501',
      role_name: 'Welcome desk',
      person_name: 'Intan Prasetyo',
      person_initials: 'IP',
      status: 'confirmed',
      notes_list: ['Welcome desk', 'Ushers: 3 rostered'],
      notes: 'Ushers: 3 rostered',
    },
    {
      id: 'asg-10',
      service_id: 'srv-02',
      service_date: '2026-03-14',
      date_label: 'SAT 14 MAR',
      team_id: 'team-05',
      team_name: 'Hospitality',
      role_id: 'role-501',
      role_name: 'Welcome desk',
      person_name: 'Ruth Simanjuntak',
      person_initials: 'RS',
      status: 'confirmed',
      notes_list: ['Welcome desk', 'Ushers: 3 rostered'],
      notes: 'Ushers: 3 rostered',
    },
    {
      id: 'asg-11',
      service_id: 'srv-03',
      service_date: '2026-03-21',
      date_label: 'SAT 21 MAR',
      team_id: 'team-05',
      team_name: 'Hospitality',
      role_id: 'role-501',
      role_name: 'Welcome desk',
      person_name: 'Intan Prasetyo',
      person_initials: 'IP',
      status: 'confirmed',
      notes_list: ['Welcome desk', 'Ushers: 2 rostered'],
      notes: 'Ushers: 2 rostered',
    },
    {
      id: 'asg-12',
      service_id: 'srv-04',
      service_date: '2026-03-28',
      date_label: 'SAT 28 MAR',
      team_id: 'team-05',
      team_name: 'Hospitality',
      role_id: 'role-501',
      role_name: 'Welcome desk',
      person_name: '—',
      person_initials: '+',
      status: 'open',
      notes: 'No welcome desk yet',
    },
    // Preaching assignments
    {
      id: 'asg-13',
      service_id: 'srv-01',
      service_date: '2026-03-07',
      date_label: 'SAT 7 MAR',
      team_id: 'team-04',
      team_name: 'Preaching',
      role_id: 'role-401',
      role_name: 'Speaker',
      person_name: 'Samuel Kartono',
      person_initials: 'SK',
      status: 'confirmed',
      is_external: true,
      notes_list: ['Growing in Prayer 2'],
      notes: 'Growing in Prayer 2',
    },
    {
      id: 'asg-14',
      service_id: 'srv-02',
      service_date: '2026-03-14',
      date_label: 'SAT 14 MAR',
      team_id: 'team-04',
      team_name: 'Preaching',
      role_id: 'role-401',
      role_name: 'Speaker',
      person_name: 'Samuel Kartono',
      person_initials: 'SK',
      status: 'confirmed',
      is_external: true,
      notes_list: ['Growing in Prayer 3'],
      notes: 'Growing in Prayer 3',
    },
    {
      id: 'asg-15',
      service_id: 'srv-03',
      service_date: '2026-03-21',
      date_label: 'SAT 21 MAR',
      team_id: 'team-04',
      team_name: 'Preaching',
      role_id: 'role-401',
      role_name: 'Speaker',
      person_name: 'Budi Halim',
      person_initials: 'BH',
      status: 'confirmed',
      notes_list: ['Growing in Prayer 4'],
      notes: 'Growing in Prayer 4',
    },
    {
      id: 'asg-16',
      service_id: 'srv-04',
      service_date: '2026-03-28',
      date_label: 'SAT 28 MAR',
      team_id: 'team-04',
      team_name: 'Preaching',
      role_id: 'role-401',
      role_name: 'Speaker',
      person_name: '—',
      person_initials: '+',
      status: 'open',
      notes: 'Speaker not assigned',
    },
  ],
};

export const WebRoster: React.FC<WebRosterProps> = ({
  matrix = defaultMatrix,
  onViewDepartments,
  onAssignSlot,
  onAssignSubstitute,
  onSendReminders,
}) => {
  const [currentMatrix, setCurrentMatrix] = useState<RosterMatrix>(matrix);
  const [selectedSlot, setSelectedSlot] = useState<RosterAssignment | null>(null);
  const [substituteModal, setSubstituteModal] = useState(false);
  const [substituteName, setSubstituteName] = useState('Andreas Wibowo');
  const [slotPickerModal, setSlotPickerModal] = useState(false);
  const [slotVolunteerName, setSlotVolunteerName] = useState('');
  const [activeOpenSlotTarget, setActiveOpenSlotTarget] = useState<{ serviceId: string; teamName: string; note: string } | null>(null);
  const [isOverride, setIsOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [reminderToast, setReminderToast] = useState(false);

  // Evaluate conflict prevention engine (BR-2, AD-4)
  const getConflictWarning = (name: string, targetServiceId: string): string | null => {
    if (!name.trim()) return null;
    const lower = name.toLowerCase().trim();

    // 1. Blockout check (BR-2)
    if (lower.includes('melisa') && targetServiceId === 'srv-04') {
      return 'Blocked out from 2026-03-27 to 2026-03-31: Out of town for family retreat in Bandung';
    }
    if (lower.includes('gavriel') && targetServiceId === 'srv-04') {
      return 'Blocked out from 2026-03-25 to 2026-03-30: College final exams prep';
    }

    // 2. Overlapping duty check (AD-4)
    const existing = currentMatrix.assignments.find(
      (a) =>
        a.service_id === targetServiceId &&
        a.person_name.toLowerCase().trim() === lower &&
        a.status !== 'open' &&
        a.status !== 'declined'
    );
    if (existing) {
      return `Already scheduled in ${existing.team_name} for ${existing.role_name} (${existing.date_label})`;
    }

    return null;
  };

  const detectedConflict = activeOpenSlotTarget
    ? getConflictWarning(slotVolunteerName, activeOpenSlotTarget.serviceId)
    : null;

  const teamMeta: Record<string, { icon: string; meta: string }> = {
    Media: { icon: 'M', meta: '6 volunteers · slides, sound' },
    Music: { icon: 'M', meta: '9 volunteers · 1 guest' },
    Hospitality: { icon: 'H', meta: '11 volunteers · welcome, ushers' },
    Preaching: { icon: 'P', meta: '4 speakers · 2 from outside' },
  };

  const handleCellClick = (asg?: RosterAssignment, serviceId?: string, teamName?: string) => {
    if (!asg || asg.status === 'open') {
      if (serviceId && teamName) {
        setActiveOpenSlotTarget({ serviceId, teamName, note: asg?.notes || 'Unassigned slot' });
        setSlotPickerModal(true);
        if (onAssignSlot) {
          onAssignSlot(serviceId, teamName);
        }
      }
      return;
    }
    setSelectedSlot(asg);
    // Allow substitute assignment on declined or pending slots
    if (asg.status === 'declined' || asg.status === 'pending') {
      setSubstituteModal(true);
    }
  };

  const handleSubstituteSubmit = () => {
    if (selectedSlot && substituteName.trim()) {
      const name = substituteName.trim();
      const parts = name.split(' ');
      const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();

      // Update local matrix state
      setCurrentMatrix((prev) => ({
        ...prev,
        assignments: prev.assignments.map((a) =>
          a.id === selectedSlot.id
            ? {
                ...a,
                person_name: name,
                person_initials: initials,
                substitute_person_name: name,
                status: 'confirmed',
                notes: `Substitute for ${selectedSlot.person_name}: ${name}`,
              }
            : a
        ),
        summary: {
          ...prev.summary,
          not_confirmed: Math.max(0, prev.summary.not_confirmed - 1),
          confirmed: prev.summary.confirmed + 1,
        },
      }));

      if (onAssignSubstitute) {
        onAssignSubstitute(selectedSlot.id, name);
      }
    }
    setSubstituteModal(false);
    setSelectedSlot(null);
  };

  const handleSlotAssignSubmit = () => {
    if (activeOpenSlotTarget && slotVolunteerName.trim()) {
      // If conflict detected, mandate override and reason code (BR-SRV-3, AD-4)
      if (detectedConflict && (!isOverride || !overrideReason.trim())) {
        return;
      }

      const name = slotVolunteerName.trim();
      const parts = name.split(' ');
      const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();

      setCurrentMatrix((prev) => ({
        ...prev,
        assignments: prev.assignments.map((a) =>
          a.team_name === activeOpenSlotTarget.teamName && a.service_id === activeOpenSlotTarget.serviceId
            ? {
                ...a,
                person_name: name,
                person_initials: initials,
                status: 'confirmed',
                has_conflict: !!detectedConflict,
                is_overridden: isOverride,
                override_reason: overrideReason,
                notes: isOverride ? `Overridden: ${overrideReason}` : 'Assigned duty',
              }
            : a
        ),
        summary: {
          ...prev.summary,
          open_slots: Math.max(0, prev.summary.open_slots - 1),
          confirmed: prev.summary.confirmed + 1,
        },
      }));
    }
    setSlotPickerModal(false);
    setActiveOpenSlotTarget(null);
    setSlotVolunteerName('');
    setIsOverride(false);
    setOverrideReason('');
  };

  const handleReminders = () => {
    setReminderToast(true);
    setTimeout(() => setReminderToast(false), 3000);
    if (onSendReminders) onSendReminders();
  };

  return (
    <div className="flex flex-col gap-[18px] flex-1 min-h-0">
      {/* Top Header */}
      <div className="flex items-end justify-between gap-[10px] pb-2 flex-wrap">
        <div>
          <h1 className="font-serif text-[27px] font-medium tracking-[-0.015em] text-ink m-0">
            Serving roster
          </h1>
          <div className="text-[13px] text-ink2 mt-1">
            {currentMatrix.month} &middot; {currentMatrix.teams.length} teams &middot; {currentMatrix.services.length} service dates &middot; 2 slots filled from outside
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
          >
            <CalendarIcon size={16} strokeWidth={1.8} />
            <span>March 2026</span>
          </button>

          {onViewDepartments && (
            <button
              type="button"
              onClick={onViewDepartments}
              className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
            >
              <span>View Departments</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReminders}
            className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
          >
            <ChatIcon size={17} strokeWidth={1.7} />
            <span>Send WhatsApp reminders</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveOpenSlotTarget({ serviceId: 'srv-03', teamName: 'Media', note: 'Add volunteer duty' });
              setSlotPickerModal(true);
            }}
            className="flex items-center gap-2 h-[40px] px-[18px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark transition-colors cursor-pointer"
          >
            <PlusIcon size={17} strokeWidth={1.7} />
            <span>Add duty</span>
          </button>
        </div>
      </div>

      {reminderToast && (
        <div className="p-3 bg-sageTint border border-sage/30 text-sage text-[13px] rounded-input">
          WhatsApp reminder notifications dispatched to 4 pending volunteers.
        </div>
      )}

      {/* Summary Chips matching WebRoster.dc.html */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="inline-flex items-center h-[30px] px-3 rounded-full bg-amberTint text-amber text-[12px] font-bold">
          {currentMatrix.summary.open_slots} open slots
        </span>
        <span className="inline-flex items-center h-[30px] px-3 rounded-full bg-surface text-ink2 border border-line text-[12px] font-bold">
          {currentMatrix.summary.not_confirmed} not confirmed
        </span>
        <span className="inline-flex items-center h-[30px] px-3 rounded-full bg-sageTint text-sage text-[12px] font-bold">
          {currentMatrix.summary.confirmed} confirmed
        </span>
      </div>

      {/* Roster Grid Matrix matching WebRoster.dc.html */}
      <div className="bg-surface border border-line rounded-card overflow-hidden flex flex-col flex-1 min-h-0 shadow-sm">
        {/* Table Column Headers */}
        <div className="flex h-11 items-center bg-surfaceAlt border-b border-line text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase select-none">
          <div className="w-[230px] flex-[0_0_230px] px-[18px]">TEAM</div>
          {currentMatrix.services.map((srv) => (
            <div key={srv.id} className="flex-1 px-3 border-l border-lineSoft truncate">
              {srv.date_label}
            </div>
          ))}
        </div>

        {/* Rows grouped by Team */}
        <div className="divide-y divide-line overflow-y-auto flex-1">
          {currentMatrix.teams.map((teamName) => {
            const meta = teamMeta[teamName] || { icon: teamName[0], meta: 'Ministry team' };
            return (
              <div key={teamName} className="flex min-h-[98px]">
                {/* Team Column Cell */}
                <div className="w-[230px] flex-[0_0_230px] p-[13px_18px] flex items-center gap-[11px] bg-surface">
                  <div className="w-9 h-9 flex-[0_0_36px] rounded-input bg-accentTint text-accent flex items-center justify-center text-xs font-bold">
                    {meta.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-ink">{teamName}</div>
                    <div className="text-[11px] text-ink3 mt-0.5 truncate">{meta.meta}</div>
                  </div>
                </div>

                {/* Service Date Columns */}
                {currentMatrix.services.map((srv) => {
                  const asg = currentMatrix.assignments.find(
                    (a) => a.team_name === teamName && a.service_id === srv.id
                  );

                  if (!asg || asg.status === 'open') {
                    return (
                      <div
                        key={srv.id}
                        onClick={() => handleCellClick(asg, srv.id, teamName)}
                        className="flex-1 p-[11px_12px] border-l border-lineSoft flex flex-col justify-center gap-1.5 bg-[#F7EEDD88] hover:bg-amberTint cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-amber text-[12px] font-bold">
                          <PlusIcon size={14} strokeWidth={2.2} />
                          <span>Open slot</span>
                        </div>
                        <div className="text-[11px] text-ink3">
                          {asg?.notes || 'Volunteer unfilled'}
                        </div>
                      </div>
                    );
                  }

                  // External guest volunteer cell
                  if (asg.is_external) {
                    return (
                      <div
                        key={srv.id}
                        onClick={() => handleCellClick(asg, srv.id, teamName)}
                        className="flex-1 p-[11px_12px] border-l border-lineSoft flex flex-col justify-center gap-1.5 hover:bg-surfaceAlt cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 flex-[0_0_24px] rounded-full border border-dashed border-ink3 bg-surfaceAlt text-ink2 flex items-center justify-center text-[8px] font-bold">
                            {asg.person_initials}
                          </div>
                          <span className="text-[13px] font-semibold text-ink truncate">
                            {asg.person_name}
                          </span>
                        </div>
                        {asg.notes_list ? (
                          asg.notes_list.map((note, idx) => (
                            <div key={idx} className="text-[11px] text-ink2 truncate">{note}</div>
                          ))
                        ) : asg.notes ? (
                          <div className="text-[11px] text-ink2 truncate">{asg.notes}</div>
                        ) : null}
                        <div className="flex">
                          <span className="inline-flex items-center h-[20px] px-[7px] rounded-full border border-dashed border-ink3 text-ink3 text-[10px] font-bold">
                            Not on our roll
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Pending volunteer cell
                  if (asg.status === 'pending') {
                    return (
                      <div
                        key={srv.id}
                        onClick={() => handleCellClick(asg, srv.id, teamName)}
                        className="flex-1 p-[11px_12px] border-l border-lineSoft flex flex-col justify-center gap-1.5 hover:bg-surfaceAlt cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 flex-[0_0_24px] rounded-full bg-[#FAF7F2] text-ink3 flex items-center justify-center text-[8px] font-bold">
                            {asg.person_initials}
                          </div>
                          <span className="text-[13px] font-semibold text-ink2 truncate">
                            {asg.person_name}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="inline-flex items-center h-[22px] px-2 rounded-full border border-dashed border-ink3 text-ink3 text-[10.5px] font-bold">
                            Not confirmed
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Declined volunteer cell
                  if (asg.status === 'declined') {
                    return (
                      <div
                        key={srv.id}
                        onClick={() => handleCellClick(asg, srv.id, teamName)}
                        className="flex-1 p-[11px_12px] border-l border-lineSoft flex flex-col justify-center gap-1.5 hover:bg-surfaceAlt cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 flex-[0_0_24px] rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[8px] font-bold">
                            {asg.person_initials}
                          </div>
                          <span className="text-[13px] font-semibold text-ink truncate">
                            {asg.person_name}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="inline-flex items-center h-[22px] px-2 rounded-full bg-red-50 text-red-700 text-[10.5px] font-bold">
                            Declined
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Confirmed volunteer cell
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleCellClick(asg, srv.id, teamName)}
                      className="flex-1 p-[11px_12px] border-l border-lineSoft flex flex-col justify-center gap-1.5 hover:bg-surfaceAlt cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 flex-[0_0_24px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[8px] font-bold">
                          {asg.person_initials}
                        </div>
                        <span className="text-[13px] font-semibold text-ink truncate">
                          {asg.person_name}
                        </span>
                      </div>
                      {asg.notes_list ? (
                        asg.notes_list.map((note, idx) => (
                          <div key={idx} className="text-[11px] text-ink2 truncate">{note}</div>
                        ))
                      ) : (
                        <>
                          <div className="text-[11px] text-ink2 truncate">{asg.role_name}</div>
                          {asg.notes && <div className="text-[11px] text-ink3 truncate">{asg.notes}</div>}
                        </>
                      )}
                      {asg.is_overridden && (
                        <div className="flex">
                          <span className="inline-flex items-center h-[20px] px-1.5 rounded bg-amberTint text-amber text-[10px] font-bold">
                            Overridden
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Substitute Assignment Modal (UC-10) */}
      {substituteModal && selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] bg-bg rounded-card border border-line shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="text-[16px] font-bold text-ink m-0">Assign Substitute Volunteer</h3>
            <div className="text-[13px] text-ink2 leading-[1.5]">
              Slot: <span className="font-semibold">{selectedSlot.role_name}</span> in{' '}
              <span className="font-semibold">{selectedSlot.team_name}</span> on{' '}
              <span className="font-semibold">{selectedSlot.date_label}</span>.
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">SUBSTITUTE CANDIDATE</span>
              <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <input
                  type="text"
                  value={substituteName}
                  onChange={(e) => setSubstituteName(e.target.value)}
                  placeholder="e.g. Andreas Wibowo"
                  className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setSubstituteModal(false)}
                className="px-4 h-[40px] rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubstituteSubmit}
                className="px-5 h-[40px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark cursor-pointer"
              >
                Confirm Substitute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slot Assignment Picker Modal (UC-7) */}
      {slotPickerModal && activeOpenSlotTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] bg-bg rounded-card border border-line shadow-2xl p-6 flex flex-col gap-4">
            <h3 className="text-[16px] font-bold text-ink m-0">Assign Volunteer to Slot</h3>
            <div className="text-[13px] text-ink2 leading-[1.5]">
              Team: <span className="font-semibold">{activeOpenSlotTarget.teamName}</span> &middot;{' '}
              Duty: <span className="font-semibold">{activeOpenSlotTarget.note}</span>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px] font-bold text-ink2">VOLUNTEER NAME</span>
              <div className="flex items-center h-[44px] px-[14px] bg-surface border border-line rounded-input">
                <input
                  type="text"
                  value={slotVolunteerName}
                  onChange={(e) => setSlotVolunteerName(e.target.value)}
                  placeholder="e.g. Fandi Tanuwijaya"
                  className="flex-1 text-[14px] font-semibold text-ink outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Conflict Warning & Override Section (SPEC-2-03, BR-2, AD-4) */}
            {detectedConflict && (
              <div className="flex flex-col gap-3 p-3.5 bg-amberTint border border-amber/30 rounded-input">
                <div className="flex items-start gap-2">
                  <span className="text-[14px]">⚠️</span>
                  <div className="flex-1 text-[12.5px] leading-[1.4] text-amber font-semibold">
                    <span className="font-bold">Scheduling Conflict: </span>
                    {detectedConflict}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none text-[13px] font-semibold text-ink pt-1 border-t border-amber/20">
                  <input
                    type="checkbox"
                    checked={isOverride}
                    onChange={(e) => setIsOverride(e.target.checked)}
                    className="w-4 h-4 accent-accent rounded cursor-pointer"
                  />
                  <span>Override conflict (requires coordinator justification)</span>
                </label>

                {isOverride && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-[11px] font-bold text-ink2 uppercase tracking-[0.04em]">
                      Override Reason (Mandatory)
                    </span>
                    <input
                      type="text"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="e.g. Confirmed phone availability for emergency cover"
                      className="h-[38px] px-3 bg-surface border border-line rounded-input text-[13px] text-ink font-medium outline-none focus:border-accent"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setSlotPickerModal(false);
                  setIsOverride(false);
                  setOverrideReason('');
                }}
                className="px-4 h-[40px] rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(detectedConflict && (!isOverride || !overrideReason.trim()))}
                onClick={handleSlotAssignSubmit}
                className={`px-5 h-[40px] rounded-input text-[13px] font-semibold transition-colors ${
                  detectedConflict && (!isOverride || !overrideReason.trim())
                    ? 'bg-line text-ink3 cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accentDark cursor-pointer'
                }`}
              >
                Assign Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
