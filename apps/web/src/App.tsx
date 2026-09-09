import React, { useState, useEffect } from 'react';
import { AdminDeskSignIn } from './components/AdminDeskSignIn.tsx';
import { AdminLayoutShell, ActionButton, NavItemKey } from './components/AdminLayoutShell.tsx';
import { WebEmpty } from './components/WebEmpty.tsx';
import { WebPeople } from './components/WebPeople.tsx';
import { WebPerson } from './components/WebPerson.tsx';
import { AdminPersonNew } from './components/AdminPersonNew.tsx';
import { AdminUser, AuthResponse, Person, CreatePersonPayload, LifecycleStatus } from './types.ts';
import { PlusIcon, UploadIcon } from './components/Icons.tsx';

const TOKEN_STORAGE_KEY = 'jemaat_admin_token';

export const App: React.FC<{
  apiBaseUrl?: string;
  initialPeople?: Person[];
  initialAdmin?: AdminUser | null;
}> = ({ apiBaseUrl = '', initialPeople, initialAdmin }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(initialAdmin ?? null);
  const [activeNav, setActiveNav] = useState<NavItemKey>('People');
  const [initializing, setInitializing] = useState(initialAdmin === undefined);
  const [people, setPeople] = useState<Person[]>(initialPeople ?? []);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  // Fetch people when admin logged in
  useEffect(() => {
    if (!admin || initialPeople !== undefined) return;

    const savedToken =
      sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY);

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
      .catch(() => {
        // ignore fetch error in disconnected dev mode
      });
  }, [admin, apiBaseUrl, initialPeople]);

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
        // Fallback local state if API offline
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
      // Offline fallback
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
      await fetch(`${apiBaseUrl}/api/v1/people/${personId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
        },
        body: JSON.stringify({ lifecycle: newLifecycle }),
      });
    } catch {
      // offline fallback
    }

    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, lifecycle: newLifecycle } : p))
    );
    if (selectedPerson && selectedPerson.id === personId) {
      setSelectedPerson((prev) => (prev ? { ...prev, lifecycle: newLifecycle } : null));
    }
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
              <ActionButton label="Import from Excel" icon={<UploadIcon size={17} />} />
              <ActionButton
                label="Add person"
                icon={<PlusIcon size={17} />}
                primary
                onClick={() => setShowAddModal(true)}
              />
            </>
          ),
        };
      case 'Applicants':
        return {
          title: 'Applicants',
          subtitle: '5 waiting · oldest submitted 4 days ago',
          actions: <ActionButton label="Export list" icon={<UploadIcon size={17} />} />,
        };
      case 'Households':
        return {
          title: 'Households',
          subtitle: 'Family groupings, residential addresses and heads of household',
          actions: <ActionButton label="Add household" icon={<PlusIcon size={17} />} primary />,
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
          selectedPerson ? (
            <WebPerson
              person={selectedPerson}
              onBack={() => setSelectedPerson(null)}
              onUpdateLifecycle={(st) => handleUpdateLifecycle(selectedPerson.id, st)}
            />
          ) : people.length === 0 ? (
            <WebEmpty onAddPerson={() => setShowAddModal(true)} />
          ) : (
            <WebPeople
              people={people}
              onAddPerson={() => setShowAddModal(true)}
              onSelectPerson={(p) => setSelectedPerson(p)}
            />
          )
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
    </>
  );
};

export default App;
