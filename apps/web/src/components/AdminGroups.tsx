import React, { useState, useEffect } from 'react';
import { CareGroup, UnplacedPerson } from '../types.ts';
import { PlusIcon, UserPlusIcon } from './Icons.tsx';

interface AdminGroupsProps {
  groups?: CareGroup[];
  unplaced?: UnplacedPerson[];
  totalChurchMembers?: number;
  onCreateGroup?: (group: Partial<CareGroup>) => void;
  onEnrollMember?: (groupId: string, member: { person_id: string; full_name: string; standing: string }) => void;
  onRemoveMember?: (groupId: string, personId: string) => void;
}

const defaultGroups: CareGroup[] = [
  {
    id: 'cg-01',
    name: 'Anugerah',
    zone: 'Sunter',
    leader_name: 'Budi Hartono',
    meeting_day: 'Wednesdays',
    members_count: 14,
    members: [
      { person_id: 'per-bh', full_name: 'Budi Hartono', standing: 'Registered Member', is_leader: true },
      { person_id: 'per-mt', full_name: 'Melisa Tanudjaja', standing: 'Registered Member', is_leader: false },
      { person_id: 'per-ah', full_name: 'Andreas Halim', standing: 'Member', is_leader: false },
      { person_id: 'per-ip', full_name: 'Intan Prasetyo', standing: 'Registered Member', is_leader: false },
      { person_id: 'per-ga', full_name: 'Grace Anjani', standing: 'Guest', is_leader: false },
      { person_id: 'per-dk', full_name: 'Dedi Kurnia', standing: 'Registered Member', is_leader: false },
      { person_id: 'per-ts', full_name: 'Tigor Siahaan', standing: 'Member', is_leader: false },
      { person_id: 'per-sl', full_name: 'Samuel Lubis', standing: 'Registered Member', is_leader: false },
      { person_id: 'per-yt', full_name: 'Yuni Tarigan', standing: 'Registered Member', is_leader: false },
    ],
  },
  {
    id: 'cg-02',
    name: 'Kasih',
    zone: 'Kelapa Gading',
    leader_name: 'Melisa Tanudjaja',
    meeting_day: 'Thursdays',
    members_count: 12,
    members: [
      { person_id: 'per-mt', full_name: 'Melisa Tanudjaja', standing: 'Registered Member', is_leader: true },
    ],
  },
  {
    id: 'cg-03',
    name: 'Damai',
    zone: 'Sunter',
    leader_name: 'Maruli Siregar',
    meeting_day: 'Fridays',
    members_count: 11,
    members: [
      { person_id: 'per-ms', full_name: 'Maruli Siregar', standing: 'Registered Member', is_leader: true },
    ],
  },
  {
    id: 'cg-04',
    name: 'Setia',
    zone: 'Pluit',
    leader_name: 'Grace Anjani',
    meeting_day: 'Thursdays',
    members_count: 13,
    members: [
      { person_id: 'per-ga', full_name: 'Grace Anjani', standing: 'Guest', is_leader: true },
    ],
  },
  {
    id: 'cg-05',
    name: 'Harapan',
    zone: 'Kemayoran',
    leader_name: 'No leader yet',
    meeting_day: 'Wednesdays',
    members_count: 11,
    members: [],
  },
];

const defaultUnplaced: UnplacedPerson[] = [
  { person_id: 'per-rw', full_name: 'Rian Wijaya', initials: 'RW', zone: 'Sunter' },
  { person_id: 'per-sr', full_name: 'Sinta Rahmat', initials: 'SR', zone: 'Sunter' },
  { person_id: 'per-ft', full_name: 'Fandi Tobing', initials: 'FT', zone: 'Pluit' },
  { person_id: 'per-hl', full_name: 'Hendra Lie', initials: 'HL', zone: 'Kemayoran' },
  { person_id: 'per-nk', full_name: 'Nita Kusuma', initials: 'NK', zone: 'Kelapa Gading' },
];

