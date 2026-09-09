import React, { useState } from 'react';
import { MinistryTeam, ServingRole } from '../types.ts';
import { HandIcon, PlusIcon } from './Icons.tsx';

interface AdminDepartmentsProps {
  teams: MinistryTeam[];
  selectedTeamId?: string;
  onSelectTeam?: (teamId: string) => void;
  onCreateTeam?: (name: string) => Promise<void>;
  onAddRole?: (teamId: string, roleName: string, requiredCount: number) => Promise<void>;
}

export const AdminDepartments: React.FC<AdminDepartmentsProps> = ({
  teams,
  selectedTeamId,
  onSelectTeam,
  onCreateTeam,
  onAddRole,
}) => {
  const [activeId, setActiveId] = useState<string>(selectedTeamId || teams[0]?.id || '');
  const [newTeamName, setNewTeamName] = useState('');
  const [showAddTeamInput, setShowAddTeamInput] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [showAddRoleInput, setShowAddRoleInput] = useState(false);

  // Empty state matching AdminDepartmentsEmpty.dc.html
  if (teams.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-[400px]">
        <div className="w-full max-w-[520px] text-center flex flex-col items-center">
          <span className="w-14 h-14 rounded-full bg-accentTint text-accent flex items-center justify-center mb-5">
            <HandIcon size={26} strokeWidth={1.7} />
          </span>
          <h2 className="font-serif text-[28px] font-medium tracking-[-0.01em] text-ink m-0">
            No departments yet
          </h2>
          <div className="text-[13.5px] text-ink2 mt-3 leading-[1.65]">
            A department is a team in your church. The roles inside it are what people put their names to when they say they are willing to serve.
          </div>
          <div className="mt-6">
            {showAddTeamInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Department name (e.g. Music)"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="h-11 px-3.5 bg-surface border border-line rounded-input text-sm font-semibold outline-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (newTeamName.trim() && onCreateTeam) {
                      await onCreateTeam(newTeamName.trim());
                      setNewTeamName('');
                      setShowAddTeamInput(false);
                    }
                  }}
                  className="h-11 px-5 rounded-input bg-accent text-white text-sm font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddTeamInput(true)}
                className="inline-flex items-center gap-2.5 h-12 px-6 rounded-card bg-accent text-white text-sm font-bold hover:bg-accentDark transition-colors cursor-pointer"
              >
                <PlusIcon size={18} strokeWidth={2.2} />
                <span>Add the first department</span>
              </button>
            )}
          </div>
          <div className="text-[12.5px] text-ink3 mt-4.5 leading-[1.6]">
            Names are yours. Nothing is filled in for you, and nothing is required — a register works with no departments at all.
          </div>
        </div>
      </div>
    );
  }

  const activeTeam = teams.find((t) => t.id === activeId) || teams[0];

  const handleCreateTeamSubmit = async () => {
    if (!newTeamName.trim()) return;
    if (onCreateTeam) {
      await onCreateTeam(newTeamName.trim());
    }
    setNewTeamName('');
    setShowAddTeamInput(false);
  };

  const handleAddRoleSubmit = async () => {
    if (!newRoleName.trim() || !activeTeam) return;
    if (onAddRole) {
      await onAddRole(activeTeam.id, newRoleName.trim(), 1);
    }
    setNewRoleName('');
    setShowAddRoleInput(false);
  };

  const totalRoles = teams.reduce((acc, t) => acc + (t.roles?.length || t.roles_count || 0), 0);

  const sampleInterested = [
    { name: 'Yosafat Prasetyo', role: 'Singer', initials: 'YP' },
    { name: 'Andreas Wibowo', role: 'Guitarist', initials: 'AW' },
    { name: 'Melisa Halim', role: 'Keyboardist', initials: 'MH' },
    { name: 'Petrus Tanjung', role: 'Bassist', initials: 'PT' },
    { name: 'Kevin Prasetyo', role: 'Drummer', initials: 'KP' },
  ];

  return (
    <div className="flex flex-col gap-[18px] flex-1 min-h-0">
      {/* Top Header */}
      <div className="flex items-end justify-between gap-[10px] pb-2 flex-wrap">
        <div>
          <h1 className="font-serif text-[27px] font-medium tracking-[-0.015em] text-ink m-0">
            Departments and serving roles
          </h1>
          <div className="text-[13px] text-ink2 mt-1">
            {teams.length} departments &middot; {totalRoles} roles &middot; volunteer assignments
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddTeamInput(true)}
          className="flex items-center gap-2 h-[40px] px-[18px] rounded-input bg-accent text-white font-semibold text-[13px] hover:bg-accentDark transition-colors cursor-pointer"
        >
          <PlusIcon size={17} strokeWidth={1.7} />
          <span>New department</span>
        </button>
      </div>

      {/* 3-Pane Layout matching AdminDepartments.dc.html */}
      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0 overflow-y-auto">
        {/* Pane 1: Department List (352px) */}
        <div className="w-full xl:w-[320px] xl:flex-[0_0_320px] bg-surface border border-line rounded-card overflow-hidden flex flex-col self-start">
          <div className="p-1.5 flex flex-col gap-0.5">
            {teams.map((team) => {
              const isSelected = team.id === activeTeam.id;
              return (
                <div
                  key={team.id}
                  onClick={() => {
                    setActiveId(team.id);
                    if (onSelectTeam) onSelectTeam(team.id);
                  }}
                  className={`flex items-center gap-3 p-[13px_14px] rounded-input cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-surface border-[1.5px] border-accent shadow-sm'
                      : 'border border-transparent hover:bg-surfaceAlt'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-ink truncate">{team.name}</div>
                    <div className="text-[12px] text-ink3 mt-1">
                      {team.roles?.length || team.roles_count} roles
                    </div>
                  </div>
                  <span className="text-ink3 flex">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9.5 6 6 6-6 6"/>
                    </svg>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Add department footer button */}
          <div className="p-[14px_16px] border-t border-lineSoft bg-surface">
            {showAddTeamInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Department name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="flex-1 h-9 px-3 bg-surface border border-line rounded-input text-xs font-semibold outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateTeamSubmit}
                  className="px-3 h-9 rounded-input bg-accent text-white text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddTeamInput(true)}
                className="flex items-center gap-2.5 text-[13px] font-semibold text-accent hover:text-accentDark cursor-pointer"
              >
                <PlusIcon size={16} strokeWidth={2.2} />
                <span>Add a department</span>
              </button>
            )}
          </div>
        </div>

        {/* Pane 2: Selected Department Roles */}
        <div className="flex-1 min-w-0 bg-surface border border-line rounded-card overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-[18px_16px_14px] border-b border-lineSoft flex items-end justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-[23px] font-medium text-ink m-0 truncate">
                {activeTeam.name}
              </h2>
              <div className="text-[12.5px] text-ink3 mt-1">
                {activeTeam.roles?.length || activeTeam.roles_count} roles &middot; {activeTeam.interested_count || 49} people interested
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 h-[40px] px-4 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
            >
              <span>Rename</span>
            </button>
          </div>

          {/* Role Column Header */}
          <div className="flex items-center gap-3.5 px-4 py-2.5 bg-surfaceAlt border-b border-line text-[10px] font-bold tracking-[0.09em] text-ink3 uppercase">
            <span className="flex-1">SERVING ROLE</span>
            <span className="w-[120px] flex-[0_0_120px]">INTERESTED</span>
            <span className="w-5 flex-[0_0_20px]"></span>
          </div>

          {/* Role Rows */}
          <div className="divide-y divide-lineSoft overflow-y-auto flex-1">
            {(activeTeam.roles || []).map((role: ServingRole) => (
              <div key={role.id} className="flex items-center gap-3.5 p-[13px_16px] hover:bg-surfaceAlt transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-ink truncate">{role.name}</div>
                  <div className="text-[11.5px] text-ink3 mt-0.5">
                    Requires {role.required_count || 1} person per service
                  </div>
                </div>
                <div className="w-[120px] flex-[0_0_120px] text-[12.5px] text-ink2">
                  {role.interested_count || 6} people
                </div>
                <span className="w-5 flex-[0_0_20px] text-ink3 flex justify-end">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="6" cy="12" r="1.3" fill="currentColor" stroke="none"/>
                    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/>
                    <circle cx="18" cy="12" r="1.3" fill="currentColor" stroke="none"/>
                  </svg>
                </span>
              </div>
            ))}
          </div>

          {/* Add Role Footer */}
          <div className="p-3 bg-surfaceAlt border-t border-line">
            {showAddRoleInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Role title for ${activeTeam.name}`}
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="flex-1 h-9 px-3 bg-surface border border-line rounded-input text-xs font-semibold outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddRoleSubmit}
                  className="px-4 h-9 rounded-input bg-accent text-white text-xs font-bold"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddRoleInput(true)}
                className="flex items-center gap-2 text-xs font-semibold text-accent hover:text-accentDark cursor-pointer"
              >
                <PlusIcon size={15} strokeWidth={2} />
                <span>Add a role to {activeTeam.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Pane 3: Interested in Selected Department (matching AdminDepartments.dc.html) */}
        <div className="w-full xl:w-[326px] xl:flex-[0_0_326px] bg-surface border border-line rounded-card overflow-hidden flex flex-col self-start">
          <div className="p-[16px_16px_8px] border-b border-lineSoft">
            <div className="text-[14px] font-bold text-ink">Interested in {activeTeam.name}</div>
            <div className="text-[12px] text-ink3 mt-1">49 people, newest first</div>
          </div>

          <div className="divide-y divide-lineSoft overflow-y-auto max-h-[460px]">
            {sampleInterested.map((person, idx) => (
              <div key={idx} className="flex items-center gap-3 p-[11px_16px] hover:bg-surfaceAlt">
                <div className="w-[34px] h-[34px] flex-[0_0_34px] rounded-full bg-accentTint text-accent flex items-center justify-center text-[11px] font-bold tracking-[0.02em]">
                  {person.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-ink truncate">{person.name}</div>
                  <div className="text-[11.5px] text-ink3 mt-0.5">{person.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
