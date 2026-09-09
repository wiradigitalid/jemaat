import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdminLayoutShell, ActionButton } from '../components/AdminLayoutShell.tsx';
import { AdminDeskSignIn } from '../components/AdminDeskSignIn.tsx';

describe('TestAdminLayoutShellRender', () => {
  it('renders the persistent 246px sidebar with all navigation items and office badge', () => {
    const handleNavChange = vi.fn();
    const handleSignOut = vi.fn();

    render(
      <AdminLayoutShell
        currentAdmin={{
          id: 'adm-001',
          name: 'Lidya S.',
          phone: '+6281234567890',
          role: 'church_office',
        }}
        activeNav="People"
        onNavChange={handleNavChange}
        onSignOut={handleSignOut}
        title="People"
        subtitle="Directory of members, attendees and family contacts"
        actions={<ActionButton label="Add person" primary />}
      >
        <div data-testid="test-content">People Registry Content</div>
      </AdminLayoutShell>
    );

    // Verify Jemaat brand
    expect(screen.getByText('Jemaat')).toBeInTheDocument();

    // Verify Sidebar sections
    expect(screen.getByText('CHURCH OFFICE')).toBeInTheDocument();
    expect(screen.getByText('THIS CHURCH')).toBeInTheDocument();

    // Verify all navigation items
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /applicants/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /people/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /households/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /care groups/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /serving/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sermons/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /church code/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();

    // Verify badge on Applicants
    expect(screen.getByText('5')).toBeInTheDocument();

    // Verify logged in user footer
    expect(screen.getByText('Lidya S.')).toBeInTheDocument();
    expect(screen.getByText('LS')).toBeInTheDocument();
    expect(screen.getByText('Church office')).toBeInTheDocument();

    // Verify PageHead header and actions
    expect(screen.getByRole('heading', { level: 1, name: 'People' })).toBeInTheDocument();
    expect(screen.getByText('Directory of members, attendees and family contacts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add person/i })).toBeInTheDocument();

    // Verify content rendered
    expect(screen.getByTestId('test-content')).toBeInTheDocument();

    // Verify nav click fires onNavChange
    fireEvent.click(screen.getByRole('button', { name: /households/i }));
    expect(handleNavChange).toHaveBeenCalledWith('Households');
  });

  it('renders the AdminDeskSignIn desk authentication screen matching design specs', () => {
    const handleSuccess = vi.fn();

    render(<AdminDeskSignIn onSuccess={handleSuccess} />);

    // Verify brand tagline
    expect(
      screen.getByText(/The church register,/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/kept by the people/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Members, households and care groups in one place/i)
    ).toBeInTheDocument();

    // Verify church header
    expect(screen.getByText('Immanuel Church, Sunter')).toBeInTheDocument();
    expect(screen.getByText('Jakarta Utara')).toBeInTheDocument();
    expect(screen.getByText('IM')).toBeInTheDocument();

    // Verify phone input and buttons
    expect(screen.getByText('+62')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send me a link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send a 6-digit code/i })).toBeInTheDocument();

    // Verify shared computer checkbox
    expect(screen.getByText('This is a shared computer')).toBeInTheDocument();
    expect(screen.getByText('Sign me out when the browser closes')).toBeInTheDocument();
  });
});
