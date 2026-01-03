'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabase-client';
import { PagesUrls } from '@/enums';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { verifyAuthentication } from '@/services';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await verifyAuthentication();
        setUser(user);
      } catch (error: unknown) {
        toast.error('Error al obtener usuario:', { description: (error as Error)?.message });
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await supabaseClient.auth.signOut();
      setUser(null);
      redirect(PagesUrls.HOME);
    } catch (error) {
      toast.error('Error al cerrar sesión', {
        description: `No pudimos cerrar tu sesión. Inténtalo de nuevo. ${error}`,
      });
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    logout,
  };
};
