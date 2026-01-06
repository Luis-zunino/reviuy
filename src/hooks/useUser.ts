'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabase-client';
import { PagesUrls } from '@/enums';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { useVerifyAuthentication } from '@/services';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data } = useVerifyAuthentication();

  const isOwner = (userId?: string): boolean => {
    if (!user?.id) return false;
    if (!userId) return false;
    return user.id === userId;
  };

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
  // TODO: revisar aca por lass dudas
  useEffect(() => {
    setUser(data?.user ?? null);
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [data]);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    logout,
    isOwner,
  };
};
