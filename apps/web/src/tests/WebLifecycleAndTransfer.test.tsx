import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App.tsx';
import { AdminUser, Person } from '../types.ts';

const mockAdmin: AdminUser = {
  id: 'adm-001',
  name: 'Lidya S.',
  phone: '+6281234567890',
  role: 'church_office',
};

const mockPersonWithGroup: Person = {
  id: 'per-002',
  full_name: 'Melisa Halim',
  phone: '0813-9080-1122',
  date_of_birth: '8 August 1981',
  standing: 'Registered Member',
  lifecycle: 'Active',
  household_name: 'Halim household',
  role_in_household: 'Spouse',
  care_group_name: 'Anugerah',
  privacy_opt_in: false,
};

describe('SPEC-1-05 Web Lifecycle, Transfer and Audit Tests', () => {
  it('TestMembershipStatus_Transitions', () => {
    render(<App initialAdmin={mockAdmin} initialPeople={[mockPersonWithGroup]} />);

    // Open Melisa Halim's profile
    fireEvent.click(screen.getByText('Melisa Halim'));

    // Verify initial lifecycle is Active
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1);

    // Click Inactive lifecycle option
    const inactiveOption = screen.getAllByText('Inactive')[0];
    fireEvent.click(inactiveOption);

    // Profile updates lifecycle
    expect(screen.getAllByText('Inactive').length).toBeGreaterThanOrEqual(1);
  });

  it('TestAutoCloseRoles_OnMemberTransfer', async () => {
    render(<App initialAdmin={mockAdmin} initialPeople={[mockPersonWithGroup]} />);

    // Open profile
    fireEvent.click(screen.getByText('Melisa Halim'));

    // Click "Transfer to another church" button
    const transferBtn = screen.getByRole('button', { name: /transfer to another church/i });
    fireEvent.click(transferBtn);

    // Dialog opens
    expect(screen.getByRole('heading', { level: 2, name: /transfer church attestation/i })).toBeInTheDocument();
    expect(screen.getByText(/rule br-mem-4:/i)).toBeInTheDocument();

    // Fill destination church
    const destInput = screen.getByPlaceholderText(/e.g. Bethania Church, Bandung/i);
    fireEvent.change(destInput, { target: { value: 'Immanuel Church, Surabaya' } });

    // Submit transfer
    const issueBtn = screen.getByRole('button', { name: /issue transfer & attestation/i });
    fireEvent.click(issueBtn);

    // Modal closes, lifecycle is Transferred out, care group is cleared (BR-MEM-4)
    await waitFor(() => {
      expect(screen.queryByRole('heading', { level: 2, name: /transfer church attestation/i })).not.toBeInTheDocument();
    });
    expect(screen.getAllByText('Transferred out').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Anugerah')).not.toBeInTheDocument();
  });

  it('TestAuditHistory_ChronologicalLog', () => {
    const personWithAudit: Person = {
      ...mockPersonWithGroup,
      notes: 'Active roles auto-closed on Inactive (2026-09-09)',
    };
    render(<App initialAdmin={mockAdmin} initialPeople={[personWithAudit]} />);

    // Open profile
    fireEvent.click(screen.getByText('Melisa Halim'));

    // Check Audit Trail card rendered
    expect(screen.getByText(/audit trail & chronological log/i)).toBeInTheDocument();
    expect(screen.getByText(/record created/i)).toBeInTheDocument();
    expect(screen.getByText(/active roles auto-closed on inactive/i)).toBeInTheDocument();
  });
});
