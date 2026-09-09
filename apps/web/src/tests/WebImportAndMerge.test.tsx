import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App.tsx';
import { AdminUser, Person } from '../types.ts';

const mockAdmin: AdminUser = {
  id: 'adm-001',
  name: 'Lidya S.',
  phone: '+6281234567890',
  role: 'church_office',
};

const mockPeople: Person[] = [
  {
    id: 'per-001',
    full_name: 'Budi Halim',
    phone: '0812-1122-3344',
    date_of_birth: '2 May 1977',
    standing: 'Registered Member',
    lifecycle: 'Active',
    household_name: 'Halim household',
    privacy_opt_in: false,
  },
];

describe('SPEC-1-04 Web Import and Merge Tests', () => {
  it('TestCSVImport_PreviewAndValidation', () => {
    render(<App initialAdmin={mockAdmin} initialPeople={mockPeople} />);

    // Click "Import from Excel" action button
    const importBtn = screen.getByRole('button', { name: /import from excel/i });
    fireEvent.click(importBtn);

    // Verify 4-step wizard rendered
    expect(screen.getByRole('heading', { level: 1, name: 'Import from Excel' })).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Match columns')).toBeInTheDocument();
    expect(screen.getByText('Review & Validate')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    // Verify column mapping table
    expect(screen.getByText('YOUR COLUMN')).toBeInTheDocument();
    expect(screen.getByText('FIRST ROW')).toBeInTheDocument();
    expect(screen.getByText('GOES TO')).toBeInTheDocument();
    expect(screen.getByText('NAMA')).toBeInTheDocument();
    expect(screen.getByText('ALAMAT')).toBeInTheDocument();

    // Verify validation summary box
    expect(screen.getByText(/validation summary/i)).toBeInTheDocument();
    expect(screen.getByText(/ready to import/i)).toBeInTheDocument();
    expect(screen.getByText(/duplicate protection active/i)).toBeInTheDocument();
  });

  it('TestWebMerge_ExecuteMerge', () => {
    render(<App initialAdmin={mockAdmin} initialPeople={mockPeople} />);

    // Click "Review Duplicates" action button
    const mergeBtn = screen.getByRole('button', { name: /review duplicates/i });
    fireEvent.click(mergeBtn);

    // Verify side-by-side comparison screen
    expect(screen.getByRole('heading', { level: 1, name: 'Two records, one person' })).toBeInTheDocument();
    expect(screen.getByText('WHY IT MATTERS')).toBeInTheDocument();
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('BORN')).toBeInTheDocument();
    expect(screen.getByText('PHONE')).toBeInTheDocument();
    expect(screen.getByText('HOUSEHOLD')).toBeInTheDocument();

    // Verify explanatory why-it-matters reasons
    expect(screen.getByText(/keep the complete official full name/i)).toBeInTheDocument();
    expect(screen.getByText(/never lose a valid date to an empty field/i)).toBeInTheDocument();

    // Execute Merge
    const mergeConfirmBtn = screen.getByRole('button', { name: /merge into one/i });
    fireEvent.click(mergeConfirmBtn);

    // Screen returns to people directory
    expect(screen.queryByRole('heading', { level: 1, name: 'Two records, one person' })).not.toBeInTheDocument();
    expect(screen.getByText('Budi Halim')).toBeInTheDocument();
  });
});
