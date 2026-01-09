'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import { PagesUrls } from '@/enums';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { useVerifyAuthentication } from '@/services';

export const useUser = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { data } = useVerifyAuthentication();

  const isOwner = (userIdToCheck?: string): boolean => {
    if (!userId) return false;
    if (!userIdToCheck) return false;
    return userId === userIdToCheck;
  };

  const logout = async () => {
    try {
      await supabaseClient.auth.signOut();
      setUserId(null);
      redirect(PagesUrls.HOME);
    } catch (error) {
      toast.error('Error al cerrar sesión', {
        description: `No pudimos cerrar tu sesión. Inténtalo de nuevo. ${error}`,
      });
    }
  };
  // TODO: revisar aca por lass dudas
  useEffect(() => {
    setUserId(data?.userId ?? null);
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      setUserId(session?.user?.id ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [data]);

  return {
    userId,
    isAuthenticated: Boolean(userId),
    loading,
    logout,
    isOwner,
  };
};
