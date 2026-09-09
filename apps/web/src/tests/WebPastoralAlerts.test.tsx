import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WebPastoralAlerts } from '../components/WebPastoralAlerts.tsx';

describe('SPEC-3-02 Web Pastoral Care & Meeting Reports Tests', () => {
  it('TestPastoralAlerts_RenderQueueAndDetail', () => {
    render(<WebPastoralAlerts />);

    // Verify Header
    expect(screen.getByRole('heading', { level: 1, name: /pastoral care & attendance/i })).toBeInTheDocument();
    expect(screen.getByText(/3 consecutive unexcused absences \(BR-3\)/i)).toBeInTheDocument();

    // Verify Left Pane: Flagged members
    expect(screen.getAllByText('Dedi Kurnia').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Samuel Lubis')).toBeInTheDocument();
    expect(screen.getAllByText(/3 missed meetings/i).length).toBeGreaterThanOrEqual(2);

    // Verify Right Pane: Detail view
    expect(screen.getAllByText(/Anugerah/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('+62 812-9988-7766')).toBeInTheDocument();
    expect(screen.getByText(/3 unexcused \(BR-3\)/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  });

  it('TestPastoralAlerts_LogConversationNotes', () => {
    const handleContact = vi.fn();
    render(<WebPastoralAlerts onContactAlert={handleContact} />);

    // Enter pastoral notes
    const textarea = screen.getByPlaceholderText(/recovering from hospital visit/i);
    fireEvent.change(textarea, {
      target: { value: 'Spoke with Dedi. Recovering well and requested visit next Tuesday.' },
    });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /log contact & mark contacted/i });
    fireEvent.click(submitBtn);

    // Callback invoked
    expect(handleContact).toHaveBeenCalledWith(
      'alt-001',
      'Spoke with Dedi. Recovering well and requested visit next Tuesday.'
    );

    // Shows updated status
    expect(screen.getAllByText('Contacted').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/PREVIOUS PASTORAL LOG/i)).toBeInTheDocument();
  });

  it('TestPastoralAlerts_DismissAlert', () => {
    const handleDismiss = vi.fn();
    render(<WebPastoralAlerts onDismissAlert={handleDismiss} />);

    // Click Dismiss Alert button
    const dismissBtn = screen.getByRole('button', { name: /^dismiss alert$/i });
    fireEvent.click(dismissBtn);

    // Modal appears
    expect(screen.getByRole('heading', { level: 3, name: 'Dismiss Absence Alert' })).toBeInTheDocument();

    const reasonInput = screen.getByPlaceholderText(/e.g. Excused travel/i);
    fireEvent.change(reasonInput, { target: { value: 'Excused travel to Surabaya' } });

    const confirmDismiss = screen.getByRole('button', { name: /confirm dismiss/i });
    fireEvent.click(confirmDismiss);

    expect(handleDismiss).toHaveBeenCalledWith('alt-001', 'Excused travel to Surabaya');
    expect(screen.getAllByText('Dismissed').length).toBeGreaterThanOrEqual(1);
  });

  it('TestMeetingReports_TableView', () => {
    render(<WebPastoralAlerts />);

    // Switch to Meeting reports tab
    const meetingTabBtn = screen.getByRole('button', { name: /meeting reports/i });
    fireEvent.click(meetingTabBtn);

    // Verify Meeting list
    expect(screen.getByText('Small Group Meeting Records')).toBeInTheDocument();
    expect(screen.getByText('WED 4 MAR')).toBeInTheDocument();
    expect(screen.getByText('Walking in Faith Part 3')).toBeInTheDocument();
    expect(screen.getByText('Host: Melisa Tanudjaja')).toBeInTheDocument();
    expect(screen.getByText('10 present')).toBeInTheDocument();
    expect(screen.getByText('2 guests')).toBeInTheDocument();
  });
});
