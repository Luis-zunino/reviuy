import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthContext } from '../constants';
import { useAuthContext } from './useAuthContext.hook';

const Consumer = () => {
  const { loading, isAuthenticated } = useAuthContext();

  return (
    <div>
      <span>loading:{String(loading)}</span>
      <span>auth:{String(isAuthenticated)}</span>
    </div>
  );
};

describe('useAuthContext', () => {
  it('usa valores del provider cuando existe uno en el arbol', () => {
    const value = {
      loading: false,
      isAuthenticated: true,
      signOut: vi.fn().mockResolvedValue(undefined),
      signInWithEmail: vi.fn().mockResolvedValue(undefined),
      signInWithGoogle: vi.fn().mockResolvedValue(undefined),
    };

    render(
      <AuthContext.Provider value={value}>
        <Consumer />
      </AuthContext.Provider>
    );

    expect(screen.getByText('loading:false')).toBeInTheDocument();
    expect(screen.getByText('auth:true')).toBeInTheDocument();
  });

  it('cae al valor por defecto del contexto cuando no hay provider', () => {
    render(<Consumer />);

    expect(screen.getByText('loading:true')).toBeInTheDocument();
    expect(screen.getByText('auth:false')).toBeInTheDocument();
  });
});
