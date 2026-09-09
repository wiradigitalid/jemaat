import React, { useState, useEffect } from 'react';
import { AdminDeskSignIn } from './components/AdminDeskSignIn.tsx';
import { AdminLayoutShell, ActionButton, NavItemKey } from './components/AdminLayoutShell.tsx';
import { WebEmpty } from './components/WebEmpty.tsx';
import { WebPeople } from './components/WebPeople.tsx';
import { WebPerson } from './components/WebPerson.tsx';
import { AdminPersonNew } from './components/AdminPersonNew.tsx';
import { AdminHousehold } from './components/AdminHousehold.tsx';
import { WebImport } from './components/WebImport.tsx';
import { WebMerge } from './components/WebMerge.tsx';
import { WebTransferDialog } from './components/WebTransferDialog.tsx';
import { WebData } from './components/WebData.tsx';
import { AdminDepartments } from './components/AdminDepartments.tsx';
import {
  AdminUser,
  AuthResponse,
  Person,
  CreatePersonPayload,
  LifecycleStatus,
  Household,
  HouseholdMember,
  MinistryTeam,
} from './types.ts';
import { PlusIcon, UploadIcon } from './components/Icons.tsx';

const TOKEN_STORAGE_KEY = 'jemaat_admin_token';

const defaultHousehold: Household = {
  id: 'hh-001',
  name: 'Keluarga Prasetyo',
  address: 'Sunter Agung Q4/12, Jakarta Utara',
  primary_contact_name: 'Bambang Prasetyo',
  primary_contact_phone: '+62 812-3344-9900',
  head_person_id: 'per-bp',
  members: [
    {
      person_id: 'per-bp',
      full_name: 'Bambang Prasetyo',
      standing: 'Registered Member',
      age: 62,
      relationship: 'Head of household',
      category: 'family',
      phone: '+62 812-3344-9900',
      is_head: true,
    },
    {
      person_id: 'per-sp',
      full_name: 'Sri Prasetyo',
      standing: 'Registered Member',
      age: 59,
      relationship: 'Wife',
      category: 'family',
      is_head: false,
    },
    {
      person_id: 'per-yp',
      full_name: 'Yosafat Prasetyo',
      standing: 'Member',
      age: 46,
      relationship: 'Son',
      category: 'family',
      is_head: false,
    },
    {
      person_id: 'per-ip',
      full_name: 'Intan Prasetyo',
      standing: 'Registered Member',
      age: 44,
      relationship: 'Daughter-in-law',
      category: 'family',
      is_head: false,
    },
    {
      person_id: 'per-rp',
      full_name: 'Rafael Prasetyo',
      standing: 'Guest',
      age: 11,
      relationship: 'Grandchild',
      category: 'family',
      is_head: false,
    },
    {
      person_id: 'per-kp',
      full_name: 'Kevin Prasetyo',
      standing: 'Member',
      age: 20,
      relationship: 'Grandchild',
      category: 'family',
      own_address_note: 'Own address',
      is_head: false,
    },
    {
      person_id: 'per-nu',
      full_name: 'Nuraini',
      standing: 'Guest',
      age: 41,
      relationship: 'Household helper',
      category: 'also_lives_here',
      is_head: false,
    },
    {
      person_id: 'per-pt',
      full_name: 'Petrus Tanjung',
      standing: 'Member',
      age: 24,
      relationship: 'Boards here',
      category: 'also_lives_here',
      is_head: false,
    },
    {
      person_id: 'per-mt',
      full_name: 'Melisa Tanudjaja',
      standing: 'Registered Member',
      age: 32,
      relationship: 'Daughter',
      category: 'moved_out',
      moved_out_note: 'married January 2024',
      new_household: 'Keluarga Tanudjaja',
      is_head: false,
    },
  ],
};

