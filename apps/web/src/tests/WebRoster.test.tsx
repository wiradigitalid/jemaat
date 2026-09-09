import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App.tsx';
import { WebRoster } from '../components/WebRoster.tsx';
import { AdminUser } from '../types.ts';

const mockAdmin: AdminUser = {
  id: 'adm-001',
  name: 'Lidya S.',
  phone: '+6281234567890',
  role: 'church_office',
};

describe('SPEC-2-02 Web Admin Roster Matrix Tests', () => {
  it('TestWebRoster_GridStatusRendering', () => {
    render(<App initialAdmin={mockAdmin} />);

    // Switch to Serving tab
    const servingBtn = screen.getByRole('button', { name: /serving/i });
    fireEvent.click(servingBtn);

    // Verify Serving Roster Title and Subtitle matching WebRoster.dc.html
    expect(screen.getByRole('heading', { level: 1, name: 'Serving roster' })).toBeInTheDocument();
    expect(screen.getByText(/March 2026 · 4 teams · 4 service dates/i)).toBeInTheDocument();

    // Verify Action buttons
    expect(screen.getByRole('button', { name: /march 2026/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view departments/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send whatsapp reminders/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add duty/i })).toBeInTheDocument();

    // Verify Status Summary Chips
    expect(screen.getByText(/3 open slots/i)).toBeInTheDocument();
    expect(screen.getByText(/4 not confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/19 confirmed/i)).toBeInTheDocument();

    // Verify Matrix Dates
    expect(screen.getByText('SAT 7 MAR')).toBeInTheDocument();
    expect(screen.getByText('SAT 14 MAR')).toBeInTheDocument();
    expect(screen.getByText('SAT 21 MAR')).toBeInTheDocument();
    expect(screen.getByText('SAT 28 MAR')).toBeInTheDocument();

    // Verify All 4 Teams matching WebRoster.dc.html
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Hospitality')).toBeInTheDocument();
    expect(screen.getByText('Preaching')).toBeInTheDocument();

    // Verify External volunteers & "Not on our roll" badges
    expect(screen.getByText('Rio Panjaitan')).toBeInTheDocument();
    expect(screen.getAllByText('Samuel Kartono').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Not on our roll').length).toBeGreaterThanOrEqual(2);

    // Verify Volunteers and Open Slots
    expect(screen.getAllByText('Gavriel Halim').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Melisa Halim')).toBeInTheDocument();
    expect(screen.getAllByText('Open slot').length).toBe(3);
  });

  it('TestSubstituteAssignment_OnDeclineOrPending', () => {
    const handleSubstitute = vi.fn();
    render(<WebRoster onAssignSubstitute={handleSubstitute} />);

    // Click on unconfirmed slot (Gavriel Halim on SAT 28 MAR)
    const unconfirmedSlot = screen.getAllByText('Gavriel Halim')[1];
    fireEvent.click(unconfirmedSlot);

    // Verify Substitute Modal appears
    expect(screen.getByRole('heading', { level: 3, name: 'Assign Substitute Volunteer' })).toBeInTheDocument();
    expect(screen.getByText('SUBSTITUTE CANDIDATE')).toBeInTheDocument();

    // Enter substitute name and submit
    const subInput = screen.getByPlaceholderText(/e.g. Andreas Wibowo/i);
    fireEvent.change(subInput, { target: { value: 'Budi Halim' } });

    const confirmBtn = screen.getByRole('button', { name: /confirm substitute/i });
    fireEvent.click(confirmBtn);

    // Callback invoked
    expect(handleSubstitute).toHaveBeenCalledWith('asg-04', 'Budi Halim');

    // Matrix cell displays the new substitute assignee
    expect(screen.getAllByText('Budi Halim').length).toBe(2);
    expect(screen.getByText(/Substitute for Gavriel Halim: Budi Halim/i)).toBeInTheDocument();
  });

  it('TestOpenSlot_VolunteerAssignmentModal', () => {
    render(<WebRoster />);

    // Click on an open slot (Sound desk unfilled)
    const openSlot = screen.getByText('Sound desk unfilled');
    fireEvent.click(openSlot);

    // Verify Slot Assignment Modal appears
    expect(screen.getByRole('heading', { level: 3, name: 'Assign Volunteer to Slot' })).toBeInTheDocument();
    expect(screen.getByText('VOLUNTEER NAME')).toBeInTheDocument();

    // Enter volunteer name and assign
    const volInput = screen.getByPlaceholderText(/e.g. Fandi Tanuwijaya/i);
    fireEvent.change(volInput, { target: { value: 'Fandi Tanuwijaya' } });

    const assignBtn = screen.getByRole('button', { name: /assign slot/i });
    fireEvent.click(assignBtn);

    // Slot is now assigned to Fandi Tanuwijaya
    expect(screen.getByText('Fandi Tanuwijaya')).toBeInTheDocument();
  });
});
