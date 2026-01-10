import { PagesUrls } from '@/enums';
import { redirect } from 'next/navigation';

const RootPage = () => {
  redirect(PagesUrls.HOME);
  return null;
};

export default RootPage;
