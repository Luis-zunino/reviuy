import { ProfileComponent } from '@/components/features/Profile';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Mi Perfil | ReviUy',
  description: 'Administra tu perfil, reseñas y configuraciones en ReviUy.',
};

const ProfilePage = () => {
  return <ProfileComponent />;
};

export default ProfilePage;
