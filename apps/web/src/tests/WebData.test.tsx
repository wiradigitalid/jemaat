import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App.tsx';
import { AdminUser } from '../types.ts';

const mockAdmin: AdminUser = {
  id: 'adm-001',
  name: 'Lidya S.',
  phone: '+6281234567890',
  role: 'church_office',
};

describe('SPEC-1-06 Web Admin Data Export Tests', () => {
  it('TestWebData_DownloadCardsRender', () => {
    render(<App initialAdmin={mockAdmin} />);

    // Navigate to Settings/Data Export view
    const settingsBtn = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsBtn);

    // Verify Title and Subtitle matching WebData.dc.html
    expect(screen.getByRole('heading', { level: 1, name: 'Your data' })).toBeInTheDocument();
    expect(screen.getByText(/four years of records/i)).toBeInTheDocument();

    // Verify "Download everything" top action
    expect(screen.getByRole('button', { name: /download everything/i })).toBeInTheDocument();

    // Verify Guidance text
    expect(screen.getByText(/take it, any time/i)).toBeInTheDocument();
    expect(
      screen.getByText(/It came in as a spreadsheet and it leaves as one/i)
    ).toBeInTheDocument();

    // Verify all 6 Categorical Cards
    expect(screen.getByText('People and households')).toBeInTheDocument();
    expect(screen.getByText('Meetings and attendance')).toBeInTheDocument();
    expect(screen.getByText('Care groups and serving')).toBeInTheDocument();
    expect(screen.getByText('Weeks, sermons, announcements')).toBeInTheDocument();
    expect(screen.getByText('Posters and photos')).toBeInTheDocument();
    expect(screen.getByText('Everything, machine readable')).toBeInTheDocument();

    // Verify format badges
    expect(screen.getAllByText('XLSX').length).toBe(4);
    expect(screen.getByText('ZIP')).toBeInTheDocument();
    expect(screen.getByText('JSON')).toBeInTheDocument();

    // Verify Footnote regarding operator logs & address masking
    expect(
      screen.getByText(/Only the office can download this/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Addresses are left out unless you ask for them./i)
    ).toBeInTheDocument();

    // Click on "People and households" download card
    const peopleCard = screen.getByText('People and households');
    fireEvent.click(peopleCard);

    // Notice appears
    expect(screen.getByText(/Downloading XLSX export for "People and households"/i)).toBeInTheDocument();
  });
});
