import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App.tsx';
import { Person, AdminUser } from '../types.ts';

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
    date_of_birth: '12 May 1978',
    age: 48,
    standing: 'Registered Member',
    lifecycle: 'Active',
    household_name: 'Halim household',
    role_in_household: 'Head',
    care_group_name: 'Anugerah',
    privacy_opt_in: false,
  },
  {
    id: 'per-002',
    full_name: 'Melisa Halim',
    phone: '0813-9080-1122',
    date_of_birth: '8 August 1981',
    age: 45,
    standing: 'Registered Member',
    lifecycle: 'Active',
    household_name: 'Halim household',
    role_in_household: 'Spouse',
    care_group_name: 'Anugerah',
    privacy_opt_in: false,
  },
  {
    id: 'per-003',
    full_name: 'Gavriel Halim',
    phone: '—',
    date_of_birth: '22 October 2012',
    age: 14,
    standing: 'Member',
    lifecycle: 'Active',
    household_name: 'Halim household',
    role_in_household: 'Child',
    care_group_name: 'Anugerah',
    privacy_opt_in: true,
  },
];

describe('SPEC-1-02 Web Admin People Tests', () => {
  it('TestWebEmpty_RenderWhenZeroMembers', () => {
    render(<App initialAdmin={mockAdmin} initialPeople={[]} />);

    // Must show empty state heading and copy
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing here yet' })).toBeInTheDocument();
    expect(
      screen.getByText(/A household holds the address. A person holds their standing./i)
    ).toBeInTheDocument();

    // Must show primary action
    expect(screen.getAllByRole('button', { name: /add the first person/i })[0]).toBeInTheDocument();

    // Must show the ordering guide
    expect(screen.getByText(/an hour, in this order/i)).toBeInTheDocument();
    expect(screen.getByText('Add your church council or elders')).toBeInTheDocument();
  });

  it('TestWebPeople_TableRenderWithPrivacyMasking', () => {
    render(<App initialAdmin={mockAdmin} initialPeople={mockPeople} />);

    // Table rows render with member names
    expect(screen.getByText('Budi Halim')).toBeInTheDocument();
    expect(screen.getByText('Melisa Halim')).toBeInTheDocument();
    expect(screen.getByText('Gavriel Halim')).toBeInTheDocument();
    expect(screen.getAllByText('Halim household').length).toBe(3);

    // Initial state: unmasked for admin view
    expect(screen.getByText('0812-1122-3344')).toBeInTheDocument();

    // Toggle Privacy Masking (AD-3, BR-4)
    const maskButton = screen.getByRole('button', { name: /mask contacts/i });
    fireEvent.click(maskButton);

    // Budi Halim (no opt-in) must now have masked phone
    expect(screen.queryByText('0812-1122-3344')).not.toBeInTheDocument();
    expect(screen.getByText('0812-••••-44')).toBeInTheDocument();

    // Search filtering
    const searchInput = screen.getByPlaceholderText(/search people/i);
    fireEvent.change(searchInput, { target: { value: 'Melisa' } });
    expect(screen.getByText('Melisa Halim')).toBeInTheDocument();
    expect(screen.queryByText('Budi Halim')).not.toBeInTheDocument();
  });

  it('TestAdminPersonNew_FormSubmit', async () => {
    render(<App initialAdmin={mockAdmin} initialPeople={mockPeople} />);

    // Click "Add person" action button
    const addBtn = screen.getByRole('button', { name: /add person/i });
    fireEvent.click(addBtn);

    // Verify modal appears
    expect(screen.getByRole('heading', { level: 2, name: 'Add a person' })).toBeInTheDocument();
    expect(screen.getByText('FULL NAME')).toBeInTheDocument();

    // Submit empty name -> error
    const saveCloseBtn = screen.getByRole('button', { name: /save and close/i });
    fireEvent.click(saveCloseBtn);
    expect(screen.getAllByText('Full name is required')[0]).toBeInTheDocument();

    // Fill valid name & phone
    const nameInput = screen.getByPlaceholderText(/e.g. Yosafat Prasetyo/i);
    fireEvent.change(nameInput, { target: { value: 'Yosafat Prasetyo' } });

    const phoneInput = screen.getByPlaceholderText('812-7788-2200');
    fireEvent.change(phoneInput, { target: { value: '812-7788-2200' } });

    // Submit valid person
    fireEvent.click(saveCloseBtn);

    // Modal closes and new person appears in table
    await waitFor(() => {
      expect(screen.queryByRole('heading', { level: 2, name: 'Add a person' })).not.toBeInTheDocument();
    });
    expect(screen.getByText('Yosafat Prasetyo')).toBeInTheDocument();
  });

  it('TestWebPerson_DetailViewAndLifecycle', () => {
    render(<App initialAdmin={mockAdmin} initialPeople={mockPeople} />);

    // Click on Budi Halim row to open profile
    const personRow = screen.getByText('Budi Halim');
    fireEvent.click(personRow);

    // Should render WebPerson profile matching WebPerson.dc.html
    expect(screen.getByRole('heading', { level: 1, name: 'Budi Halim' })).toBeInTheDocument();
    expect(screen.getByText('Halim household · Head')).toBeInTheDocument();
    expect(screen.getByText('History — kept in full')).toBeInTheDocument();
    expect(screen.getByText('Lifecycle in this church')).toBeInTheDocument();

    // Click Inactive lifecycle option
    const inactiveOption = screen.getByText('Inactive');
    fireEvent.click(inactiveOption);

    // Back to directory button
    const backBtn = screen.getByText(/back to people directory/i);
    fireEvent.click(backBtn);

    // Back in table view
    expect(screen.getByText('Budi Halim')).toBeInTheDocument();
  });
});
