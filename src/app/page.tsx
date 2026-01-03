import { PagesUrls } from '@/enums';
import { redirect } from 'next/navigation';

const RootPage = () => {
  redirect(PagesUrls.LOGIN);
  return null;
};

export default RootPage;
