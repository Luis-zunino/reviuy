import { ProfileComponent } from '@/components/features/Profile';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata({
  title: 'Mi Perfil | ReviUy',
  description: 'Administra tu perfil, reseñas y configuraciones en ReviUy.',
  path: '/profile',
});

const ProfilePage = () => {
  return <ProfileComponent />;
};

export default ProfilePage;