export const AdminGroups: React.FC<AdminGroupsProps> = ({
  groups = defaultGroups,
  unplaced = defaultUnplaced,
  totalChurchMembers = 248,
  onCreateGroup,
  onEnrollMember,
  onRemoveMember,
}) => {
  const [groupList, setGroupList] = useState<CareGroup[]>(groups);
  const [unplacedQueue, setUnplacedQueue] = useState<UnplacedPerson[]>(unplaced);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'cg-01');
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupZone, setNewGroupZone] = useState('Sunter');
  const [newGroupLeader, setNewGroupLeader] = useState('');
  const [newGroupMeetingDay, setNewGroupMeetingDay] = useState('Wednesdays');

  // Add Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberStanding, setNewMemberStanding] = useState('Member');

  useEffect(() => {
    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch('/api/v1/care-groups', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.data && data.data.length > 0) {
            setGroupList(data.data);
          }
        })
        .catch(() => {});

      fetch('/api/v1/care-groups/unplaced', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.data) {
            setUnplacedQueue(data.data);
          }
        })
        .catch(() => {});
    }
  }, []);

  const selectedGroup = groupList.find((g) => g.id === selectedGroupId) || groupList[0];

  const totalBelonging = groupList.reduce((acc, g) => acc + g.members_count, 0);

  const handlePlaceUnplaced = (person: UnplacedPerson) => {
    if (!selectedGroup) return;

    // Add to selected group
    setGroupList((prev) =>
      prev.map((g) =>
        g.id === selectedGroup.id
          ? {
              ...g,
              members_count: g.members_count + 1,
              members: [
                ...(g.members || []),
                {
                  person_id: person.person_id,
                  full_name: person.full_name,
                  standing: 'Member',
                  is_leader: false,
                },
              ],
            }
          : g
      )
    );

    // Remove from unplaced
    setUnplacedQueue((prev) => prev.filter((p) => p.person_id !== person.person_id));

    if (onEnrollMember) {
      onEnrollMember(selectedGroup.id, {
        person_id: person.person_id,
        full_name: person.full_name,
        standing: 'Member',
      });
    }
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newG: CareGroup = {
      id: `cg-${String(groupList.length + 1).padStart(2, '0')}`,
      name: newGroupName.trim(),
      zone: newGroupZone,
      leader_name: newGroupLeader.trim() || 'No leader yet',
      meeting_day: newGroupMeetingDay,
      members_count: 0,
      members: [],
    };

    setGroupList((prev) => [...prev, newG]);
    setSelectedGroupId(newG.id);
    setShowNewGroupModal(false);
    setNewGroupName('');
    setNewGroupLeader('');

    if (onCreateGroup) {
      onCreateGroup(newG);
    }
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !selectedGroup) return;

    const personId = `per-${Date.now().toString().slice(-4)}`;
    const newM = {
      person_id: personId,
      full_name: newMemberName.trim(),
      standing: newMemberStanding,
      is_leader: false,
    };

    setGroupList((prev) =>
      prev.map((g) =>
        g.id === selectedGroup.id
          ? {
              ...g,
              members_count: g.members_count + 1,
              members: [...(g.members || []), newM],
            }
          : g
      )
    );

    setShowAddMemberModal(false);
    setNewMemberName('');

    if (onEnrollMember) {
      onEnrollMember(selectedGroup.id, newM);
    }
  };

  const handleRemove = (personId: string) => {
    if (!selectedGroup) return;

    setGroupList((prev) =>
      prev.map((g) =>
        g.id === selectedGroup.id
          ? {
              ...g,
              members_count: Math.max(0, g.members_count - 1),
              members: (g.members || []).filter((m) => m.person_id !== personId),
            }
          : g
      )
    );

    if (onRemoveMember) {
      onRemoveMember(selectedGroup.id, personId);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-bg">
      {/* Top Header Bar matching AdminGroups.dc.html */}
      <div className="flex items-center gap-[14px] p-[20px_32px] bg-surfaceAlt border-b border-line select-none">
        <div className="flex-1 min-w-0">
          <h1 className="text-[16px] font-bold text-ink m-0">Care groups</h1>
          <div className="text-[12px] text-ink3 mt-0.5">
            {groupList.length} groups &middot; {totalBelonging} of {totalChurchMembers} people belong to one
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowNewGroupModal(true)}
          className="flex items-center gap-2 h-[40px] px-[18px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark transition-colors cursor-pointer"
        >
          <PlusIcon size={17} strokeWidth={2.2} />
          <span>New group</span>
        </button>
      </div>

      {/* 3-Column Layout matching AdminGroups.dc.html */}
      <div className="flex-1 min-h-0 flex gap-6 p-[24px_32px] overflow-hidden">
        {/* Left Column: Groups List (352px) */}
        <div className="w-[352px] flex-[0_0_352px]">
          <div className="bg-surface border border-line rounded-card overflow-hidden h-full flex flex-col shadow-sm">
            <div className="p-1.5 flex flex-col gap-0.5 overflow-y-auto flex-1">
              {groupList.map((g) => {
                const isSelected = g.id === selectedGroup?.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGroupId(g.id)}
                    className={`flex items-center gap-3 p-[13px_14px] rounded-[12px] transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-surface border-[1.5px] border-accent shadow-xs'
                        : 'border border-transparent hover:bg-surfaceAlt'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-ink">{g.name}</div>
                      <div className="text-[12px] text-ink3 mt-1 truncate">
                        {g.zone} &middot; {g.leader_name}
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-ink2">{g.members_count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle Column: Selected Group Detail (flex-1) */}
        <div className="flex-1 min-w-0">
          {selectedGroup && (
            <div className="bg-surface border border-line rounded-card overflow-hidden h-full flex flex-col shadow-sm">
              {/* Group Header */}
              <div className="p-[18px_16px_14px] border-b border-lineSoft flex items-end gap-3 select-none">
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-[23px] font-medium text-ink">{selectedGroup.name}</div>
                  <div className="text-[12.5px] text-ink3 mt-1">
                    {selectedGroup.zone} &middot; {selectedGroup.members_count} people &middot; {selectedGroup.meeting_day}
                  </div>
                </div>

                <div className="flex-0 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(true)}
                    className="flex items-center gap-2 h-[36px] px-3.5 rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt transition-colors cursor-pointer"
                  >
                    <UserPlusIcon size={16} strokeWidth={1.8} />
                    <span>Add member</span>
                  </button>
                </div>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto divide-y divide-lineSoft">
                {/* Leader Row */}
                {selectedGroup.members?.find((m) => m.is_leader) ? (
                  (() => {
                    const leader = selectedGroup.members.find((m) => m.is_leader)!;
                    const initials = leader.full_name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2);
                    return (
                      <div className="flex items-center gap-3 p-[11px_16px]">
                        <div className="w-[34px] h-[34px] rounded-full bg-accentTint text-accent flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] font-semibold text-ink">{leader.full_name}</div>
                          <div className="text-[11.5px] text-ink3 mt-0.5">{leader.standing}</div>
                        </div>
                        <span className="inline-flex items-center h-[22px] px-2.5 rounded-full bg-accentTint text-accent text-[11px] font-bold">
                          Leader
                        </span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-[12px_16px] text-[12.5px] text-ink3 italic">
                    Leader: {selectedGroup.leader_name}
                  </div>
                )}

                {/* Regular Members */}
                {selectedGroup.members
                  ?.filter((m) => !m.is_leader)
                  .slice(0, 9)
                  .map((m) => {
                    const initials = m.full_name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2);
                    return (
                      <div key={m.person_id} className="flex items-center gap-3 p-[11px_16px] group">
                        <div className="w-[34px] h-[34px] rounded-full bg-accentTint text-accent flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] font-semibold text-ink">{m.full_name}</div>
                          <div className="text-[11.5px] text-ink3 mt-0.5">{m.standing}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(m.person_id)}
                          className="text-[11.5px] font-semibold text-ink3 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                {selectedGroup.members && selectedGroup.members.length > 9 && (
                  <div className="p-[12px_16px] border-t border-lineSoft text-[12px] text-ink3">
                    and {selectedGroup.members.length - 9} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Asked to Join Queue (326px) */}
        <div className="w-[326px] flex-[0_0_326px]">
          <div className="bg-surface border border-line rounded-card overflow-hidden h-full flex flex-col shadow-sm">
            {/* Queue Header */}
            <div className="p-[16px_16px_8px] border-b border-lineSoft select-none">
              <div className="text-[14px] font-bold text-ink">Asked to join a group</div>
              <div className="text-[12px] text-ink3 mt-1">
                {unplacedQueue.length} people, none placed yet
              </div>
            </div>

            {/* Unplaced People List */}
            <div className="flex-1 overflow-y-auto divide-y divide-lineSoft">
              {unplacedQueue.map((u) => (
                <div key={u.person_id} className="flex items-center gap-3 p-[11px_16px]">
                  <div className="w-[34px] h-[34px] rounded-full bg-accentTint text-accent flex items-center justify-center text-xs font-bold shrink-0">
                    {u.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-ink">{u.full_name}</div>
                    <div className="text-[11.5px] text-ink3 mt-0.5">{u.zone}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlaceUnplaced(u)}
                    className="h-[28px] px-3 rounded-input border border-accent text-accent text-[12px] font-bold hover:bg-accent hover:text-white transition-colors cursor-pointer"
                  >
                    Place
                  </button>
                </div>
              ))}

              {unplacedQueue.length === 0 && (
                <div className="p-6 text-center text-ink3 text-[13px]">
                  All members have been placed in care groups.
                </div>
              )}
            </div>

            <div className="p-[12px_16px] border-t border-lineSoft text-[12.5px] font-semibold text-accent select-none">
              See all {unplacedQueue.length}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: New Care Group */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateGroupSubmit}
            className="w-full max-w-[480px] bg-bg rounded-card border border-line shadow-2xl p-6 flex flex-col gap-4"
          >
            <h3 className="text-[16px] font-bold text-ink m-0">Create New Care Group</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">GROUP NAME</label>
              <input
                type="text"
                required
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Solafide"
                className="h-[42px] px-3.5 bg-surface border border-line rounded-input text-[14px] text-ink font-semibold outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">ZONE / AREA</label>
              <input
                type="text"
                required
                value={newGroupZone}
                onChange={(e) => setNewGroupZone(e.target.value)}
                placeholder="e.g. Sunter, Kelapa Gading"
                className="h-[42px] px-3.5 bg-surface border border-line rounded-input text-[14px] text-ink font-semibold outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">LEADER NAME</label>
              <input
                type="text"
                value={newGroupLeader}
                onChange={(e) => setNewGroupLeader(e.target.value)}
                placeholder="e.g. Hendrik Tan"
                className="h-[42px] px-3.5 bg-surface border border-line rounded-input text-[14px] text-ink font-semibold outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">MEETING SCHEDULE</label>
              <input
                type="text"
                value={newGroupMeetingDay}
                onChange={(e) => setNewGroupMeetingDay(e.target.value)}
                placeholder="e.g. Wednesdays 19:30"
                className="h-[42px] px-3.5 bg-surface border border-line rounded-input text-[14px] text-ink font-semibold outline-none focus:border-accent"
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowNewGroupModal(false)}
                className="px-4 h-[40px] rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 h-[40px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark cursor-pointer"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Member to Selected Group */}
      {showAddMemberModal && selectedGroup && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddMemberSubmit}
            className="w-full max-w-[480px] bg-bg rounded-card border border-line shadow-2xl p-6 flex flex-col gap-4"
          >
            <h3 className="text-[16px] font-bold text-ink m-0">Add Member to {selectedGroup.name}</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">MEMBER FULL NAME</label>
              <input
                type="text"
                required
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="e.g. Hendra Lie"
                className="h-[42px] px-3.5 bg-surface border border-line rounded-input text-[14px] text-ink font-semibold outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">MEMBERSHIP STANDING</label>
              <select
                value={newMemberStanding}
                onChange={(e) => setNewMemberStanding(e.target.value)}
                className="h-[42px] px-3 bg-surface border border-line rounded-input text-[13px] text-ink font-semibold outline-none focus:border-accent"
              >
                <option value="Registered Member">Registered Member</option>
                <option value="Member">Member</option>
                <option value="Community">Community</option>
                <option value="Guest">Guest</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 h-[40px] rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 h-[40px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark cursor-pointer"
              >
                Add to Group
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
