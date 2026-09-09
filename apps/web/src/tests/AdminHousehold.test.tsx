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

describe('SPEC-1-03 Web Admin Household Tests', () => {
  it('TestAdminHousehold_FullPageRender', () => {
    render(<App initialAdmin={mockAdmin} />);

    // Switch to Households tab
    const householdsNav = screen.getByRole('button', { name: /^households$/i });
    fireEvent.click(householdsNav);

    // Verify Household Title and metadata
    expect(screen.getByRole('heading', { level: 1, name: 'Keluarga Prasetyo' })).toBeInTheDocument();
    expect(screen.getAllByText(/Sunter Agung Q4\/12/i).length).toBeGreaterThan(0);

    // Verify Action buttons
    expect(screen.getByRole('button', { name: /print family card/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add a person here/i })).toBeInTheDocument();

    // Verify Sections matching AdminHousehold.dc.html
    expect(screen.getByText('WHERE THIS HOUSEHOLD IS')).toBeInTheDocument();
    expect(screen.getByText('FAMILY')).toBeInTheDocument();
    expect(screen.getByText('ALSO LIVES HERE')).toBeInTheDocument();
    expect(screen.getByText('MOVED OUT')).toBeInTheDocument();

    // Verify key members render in appropriate sections
    expect(screen.getAllByText('Bambang Prasetyo').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Sri Prasetyo')).toBeInTheDocument();
    expect(screen.getByText('Nuraini')).toBeInTheDocument();
    expect(screen.getByText('Household helper')).toBeInTheDocument();
    expect(screen.getByText('Melisa Tanudjaja')).toBeInTheDocument();
    expect(screen.getByText(/married January 2024/i)).toBeInTheDocument();

    // Verify OpenStreetMap attribution
    expect(screen.getByText('© OpenStreetMap')).toBeInTheDocument();
  });

  it('TestHeadOfHousehold_EnforceSingleHead', async () => {
    render(<App initialAdmin={mockAdmin} />);

    // Switch to Households tab
    fireEvent.click(screen.getByRole('button', { name: /^households$/i }));

    // Initial head: Bambang Prasetyo is Head of household
    expect(screen.getByText('Head of household')).toBeInTheDocument();

    // Sri Prasetyo has "Make head" button
    const makeHeadBtns = screen.getAllByRole('button', { name: /make head/i });
    expect(makeHeadBtns.length).toBeGreaterThan(0);

    // Click "Make head" on Sri Prasetyo
    fireEvent.click(makeHeadBtns[0]);

    // Now Sri Prasetyo is Head of household, Bambang was demoted, exactly one head exists (BR-1)
    const heads = screen.getAllByText('Head of household');
    expect(heads.length).toBe(1);
  });
});
