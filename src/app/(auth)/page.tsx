import { PagesUrls } from '@/enums';
import { redirect } from 'next/navigation';

const RootAuthPage = () => {
  redirect(PagesUrls.LOGIN);
  return null;
};

export default RootAuthPage;
