import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WebRoster } from '../components/WebRoster.tsx';

describe('SPEC-2-03 Web Conflict Engine & Blockout Tests', () => {
  it('TestBlockoutConflict_DisplaysWarningAndRequiresOverride', () => {
    render(<WebRoster />);

    // Click on open slot in Preaching for SAT 28 MAR (srv-04)
    const openSlot = screen.getByText('Speaker not assigned');
    fireEvent.click(openSlot);

    // Verify modal is open
    expect(screen.getByRole('heading', { level: 3, name: 'Assign Volunteer to Slot' })).toBeInTheDocument();

    // Type volunteer who has registered blockout dates (Melisa Halim)
    const input = screen.getByPlaceholderText(/e.g. Fandi Tanuwijaya/i);
    fireEvent.change(input, { target: { value: 'Melisa Halim' } });

    // Conflict warning banner appears (BR-2)
    expect(screen.getByText(/Scheduling Conflict:/i)).toBeInTheDocument();
    expect(screen.getByText(/Blocked out from 2026-03-27 to 2026-03-31/i)).toBeInTheDocument();

    // Assign button is disabled
    const assignBtn = screen.getByRole('button', { name: /assign slot/i });
    expect(assignBtn).toBeDisabled();

    // Check override checkbox
    const overrideCheckbox = screen.getByRole('checkbox', {
      name: /override conflict \(requires coordinator justification\)/i,
    });
    fireEvent.click(overrideCheckbox);

    // Still disabled without reason
    expect(assignBtn).toBeDisabled();

    // Enter mandatory override reason (BR-SRV-3)
    const reasonInput = screen.getByPlaceholderText(/e.g. Confirmed phone availability for emergency cover/i);
    fireEvent.change(reasonInput, { target: { value: 'Phone confirmation received for guest preaching cover' } });

    // Now enabled
    expect(assignBtn).not.toBeDisabled();
    fireEvent.click(assignBtn);

    // Slot is updated with volunteer and shows Overridden badge
    expect(screen.getAllByText('Melisa Halim').length).toBe(2);
    expect(screen.getByText('Overridden')).toBeInTheDocument();
  });

  it('TestDoubleBookingConflict_DetectsOverlappingDuty', () => {
    render(<WebRoster />);

    // Click on open slot in Media on SAT 21 MAR (Sound desk unfilled)
    const openSlot = screen.getByText('Sound desk unfilled');
    fireEvent.click(openSlot);

    // Try to assign Intan Prasetyo who is already scheduled in Hospitality on SAT 21 MAR
    const input = screen.getByPlaceholderText(/e.g. Fandi Tanuwijaya/i);
    fireEvent.change(input, { target: { value: 'Intan Prasetyo' } });

    // Conflict detection engine catches pure double-booking without blockouts (AD-4)
    expect(screen.getByText(/Scheduling Conflict:/i)).toBeInTheDocument();
    expect(screen.getByText(/Already scheduled in Hospitality/i)).toBeInTheDocument();

    const assignBtn = screen.getByRole('button', { name: /assign slot/i });
    expect(assignBtn).toBeDisabled();
  });
});
