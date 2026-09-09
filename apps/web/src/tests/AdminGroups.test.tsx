import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App.tsx';
import { AdminGroups } from '../components/AdminGroups.tsx';
import { AdminUser } from '../types.ts';

const mockAdmin: AdminUser = {
  id: 'adm-001',
  name: 'Lidya S.',
  phone: '+6281234567890',
  role: 'church_office',
};

describe('SPEC-3-01 Web Admin Care Groups Tests', () => {
  it('TestAdminGroups_3PaneLayoutRender', () => {
    render(<App initialAdmin={mockAdmin} />);

    // Switch to Care Groups tab
    const careGroupsBtn = screen.getByRole('button', { name: /^care groups$/i });
    fireEvent.click(careGroupsBtn);

    // Verify Header Bar
    expect(screen.getByRole('heading', { level: 1, name: 'Care groups' })).toBeInTheDocument();
    expect(screen.getByText(/5 groups · 61 of 248 people belong to one/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new group/i })).toBeInTheDocument();

    // Verify Left Pane: Care Groups List
    expect(screen.getAllByText('Anugerah').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Kasih')).toBeInTheDocument();
    expect(screen.getByText('Damai')).toBeInTheDocument();
    expect(screen.getByText('Setia')).toBeInTheDocument();
    expect(screen.getByText('Harapan')).toBeInTheDocument();

    // Verify Middle Pane: Selected Group Detail (Anugerah)
    expect(screen.getByText(/Sunter · 14 people · Wednesdays/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add member/i })).toBeInTheDocument();
    expect(screen.getByText('Budi Hartono')).toBeInTheDocument();
    expect(screen.getByText('Leader')).toBeInTheDocument();
    expect(screen.getByText('Melisa Tanudjaja')).toBeInTheDocument();
    expect(screen.getByText('Andreas Halim')).toBeInTheDocument();

    // Verify Right Pane: Asked to join queue
    expect(screen.getByText('Asked to join a group')).toBeInTheDocument();
    expect(screen.getByText(/people, none placed yet/i)).toBeInTheDocument();
    expect(screen.getByText('Rian Wijaya')).toBeInTheDocument();
    expect(screen.getByText('Sinta Rahmat')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /place/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('TestAdminGroups_PlaceUnplacedMember', () => {
    render(<AdminGroups />);

    // Rian Wijaya is in unplaced queue
    expect(screen.getByText('Rian Wijaya')).toBeInTheDocument();

    // Click "Place" on first unplaced person (Rian Wijaya)
    const placeButtons = screen.getAllByRole('button', { name: /place/i });
    fireEvent.click(placeButtons[0]);

    // Rian Wijaya is now placed in the group members list
    expect(screen.getByText('Rian Wijaya')).toBeInTheDocument();
  });

  it('TestAdminGroups_CreateNewGroup', () => {
    render(<AdminGroups />);

    // Click New Group
    const newGroupBtn = screen.getByRole('button', { name: /new group/i });
    fireEvent.click(newGroupBtn);

    // Modal opens
    expect(screen.getByRole('heading', { level: 3, name: 'Create New Care Group' })).toBeInTheDocument();

    // Fill form
    const nameInput = screen.getByPlaceholderText(/e.g. Solafide/i);
    fireEvent.change(nameInput, { target: { value: 'Solafide' } });

    const createBtn = screen.getByRole('button', { name: /create group/i });
    fireEvent.click(createBtn);

    // Group Solafide now in list and selected
    expect(screen.getAllByText('Solafide').length).toBeGreaterThanOrEqual(1);
  });
});
