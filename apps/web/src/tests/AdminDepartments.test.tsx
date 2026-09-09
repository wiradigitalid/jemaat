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

describe('SPEC-2-01 Web Admin Departments Tests', () => {
  it('TestAdminDepartments_CardRender', () => {
    render(<App initialAdmin={mockAdmin} />);

    // Switch to Serving & Rosters
    const servingBtn = screen.getByRole('button', { name: /serving/i });
    fireEvent.click(servingBtn);

    // Verify Title and Subtitle matching AdminDepartments.dc.html
    expect(screen.getByRole('heading', { level: 1, name: 'Departments and serving roles' })).toBeInTheDocument();
    expect(screen.getByText(/departments ·/i)).toBeInTheDocument();

    // Verify Department Cards
    expect(screen.getAllByText('Music').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Multimedia')).toBeInTheDocument();
    expect(screen.getByText('Prayer')).toBeInTheDocument();
    expect(screen.getByText('Teaching')).toBeInTheDocument();
    expect(screen.getByText('Hospitality')).toBeInTheDocument();

    // Verify Role column headers and roles in selected Music department
    expect(screen.getByText('SERVING ROLE')).toBeInTheDocument();
    expect(screen.getByText('INTERESTED')).toBeInTheDocument();
    expect(screen.getByText('Worship Leader')).toBeInTheDocument();
    expect(screen.getByText('Acoustic Guitar')).toBeInTheDocument();

    // Verify Pane 3: Interested in Music
    expect(screen.getByText('Interested in Music')).toBeInTheDocument();
    expect(screen.getByText('Yosafat Prasetyo')).toBeInTheDocument();
  });

  it('TestAdminDepartmentsEmpty_Render', () => {
    render(<App initialAdmin={mockAdmin} initialTeams={[]} />);

    // Switch to Serving
    fireEvent.click(screen.getByRole('button', { name: /serving/i }));

    // Verify Empty State matching AdminDepartmentsEmpty.dc.html
    expect(screen.getByRole('heading', { level: 2, name: 'No departments yet' })).toBeInTheDocument();
    expect(
      screen.getByText(/A department is a team in your church/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add the first department/i })).toBeInTheDocument();
  });
});
