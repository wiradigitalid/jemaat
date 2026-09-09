import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App.tsx';
import { WebApplicants } from '../components/WebApplicants.tsx';
import { AdminUser } from '../types.ts';

const mockAdmin: AdminUser = {
  id: 'adm-001',
  name: 'Lidya S.',
  phone: '+6281234567890',
  role: 'church_office',
};

describe('SPEC-4-02 Web Applicants Queue & Onboarding Triage Tests', () => {
  it('TestWebApplicants_SplitPaneRender', () => {
    render(<App initialAdmin={mockAdmin} />);

    // Switch to Applicants tab
    const applicantsBtn = screen.getByRole('button', { name: /^applicants 5$/i });
    fireEvent.click(applicantsBtn);

    // Verify Title & Subtitle matching WebApplicants.dc.html
    expect(screen.getAllByRole('heading', { name: 'Applicants' }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/5 waiting · oldest submitted 4 days ago/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /export list/i }).length).toBeGreaterThanOrEqual(1);

    // Verify Left Pane: Applicant cards
    expect(screen.getAllByText('Rian Wijaya').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Grace Sutanto')).toBeInTheDocument();
    expect(screen.getByText('Fandi Tobing')).toBeInTheDocument();
    expect(screen.getByText('Sinta Rahmat')).toBeInTheDocument();
    expect(screen.getByText('Hendra Lie')).toBeInTheDocument();

    // Verify Right Pane: Selected applicant detail (Rian Wijaya)
    expect(screen.getByRole('heading', { level: 2, name: 'Rian Wijaya' })).toBeInTheDocument();
    expect(screen.getByText('+62 812-1234-5678')).toBeInTheDocument();
    expect(screen.getAllByText('Over a year').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Bethania Church, Bandung/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Community Member/i).length).toBeGreaterThanOrEqual(1);

    // Verify Placement form
    expect(screen.getByText('Confirm and place')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm as community member/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /needs a conversation/i })).toBeInTheDocument();
    expect(screen.getByText(/already on our roll/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  });

  it('TestApplicantAdmit_PromoteToMember', () => {
    const handleAdmit = vi.fn();
    render(<WebApplicants onAdmitApplicant={handleAdmit} />);

    // Click Confirm as Community Member
    const confirmBtn = screen.getByRole('button', { name: /confirm as community member/i });
    fireEvent.click(confirmBtn);

    // Callback invoked
    expect(handleAdmit).toHaveBeenCalledWith('app-01', expect.objectContaining({
      membership_status: 'Community Member',
    }));

    // Status updates
    expect(screen.getByText('Admitted as Member')).toBeInTheDocument();
    expect(screen.getByText('Admitted')).toBeInTheDocument();
  });

  it('TestApplicantContact_NeedsConversation', () => {
    const handleContact = vi.fn();
    render(<WebApplicants onContactApplicant={handleContact} />);

    // Click Needs a conversation
    const convoBtn = screen.getByRole('button', { name: /needs a conversation/i });
    fireEvent.click(convoBtn);

    // Modal appears
    expect(screen.getByRole('heading', { level: 3, name: /needs a conversation/i })).toBeInTheDocument();

    const notesTextarea = screen.getByPlaceholderText(/discussed baptism background/i);
    fireEvent.change(notesTextarea, { target: { value: 'Called via WhatsApp, arranged coffee chat on Tuesday' } });

    const saveBtn = screen.getByRole('button', { name: /save notes/i });
    fireEvent.click(saveBtn);

    expect(handleContact).toHaveBeenCalledWith('app-01', 'Called via WhatsApp, arranged coffee chat on Tuesday');
    expect(screen.getByText('Contacted')).toBeInTheDocument();
  });
});