const defaultMinistryTeams: MinistryTeam[] = [
  {
    id: 'team-01',
    name: 'Music',
    roles_count: 6,
    interested_count: 49,
    roles: [
      { id: 'role-101', team_id: 'team-01', name: 'Worship Leader', required_count: 1, interested_count: 6 },
      { id: 'role-102', team_id: 'team-01', name: 'Acoustic Guitar', required_count: 1, interested_count: 9 },
      { id: 'role-103', team_id: 'team-01', name: 'Keyboard / Piano', required_count: 1, interested_count: 8 },
      { id: 'role-104', team_id: 'team-01', name: 'Bass Guitar', required_count: 1, interested_count: 5 },
      { id: 'role-105', team_id: 'team-01', name: 'Drums', required_count: 1, interested_count: 7 },
      { id: 'role-106', team_id: 'team-01', name: 'Vocalist / Backing', required_count: 2, interested_count: 14 },
    ],
  },
  {
    id: 'team-02',
    name: 'Multimedia',
    roles_count: 5,
    interested_count: 21,
    roles: [
      { id: 'role-201', team_id: 'team-02', name: 'Sound Engineer (FOH)', required_count: 1, interested_count: 4 },
      { id: 'role-202', team_id: 'team-02', name: 'Presentation Slides', required_count: 1, interested_count: 6 },
    ],
  },
  {
    id: 'team-03',
    name: 'Prayer',
    roles_count: 2,
    interested_count: 12,
    roles: [{ id: 'role-301', team_id: 'team-03', name: 'Intercessor', required_count: 4, interested_count: 12 }],
  },
  {
    id: 'team-04',
    name: 'Teaching',
    roles_count: 4,
    interested_count: 15,
    roles: [{ id: 'role-401', team_id: 'team-04', name: 'Sunday School Teacher', required_count: 3, interested_count: 15 }],
  },
  {
    id: 'team-05',
    name: 'Visitation',
    roles_count: 3,
    interested_count: 8,
    roles: [{ id: 'role-501', team_id: 'team-05', name: 'Pastoral Visitor', required_count: 2, interested_count: 8 }],
  },
  {
    id: 'team-06',
    name: 'Hospitality',
    roles_count: 4,
    interested_count: 28,
    roles: [{ id: 'role-601', team_id: 'team-06', name: 'Usher & Welcome Desk', required_count: 4, interested_count: 28 }],
  },
];

