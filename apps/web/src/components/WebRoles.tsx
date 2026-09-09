import React, { useState, useEffect } from 'react';
import { AccessRoleGrant } from '../types.ts';
import { LockIcon, UserPlusIcon } from './Icons.tsx';

interface WebRolesProps {
  initialGrants?: AccessRoleGrant[];
  onGrantRole?: (grant: Partial<AccessRoleGrant>) => void;
  onRevokeRole?: (roleId: string) => void;
}

const defaultGrants: AccessRoleGrant[] = [
  {
    id: 'rol-01',
    person_id: 'per-ls',
    full_name: 'Lidya Suryani',
    initials: 'LS',
    standing: 'Registered Member',
    role: 'Church office',
    role_label: 'Church office',
    given_by: 'Andreas Wibowo',
    given_date: 'Feb 2021',
    last_used: 'used yesterday',
  },
  {
    id: 'rol-02',
    person_id: 'per-aw',
    full_name: 'Andreas Wibowo',
    initials: 'AW',
    standing: 'Community',
    role: 'Administrator',
    role_label: 'Administrator',
    given_by: 'The first account',
    given_date: 'Jan 2021',
    last_used: 'used 3 days ago',
  },
  {
    id: 'rol-03',
    person_id: 'per-bh',
    full_name: 'Budi Halim',
    initials: 'BH',
    standing: 'Registered Member',
    role: 'Care group leader',
    role_label: 'Leads Anugerah',
    given_by: 'Lidya Suryani',
    given_date: 'Feb 2021',
    last_used: 'used yesterday',
  },
  {
    id: 'rol-04',
    person_id: 'per-rs',
    full_name: 'Ruth Simanjuntak',
    initials: 'RS',
    standing: 'Registered Member',
    role: 'Care group leader',
    role_label: 'Leads Damai',
    given_by: 'Lidya Suryani',
    given_date: 'Mar 2023',
    last_used: 'used last week',
  },
  {
    id: 'rol-05',
    person_id: 'per-mn',
    full_name: 'Maruli Nainggolan',
    initials: 'MN',
    standing: 'Registered Member',
    role: 'Care group leader',
    role_label: 'Leads Harapan',
    given_by: 'Lidya Suryani',
    given_date: 'Aug 2024',
    last_used: 'never signed in',
  },
  {
    id: 'rol-06',
    person_id: 'per-gs',
    full_name: 'Grace Sutanto',
    initials: 'GS',
    standing: 'Guest',
    role: 'Care group leader',
    role_label: 'Leads Young Adults',
    given_by: 'Lidya Suryani',
    given_date: 'Jan 2026',
    last_used: 'used yesterday',
  },
  {
    id: 'rol-07',
    person_id: 'per-mh',
    full_name: 'Pdt. Marulitua Hutagalung',
    initials: 'MH',
    standing: 'Registered Member',
    role: 'Administrator',
    role_label: 'Administrator',
    given_by: 'Andreas Wibowo',
    given_date: 'Feb 2021',
    last_used: 'used 5 days ago',
  },
];

