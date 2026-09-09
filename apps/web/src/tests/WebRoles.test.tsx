import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App.tsx';
import { WebRoles } from '../components/WebRoles.tsx';
import { AdminUser } from '../types.ts';

const mockAdmin: AdminUser = {
  id: 'adm-001',
  name: 'Lidya S.',
  phone: '+6281234567890',
  role: 'church_office',
};

describe('SPEC-4-03 Web Access Roles & Permissions Tests', () => {
  it('TestWebRoles_WhoCanDoWhatRender', () => {
    render(<App initialAdmin={mockAdmin} initialSettingsView="roles" />);

    // Switch to Settings tab
    const settingsBtn = screen.getByRole('button', { name: /^settings$/i });
    fireEvent.click(settingsBtn);

    // Verify Title & Subtitle matching WebRoles.dc.html
    expect(screen.getByRole('heading', { level: 1, name: 'Who can do what' })).toBeInTheDocument();
    expect(screen.getByText(/people have access beyond their own household · 248 do not/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /give someone access/i })).toBeInTheDocument();

    // Verify Table Column Headers
    expect(screen.getByText('PERSON')).toBeInTheDocument();
    expect(screen.getByText('CAN DO')).toBeInTheDocument();
    expect(screen.getByText('GIVEN BY, AND WHEN')).toBeInTheDocument();

    // Verify Role Holders
    expect(screen.getByText('Lidya Suryani')).toBeInTheDocument();
    expect(screen.getByText('Andreas Wibowo')).toBeInTheDocument();
    expect(screen.getByText('Budi Halim')).toBeInTheDocument();
    expect(screen.getByText('Pdt. Marulitua Hutagalung')).toBeInTheDocument();

    // Verify Role Definitions Card
    expect(screen.getByText('What each one actually means')).toBeInTheDocument();
    expect(screen.getByText('Taking access away')).toBeInTheDocument();

    // Verify Footer note mentioning Maruli and Grace
    expect(screen.getByText(/Maruli has led Harapan for eighteen months/i)).toBeInTheDocument();
  });

  it('TestWebRoles_EnforceMinTwoAdministrators', () => {
    render(<WebRoles />);

    // Table initially has exactly 2 administrators (Andreas Wibowo, Pdt. Marulitua Hutagalung)
    // Find the row for Andreas Wibowo and click Remove
    const andreasRow = screen.getByText('Andreas Wibowo').closest('div[class*="flex items-center"]')!;
    const removeBtn = andreasRow.querySelector('button')!;
    fireEvent.click(removeBtn);

    // Safety guard intercepts and shows error banner (SPEC-4-03, WebRoles.dc.html)
    expect(
      screen.getByText(/cannot remove administrator: church must maintain at least two administrators/i)
    ).toBeInTheDocument();

    // Andreas Wibowo remains in the table
    expect(screen.getByText('Andreas Wibowo')).toBeInTheDocument();
  });

  it('TestWebRoles_GrantAccessModal', () => {
    const handleGrant = vi.fn();
    render(<WebRoles onGrantRole={handleGrant} />);

    // Click Give someone access
    const giveBtn = screen.getByRole('button', { name: /give someone access/i });
    fireEvent.click(giveBtn);

    // Modal appears
    expect(screen.getByRole('heading', { level: 3, name: 'Give Someone Access' })).toBeInTheDocument();

    // Fill form
    const nameInput = screen.getByPlaceholderText(/e.g. Kevin Prasetyo/i);
    fireEvent.change(nameInput, { target: { value: 'Kevin Prasetyo' } });

    const submitBtn = screen.getByRole('button', { name: /grant access/i });
    fireEvent.click(submitBtn);

    // Callback invoked
    expect(handleGrant).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: 'Kevin Prasetyo',
        role: 'Church office',
      })
    );

    // New holder appears in the table
    expect(screen.getByText('Kevin Prasetyo')).toBeInTheDocument();
  });
});
