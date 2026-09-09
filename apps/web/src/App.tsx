import React, { useState, useEffect } from 'react';
import { AdminDeskSignIn } from './components/AdminDeskSignIn.tsx';
import { AdminLayoutShell, ActionButton, NavItemKey } from './components/AdminLayoutShell.tsx';
import { AdminUser, AuthResponse } from './types.ts';
import { PlusIcon, UploadIcon } from './components/Icons.tsx';

const TOKEN_STORAGE_KEY = 'jemaat_admin_token';

export const App: React.FC<{ apiBaseUrl?: string }> = ({ apiBaseUrl = '' }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activeNav, setActiveNav] = useState<NavItemKey>('People');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
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
  }, [apiBaseUrl]);

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
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
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
        return {
          title: 'People',
          subtitle: 'Directory of registered members, attendees and family contacts',
          actions: (
            <>
              <ActionButton label="Export list" icon={<UploadIcon size={17} />} />
              <ActionButton label="Add person" icon={<PlusIcon size={17} />} primary />
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
    <AdminLayoutShell
      currentAdmin={admin}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onSignOut={handleSignOut}
      title={title}
      subtitle={subtitle}
      actions={actions}
    >
      <div className="w-full flex-1 bg-surface border border-line rounded-card p-6 flex flex-col items-center justify-center text-center">
        <div className="text-[15px] font-bold text-ink">{title} Workspace</div>
        <div className="text-[13px] text-ink3 mt-1 max-w-[420px]">
          Active view connected to Church Office Administration Desk. Logged in as{' '}
          <span className="font-semibold text-ink2">{admin.name}</span> ({admin.role}).
        </div>
      </div>
    </AdminLayoutShell>
  );
};

export default App;