export const WebRoles: React.FC<WebRolesProps> = ({
  initialGrants = defaultGrants,
  onGrantRole,
  onRevokeRole,
}) => {
  const [grants, setGrants] = useState<AccessRoleGrant[]>(initialGrants);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Grant Form State
  const [personName, setPersonName] = useState('');
  const [standing, setStanding] = useState('Registered Member');
  const [role, setRole] = useState<'Administrator' | 'Church office' | 'Care group leader'>('Church office');
  const [roleLabel, setRoleLabel] = useState('Church office');

  useEffect(() => {
    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      fetch('/api/v1/church/access-roles', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.data && data.data.length > 0) {
            setGrants(data.data);
          }
        })
        .catch(() => {});
    }
  }, []);

  const adminCount = grants.filter((g) => g.role === 'Administrator').length;
  const officeCount = grants.filter((g) => g.role === 'Church office').length;
  const leaderCount = grants.filter((g) => g.role === 'Care group leader').length;

  const handleRevoke = async (grant: AccessRoleGrant) => {
    // Enforce safety invariant: minimum 2 administrators (SPEC-4-03, WebRoles.dc.html)
    if (grant.role === 'Administrator' && adminCount <= 2) {
      setErrorBanner(
        'Cannot remove administrator: church must maintain at least two administrators at all times (WebRoles safety rule).'
      );
      setTimeout(() => setErrorBanner(null), 5000);
      return;
    }

    const previousGrants = [...grants];
    setGrants((prev) => prev.filter((g) => g.id !== grant.id));

    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      try {
        const res = await fetch(`/api/v1/church/access-roles/${grant.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setErrorBanner(errData.error || 'Failed to revoke access role.');
          setGrants(previousGrants); // rollback
          setTimeout(() => setErrorBanner(null), 5000);
          return;
        }
      } catch {
        setErrorBanner('Network error revoking access role.');
        setGrants(previousGrants); // rollback
        setTimeout(() => setErrorBanner(null), 5000);
        return;
      }
    }

    if (onRevokeRole) {
      onRevokeRole(grant.id);
    }
  };

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) return;

    const tempId = `rol-${String(grants.length + 1).padStart(2, '0')}`;
    const generatedPersonId = `per-${Date.now().toString().slice(-4)}`;
    const effectiveLabel = roleLabel.trim() || (role === 'Care group leader' ? 'Leads a care group' : role);

    const newGrant: AccessRoleGrant = {
      id: tempId,
      person_id: generatedPersonId,
      full_name: personName.trim(),
      initials: personName
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      standing: standing,
      role: role,
      role_label: effectiveLabel,
      given_by: 'Current Administrator',
      given_date: 'Today',
      last_used: 'never signed in',
    };

    setGrants((prev) => [...prev, newGrant]);
    setShowGrantModal(false);
    setPersonName('');
    setRoleLabel('');

    const token =
      sessionStorage.getItem('jemaat_admin_token') || localStorage.getItem('jemaat_admin_token');
    if (token) {
      try {
        const res = await fetch('/api/v1/church/access-roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            person_id: newGrant.person_id,
            full_name: newGrant.full_name,
            standing: newGrant.standing,
            role: newGrant.role,
            role_label: newGrant.role_label,
          }),
        });
        if (res.ok) {
          const created: AccessRoleGrant = await res.json();
          if (created && created.id) {
            setGrants((prev) => prev.map((g) => (g.id === tempId ? created : g)));
          }
        }
      } catch {
        // Keep optimistic state if network fails
      }
    }

    if (onGrantRole) {
      onGrantRole(newGrant);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-bg">
      {/* Top Header Bar matching WebRoles.dc.html */}
      <div className="flex items-end justify-between gap-[10px] p-[24px_32px_16px] border-b border-line bg-surfaceAlt select-none flex-wrap">
        <div>
          <h1 className="font-serif text-[26px] font-medium tracking-[-0.015em] text-ink m-0">
            Who can do what
          </h1>
          <div className="text-[13px] text-ink2 mt-1">
            {grants.length} people have access beyond their own household &middot; 248 do not
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowGrantModal(true)}
          className="flex items-center gap-2 h-[40px] px-5 rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark transition-colors cursor-pointer"
        >
          <UserPlusIcon size={17} strokeWidth={1.8} />
          <span>Give someone access</span>
        </button>
      </div>

      {errorBanner && (
        <div className="mx-8 mt-4 p-3.5 bg-amberTint border border-amber/30 text-amber text-[13px] font-semibold rounded-input">
          {errorBanner}
        </div>
      )}

      {/* 2-Column Main Content matching WebRoles.dc.html */}
      <div className="flex-1 min-h-0 flex gap-6 p-[26px_32px] overflow-y-auto">
        {/* Left Column: Role Holders Table (flex-1) */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="bg-surface border border-line rounded-card overflow-hidden shadow-sm flex flex-col">
            {/* Table Header */}
            <div className="flex items-center gap-[13px] p-[14px_18px] bg-surfaceAlt border-b border-line text-[10px] font-bold tracking-[0.08em] text-ink3 uppercase select-none">
              <div className="w-[38px] flex-[0_0_38px]" />
              <div className="w-[170px] flex-[0_0_170px]">PERSON</div>
              <div className="w-[168px] flex-[0_0_168px]">CAN DO</div>
              <div className="flex-1 min-w-0">GIVEN BY, AND WHEN</div>
              <div className="w-[60px] flex-[0_0_60px] text-right">ACTION</div>
            </div>

            {/* Table Rows matching WebRoles.dc.html */}
            <div className="divide-y divide-lineSoft">
              {grants.map((g) => (
                <div key={g.id} className="flex items-center gap-[13px] p-[13px_18px] hover:bg-surfaceAlt/60 transition-colors">
                  <div className="w-[36px] h-[36px] rounded-full bg-accentTint text-accent flex items-center justify-center text-xs font-bold shrink-0">
                    {g.initials}
                  </div>

                  <div className="w-[170px] flex-[0_0_170px] min-w-0">
                    <div className="text-[13.5px] font-semibold text-ink truncate">{g.full_name}</div>
                    <div className="mt-0.5">
                      <span className="inline-flex items-center h-[19px] px-2 rounded-full bg-surfaceAlt border border-line text-ink2 text-[10.5px] font-bold">
                        {g.standing}
                      </span>
                    </div>
                  </div>

                  <div className="w-[168px] flex-[0_0_168px]">
                    <span className="text-[13px] font-semibold text-accent">
                      {g.role_label}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 text-[12px] text-ink3 truncate">
                    {g.given_by} &middot; {g.given_date} &middot; {g.last_used}
                  </div>

                  <div className="w-[60px] flex-[0_0_60px] text-right">
                    <button
                      type="button"
                      onClick={() => handleRevoke(g)}
                      className="text-[12px] font-semibold text-ink3 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Notice matching WebRoles.dc.html */}
            <div className="p-[14px_18px] border-t border-line bg-surface flex items-start gap-3">
              <span className="text-amber pt-0.5">
                <LockIcon size={16} strokeWidth={2} />
              </span>
              <span className="text-[12px] text-ink2 leading-[1.55]">
                Two rows are worth a second look. <span className="font-bold text-ink">Maruli has led Harapan for eighteen months and has never signed in</span> &mdash; so that group has no attendance and no RSVP, and nobody noticed because the access was granted, not used. And <span className="font-bold text-ink">Grace leads a group while still a Guest</span>, which is correct: leading is serving, not standing. The screen shows the standing so nobody &apos;fixes&apos; it.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Roles Definitions Cards (452px) */}
        <div className="w-[452px] flex-[0_0_452px] flex flex-col gap-[18px]">
          <div className="bg-surface border border-line rounded-card p-[18px_20px] shadow-sm flex flex-col gap-4">
            <div className="text-[11px] font-bold tracking-[0.08em] text-ink3 uppercase select-none">
              What each one actually means
            </div>

            <div className="flex flex-col gap-4 divide-y divide-lineSoft">
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-ink">Administrator</span>
                  <span className="text-[12px] font-bold text-amber">{adminCount} &mdash; needs 2</span>
                </div>
                <div className="text-[12.5px] text-ink font-medium mt-1 leading-[1.45]">
                  Everything the office does, plus giving and taking away access, and closing the church.
                </div>
                <div className="text-[11px] text-ink3 mt-1.5 leading-[1.5]">
                  A church with one administrator is locked out of its own register the day that person dies or leaves in anger. Two is the minimum and the screen should refuse one.
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-ink">Church office</span>
                  <span className="text-[12px] font-bold text-ink2">{officeCount}</span>
                </div>
                <div className="text-[12.5px] text-ink font-medium mt-1 leading-[1.45]">
                  Adds and corrects the register, confirms applicants, publishes the week, runs the import, downloads everything.
                </div>
                <div className="text-[11px] text-ink3 mt-1.5 leading-[1.5]">
                  Cannot give anyone else access. That separation is the whole point of having two roles instead of one.
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-ink">Leads a care group</span>
                  <span className="text-[12px] font-bold text-ink2">{leaderCount}</span>
                </div>
                <div className="text-[12.5px] text-ink font-medium mt-1 leading-[1.45]">
                  One group only: takes attendance, sees who answered, has the contacts, manages the hosting rota.
                </div>
                <div className="text-[11px] text-ink3 mt-1.5 leading-[1.5]">
                  Ends the day the handover in W9 completes. Nobody has to remember to remove it.
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-ink">Everyone else</span>
                  <span className="text-[12px] font-bold text-ink2">248</span>
                </div>
                <div className="text-[12.5px] text-ink font-medium mt-1 leading-[1.45]">
                  Their own household, their own care group, and everything public.
                </div>
                <div className="text-[11px] text-ink3 mt-1.5 leading-[1.5]">
                  This is not a role. It is what being a member already means, and no grant creates it.
                </div>
              </div>
            </div>
          </div>

          {/* Taking Access Away Card matching WebRoles.dc.html */}
          <div className="bg-surface border border-[#B4562F55] rounded-card p-[18px_20px] shadow-sm flex items-start gap-3">
            <span className="text-accent pt-0.5">
              <LockIcon size={18} strokeWidth={2} />
            </span>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-ink">Taking access away</div>
              <div className="text-[12px] text-ink2 mt-2 leading-[1.6]">
                Immediate, and it removes only access. Their membership, their household and their whole history stay exactly as they were &mdash; being removed from a role is not being removed from a church.
                <br /><br />
                One order matters: <span className="font-bold text-ink">take a leader through W9 first.</span> Revoking without handing over leaves a group with fourteen people, a hosting rota and nobody who can take attendance.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grant Access Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleGrantSubmit}
            className="w-full max-w-[460px] bg-bg rounded-card border border-line shadow-2xl p-6 flex flex-col gap-4"
          >
            <h3 className="text-[16px] font-bold text-ink m-0">Give Someone Access</h3>
            <div className="text-[13px] text-ink2 leading-[1.5]">
              Grant administrative or small group leadership permissions to an existing church member.
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">MEMBER FULL NAME</label>
              <input
                type="text"
                required
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g. Kevin Prasetyo"
                className="h-[42px] px-3.5 bg-surface border border-line rounded-input text-[14px] text-ink font-semibold outline-none focus:border-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">MEMBERSHIP STANDING</label>
              <select
                value={standing}
                onChange={(e) => setStanding(e.target.value)}
                className="h-[42px] px-3 bg-surface border border-line rounded-input text-[13px] font-semibold text-ink outline-none focus:border-accent"
              >
                <option value="Registered Member">Registered Member</option>
                <option value="Member">Member</option>
                <option value="Community">Community</option>
                <option value="Guest">Guest</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-ink2">ACCESS ROLE</label>
              <select
                value={role}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setRole(val);
                  setRoleLabel(val === 'Care group leader' ? 'Leads a care group' : val);
                }}
                className="h-[42px] px-3 bg-surface border border-line rounded-input text-[13px] font-semibold text-ink outline-none focus:border-accent"
              >
                <option value="Church office">Church office</option>
                <option value="Administrator">Administrator</option>
                <option value="Care group leader">Care group leader</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowGrantModal(false)}
                className="px-4 h-[40px] rounded-input bg-surface border border-line text-[13px] font-semibold text-ink hover:bg-surfaceAlt cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 h-[40px] rounded-input bg-accent text-white text-[13px] font-semibold hover:bg-accentDark cursor-pointer"
              >
                Grant Access
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