export const App: React.FC<{
  apiBaseUrl?: string;
  initialPeople?: Person[];
  initialAdmin?: AdminUser | null;
  initialHousehold?: Household;
  initialTeams?: MinistryTeam[];
}> = ({ apiBaseUrl = '', initialPeople, initialAdmin, initialHousehold, initialTeams }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(initialAdmin ?? null);
  const [activeNav, setActiveNav] = useState<NavItemKey>('People');
  const [initializing, setInitializing] = useState(initialAdmin === undefined);
  const [people, setPeople] = useState<Person[]>(initialPeople ?? []);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [household, setHousehold] = useState<Household>(initialHousehold ?? defaultHousehold);
  const [teams, setTeams] = useState<MinistryTeam[]>(initialTeams ?? defaultMinistryTeams);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Restore authentication on mount
  useEffect(() => {
    if (initialAdmin !== undefined) return;

    const savedToken =
      sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!savedToken) {
      setInitializing(false);
      return;
    }

    fetch(`${apiBaseUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Unauthorized');
        const data: AdminUser = await res.json();
        setAdmin(data);
      })
      .catch(() => {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, [apiBaseUrl, initialAdmin]);

  // Fetch people and households when admin logged in
  useEffect(() => {
    if (!admin) return;

    const savedToken =
      sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);

    if (initialPeople === undefined) {
      fetch(`${apiBaseUrl}/api/v1/people`, {
        headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
      })
        .then(async (res) => {
          if (!res.ok) return;
          const json = await res.json();
          if (Array.isArray(json.data)) {
            setPeople(json.data);
          }
        })
        .catch(() => {});
    }

    if (initialHousehold === undefined) {
      fetch(`${apiBaseUrl}/api/v1/households/hh-001`, {
        headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
      })
        .then(async (res) => {
          if (!res.ok) return;
          const json: Household = await res.json();
          setHousehold(json);
        })
        .catch(() => {});
    }
  }, [admin, apiBaseUrl, initialPeople, initialHousehold]);

  const handleAuthSuccess = (data: AuthResponse, sharedComputer: boolean) => {
    setAdmin(data.admin);
    if (sharedComputer) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } else {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  };

  const handleSignOut = () => {
    setAdmin(null);
    setSelectedPerson(null);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  const handleSavePerson = async (payload: CreatePersonPayload, addAnother: boolean) => {
    const savedToken =
      sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);

    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/people`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created: Person = await res.json();
        setPeople((prev) => [...prev, created]);
      } else {
        const localCreated: Person = {
          id: `per-${Date.now()}`,
          full_name: payload.full_name,
          phone: payload.phone,
          second_phone: payload.second_phone,
          date_of_birth: payload.date_of_birth,
          with_us_since: payload.with_us_since,
          standing: payload.standing,
          lifecycle: 'Active',
          household_name: payload.household_name,
          role_in_household: payload.role_in_household,
          privacy_opt_in: payload.privacy_opt_in ?? false,
        };
        setPeople((prev) => [...prev, localCreated]);
      }
    } catch {
      const localCreated: Person = {
        id: `per-${Date.now()}`,
        full_name: payload.full_name,
        phone: payload.phone,
        second_phone: payload.second_phone,
        date_of_birth: payload.date_of_birth,
        with_us_since: payload.with_us_since,
        standing: payload.standing,
        lifecycle: 'Active',
        household_name: payload.household_name,
        role_in_household: payload.role_in_household,
        privacy_opt_in: payload.privacy_opt_in ?? false,
      };
      setPeople((prev) => [...prev, localCreated]);
    }

    if (!addAnother) {
      setShowAddModal(false);
    }
  };

  const handleUpdateLifecycle = async (personId: string, newLifecycle: LifecycleStatus) => {
    const savedToken =
      sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);

    try {
      await fetch(`${apiBaseUrl}/api/v1/people/${personId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
        },
        body: JSON.stringify({ lifecycle: newLifecycle }),
      });
    } catch {}

    const shouldClearGroup =
      newLifecycle === 'Inactive' ||
      newLifecycle === 'Transferred out' ||
      newLifecycle === 'Passed away';

    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId
          ? {
              ...p,
              lifecycle: newLifecycle,
              care_group_name: shouldClearGroup ? '' : p.care_group_name,
            }
          : p
      )
    );
    if (selectedPerson && selectedPerson.id === personId) {
      setSelectedPerson((prev) =>
        prev
          ? {
              ...prev,
              lifecycle: newLifecycle,
              care_group_name: shouldClearGroup ? '' : prev.care_group_name,
            }
          : null
      );
    }
  };

  const handleUpdateHouseholdAddress = async (newAddress: string) => {
    const savedToken =
      sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);

    try {
      await fetch(`${apiBaseUrl}/api/v1/households/${household.id}/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
        },
        body: JSON.stringify({ address: newAddress }),
      });
    } catch {}

    setHousehold((prev) => ({ ...prev, address: newAddress }));
  };

  const handleSetHouseholdHead = async (personId: string) => {
    const savedToken =
      sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);

    try {
      await fetch(`${apiBaseUrl}/api/v1/households/${household.id}/head`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
        },
        body: JSON.stringify({ person_id: personId }),
      });
    } catch {}

    setHousehold((prev) => ({
      ...prev,
      head_person_id: personId,
      members: prev.members.map((m) => {
        if (m.person_id === personId) {
          return { ...m, is_head: true, relationship: 'Head of household' };
        }
        if (m.is_head) {
          return { ...m, is_head: false, relationship: 'Family Member' };
        }
        return m;
      }),
    }));
  };

  const handleTransferMember = async (destChurch: string, certNumber: string, transferDate: string) => {
    if (!selectedPerson) return;
    const savedToken =
      sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);

    try {
      await fetch(`${apiBaseUrl}/api/v1/people/${selectedPerson.id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
        },
        body: JSON.stringify({
          dest_church_name: destChurch,
          certificate_number: certNumber,
          transfer_date: transferDate,
        }),
      });
    } catch {}

    const auditNote = `Transferred to ${destChurch} (Cert: ${certNumber}, Date: ${transferDate})`;
    setPeople((prev) =>
      prev.map((p) =>
        p.id === selectedPerson.id
          ? {
              ...p,
              lifecycle: 'Transferred out' as LifecycleStatus,
              care_group_name: '',
              notes: p.notes ? `${p.notes}\n${auditNote}` : auditNote,
            }
          : p
      )
    );

    setSelectedPerson((prev) =>
      prev
        ? {
            ...prev,
            lifecycle: 'Transferred out' as LifecycleStatus,
            care_group_name: '',
            notes: prev.notes ? `${prev.notes}\n${auditNote}` : auditNote,
          }
        : null
    );
  };

  const handleAddHouseholdMember = async (memberPartial: Partial<HouseholdMember>) => {
    const newMember: HouseholdMember = {
      person_id: `per-${Date.now()}`,
      full_name: memberPartial.full_name || 'New Member',
      standing: memberPartial.standing || 'Member',
      age: memberPartial.age || 30,
      relationship: memberPartial.relationship || 'Family Member',
      category: memberPartial.category || 'family',
      is_head: false,
    };

    setHousehold((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  };

  if (initializing) {
    return (
      <div className="w-full min-h-screen bg-bg flex items-center justify-center text-ink2 text-[14px]">
        Loading church office desk...
      </div>
    );
  }

  if (!admin) {
    return <AdminDeskSignIn onSuccess={handleAuthSuccess} apiBaseUrl={apiBaseUrl} />;
  }

  const getPageMeta = (nav: NavItemKey) => {
    switch (nav) {
      case 'People':
        if (selectedPerson) {
          return {
            title: selectedPerson.full_name,
            subtitle: `${selectedPerson.household_name || 'No household'} · on the roll since ${
              selectedPerson.with_us_since || 'Feb 2021'
            }`,
            actions: undefined,
          };
        }
        if (people.length === 0) {
          return {
            title: 'People',
            subtitle: 'Nobody yet · Immanuel Church, Sunter',
            actions: (
              <ActionButton
                label="Add the first person"
                icon={<PlusIcon size={17} />}
                primary
                onClick={() => setShowAddModal(true)}
              />
            ),
          };
        }
        return {
          title: 'People',
          subtitle: `${people.length} on the roll · updated today`,
          actions: (
            <>
              <ActionButton
                label="Import from Excel"
                icon={<UploadIcon size={17} />}
                onClick={() => setShowImport(true)}
              />
              <ActionButton
                label="Review Duplicates"
                onClick={() => setShowMerge(true)}
              />
              <ActionButton
                label="Add person"
                icon={<PlusIcon size={17} />}
                primary
                onClick={() => setShowAddModal(true)}
              />
            </>
          ),
        };
      case 'Households':
        return {
          title: 'Households',
          subtitle: 'Family groupings, residential addresses and heads of household',
          actions: undefined,
        };
      case 'Applicants':
        return {
          title: 'Applicants',
          subtitle: '5 waiting · oldest submitted 4 days ago',
          actions: <ActionButton label="Export list" icon={<UploadIcon size={17} />} />,
        };
      case 'Care Groups':
        return {
          title: 'Care Groups',
          subtitle: 'Small group fellowships, meeting schedules and shepherd assignments',
          actions: <ActionButton label="New care group" icon={<PlusIcon size={17} />} primary />,
        };
      case 'Serving':
        return {
          title: 'Serving & Rosters',
          subtitle: 'Ministry departments, duty assignments and schedule matrices',
          actions: <ActionButton label="Assign duty" icon={<PlusIcon size={17} />} primary />,
        };
      case 'Sermons':
        return {
          title: 'Sermons',
          subtitle: 'Weekly pulpit messages, series archives and study bulletins',
          actions: <ActionButton label="New sermon" icon={<PlusIcon size={17} />} primary />,
        };
      case 'Church code':
        return {
          title: 'Church Code & QR',
          subtitle: 'Mobile registration gateway and printed poster templates',
          actions: <ActionButton label="Print posters" icon={<UploadIcon size={17} />} primary />,
        };
      case 'Settings':
        return {
          title: 'Settings',
          subtitle: 'Church profile, administrative permissions and system backup',
          actions: undefined,
        };
      case 'Overview':
      default:
        return {
          title: 'Overview',
          subtitle: 'Immanuel Church, Sunter · Sunday service in 4 days',
          actions: undefined,
        };
    }
  };

  const { title, subtitle, actions } = getPageMeta(activeNav);

  return (
    <>
      <AdminLayoutShell
        currentAdmin={admin}
        activeNav={activeNav}
        onNavChange={(nav) => {
          setActiveNav(nav);
          setSelectedPerson(null);
        }}
        onSignOut={handleSignOut}
        title={title}
        subtitle={subtitle}
        actions={actions}
      >
        {activeNav === 'People' ? (
          showImport ? (
            <WebImport
              onClose={() => setShowImport(false)}
              onImportComplete={(count) => {
                setShowImport(false);
                alert(`Successfully imported ${count} members`);
              }}
              apiBaseUrl={apiBaseUrl}
            />
          ) : showMerge ? (
            <WebMerge
              onDismiss={() => setShowMerge(false)}
              onMergeComplete={(merged) => {
                setShowMerge(false);
                setPeople((prev) =>
                  prev.map((p) => (p.id === merged.id ? { ...p, ...merged } : p))
                );
              }}
            />
          ) : selectedPerson ? (
            <WebPerson
              person={selectedPerson}
              onBack={() => setSelectedPerson(null)}
              onUpdateLifecycle={(st) => handleUpdateLifecycle(selectedPerson.id, st)}
              onOpenTransfer={() => setShowTransferModal(true)}
            />
          ) : people.length === 0 ? (
            <WebEmpty
              onAddPerson={() => setShowAddModal(true)}
              onImportExcel={() => setShowImport(true)}
            />
          ) : (
            <WebPeople
              people={people}
              onAddPerson={() => setShowAddModal(true)}
              onImportExcel={() => setShowImport(true)}
              onSelectPerson={(p) => setSelectedPerson(p)}
            />
          )
        ) : activeNav === 'Households' ? (
          <AdminHousehold
            household={household}
            onUpdateAddress={handleUpdateHouseholdAddress}
            onSetHead={handleSetHouseholdHead}
            onAddMember={handleAddHouseholdMember}
          />
        ) : activeNav === 'Serving' ? (
          <AdminDepartments
            teams={teams}
            onCreateTeam={async (name) => {
              const newT: MinistryTeam = {
                id: `team-${Date.now()}`,
                name: name,
                roles_count: 0,
                interested_count: 0,
                roles: [],
              };
              setTeams((prev) => [...prev, newT]);
            }}
            onAddRole={async (teamId, roleName, reqCount) => {
              setTeams((prev) =>
                prev.map((t) =>
                  t.id === teamId
                    ? {
                        ...t,
                        roles: [
                          ...t.roles,
                          {
                            id: `role-${Date.now()}`,
                            team_id: teamId,
                            name: roleName,
                            required_count: reqCount,
                            interested_count: 0,
                          },
                        ],
                        roles_count: t.roles.length + 1,
                      }
                    : t
                )
              );
            }}
          />
        ) : activeNav === 'Settings' ? (
          <WebData
            totalMembers={people.length || 254}
            onDownloadCategory={(cat, fmt) => {
              const savedToken =
                sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);
              fetch(`${apiBaseUrl}/api/v1/data/export?category=${cat}&format=${fmt.toLowerCase()}`, {
                headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
              }).catch(() => {});
            }}
            onDownloadAll={() => {
              const savedToken =
                sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);
              fetch(`${apiBaseUrl}/api/v1/data/export`, {
                headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
              }).catch(() => {});
            }}
          />
        ) : (
          <div className="w-full flex-1 bg-surface border border-line rounded-card p-6 flex flex-col items-center justify-center text-center">
            <div className="text-[15px] font-bold text-ink">{title} Workspace</div>
            <div className="text-[13px] text-ink3 mt-1 max-w-[420px]">
              Active view connected to Church Office Administration Desk. Logged in as{' '}
              <span className="font-semibold text-ink2">{admin.name}</span> ({admin.role}).
            </div>
          </div>
        )}
      </AdminLayoutShell>

      {showAddModal && (
        <AdminPersonNew
          onClose={() => setShowAddModal(false)}
          onSave={handleSavePerson}
        />
      )}

      {showTransferModal && selectedPerson && (
        <WebTransferDialog
          person={selectedPerson}
          onClose={() => setShowTransferModal(false)}
          onTransferComplete={handleTransferMember}
        />
      )}
    </>
  );
};

export default App;
