import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App.tsx';
import { WebChurchCode } from '../components/WebChurchCode.tsx';
import { AdminUser } from '../types.ts';

const mockAdmin: AdminUser = {
  id: 'adm-001',
  name: 'Lidya S.',
  phone: '+6281234567890',
  role: 'church_office',
};

describe('SPEC-4-01 Web Church Code & QR Print Generator Tests', () => {
  it('TestWebChurchCode_PrintPosterRender', () => {
    render(<App initialAdmin={mockAdmin} />);

    // Switch to Church code tab
    const churchCodeBtn = screen.getByRole('button', { name: /^church code$/i });
    fireEvent.click(churchCodeBtn);

    // Verify Title & Subtitle matching WebChurchCode.dc.html
    expect(screen.getByRole('heading', { level: 1, name: 'Church code' })).toBeInTheDocument();
    expect(screen.getByText(/how people find immanuel church, sunter in the app/i)).toBeInTheDocument();

    // Verify Top Action buttons
    expect(screen.getByRole('button', { name: /rotate code/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download qr poster/i })).toBeInTheDocument();

    // Verify Code display and copy action
    expect(screen.getAllByText('GRC-BDG').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/capitals do not matter/i)).toBeInTheDocument();
    expect(screen.getByText(/copy code & deep link/i)).toBeInTheDocument();

    // Verify Reach Card
    expect(screen.getByText('312')).toBeInTheDocument();
    expect(screen.getByText(/devices following this church/i)).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getByText(/signed in/i)).toBeInTheDocument();
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/applications waiting/i)).toBeInTheDocument();

    // Verify "Two things to decide out loud" card
    expect(screen.getByText(/two things to decide out loud/i)).toBeInTheDocument();
    expect(screen.getByText(/listed by name\?/i)).toBeInTheDocument();
    expect(screen.getByText(/messages by whatsapp\?/i)).toBeInTheDocument();

    // Verify "Anyone with the code can see" card
    expect(screen.getByText(/anyone with the code can see/i)).toBeInTheDocument();
    expect(screen.getByText(/service times, speaker and location/i)).toBeInTheDocument();
    expect(screen.getByText(/names, phone numbers, addresses/i)).toBeInTheDocument();
  });

  it('TestWebChurchCode_RotateCodeModal', () => {
    const handleRotate = vi.fn();
    render(<WebChurchCode onRotateCode={handleRotate} />);

    // Click Rotate Code
    const rotateBtn = screen.getByRole('button', { name: /rotate code/i });
    fireEvent.click(rotateBtn);

    // Warning Modal opens
    expect(screen.getByRole('heading', { level: 3, name: 'Rotate Church Code?' })).toBeInTheDocument();
    expect(screen.getByText(/generating a new code immediately invalidates/i)).toBeInTheDocument();

    // Confirm rotate
    const confirmBtn = screen.getByRole('button', { name: /confirm rotate/i });
    fireEvent.click(confirmBtn);

    expect(handleRotate).toHaveBeenCalled();
  });

  it('TestWebChurchCode_PrintPosterModal', () => {
    render(<WebChurchCode />);

    // Click Download QR poster
    const posterBtn = screen.getByRole('button', { name: /download qr poster/i });
    fireEvent.click(posterBtn);

    // Poster Modal opens
    expect(screen.getByRole('heading', { level: 2, name: /welcome to immanuel church, sunter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /print poster/i })).toBeInTheDocument();
  });
});
