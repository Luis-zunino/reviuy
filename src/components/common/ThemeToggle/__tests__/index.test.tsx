// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const mockSetTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({ setTheme: mockSetTheme })),
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: (props: any) => <div>{props.children}</div>,
  DropdownMenuTrigger: (props: any) => <div>{props.children}</div>,
  DropdownMenuContent: (props: any) => <div>{props.children}</div>,
  DropdownMenuItem: (props: any) => <button onClick={props.onClick}>{props.children}</button>,
}));

describe('ThemeToggle', () => {
  it('renders theme toggle button with aria-label', async () => {
    const { ThemeToggle } = await import('../index');
    render(<ThemeToggle />);
    expect(screen.getByLabelText('Cambiar tema')).toBeInTheDocument();
  });

  it('changes theme to light when Claro is clicked', async () => {
    const user = userEvent.setup();
    const { ThemeToggle } = await import('../index');
    render(<ThemeToggle />);

    await user.click(screen.getByText('Claro'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('changes theme to dark when Oscuro is clicked', async () => {
    const user = userEvent.setup();
    const { ThemeToggle } = await import('../index');
    render(<ThemeToggle />);

    await user.click(screen.getByText('Oscuro'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('changes theme to system when Sistema is clicked', async () => {
    const user = userEvent.setup();
    const { ThemeToggle } = await import('../index');
    render(<ThemeToggle />);

    await user.click(screen.getByText('Sistema'));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});
