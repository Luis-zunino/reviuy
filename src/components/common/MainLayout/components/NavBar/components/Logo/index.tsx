import { PagesUrls } from '@/enums';
import Link from 'next/link';

export const Logo = () => {
  return (
    <div className="flex items-center gap-1 rounded-lg px-4 py-4">
      <Link href={PagesUrls.HOME} className="text-xl font-semibold">
        <span className="text-foreground">Revi</span>
        <span className="text-muted-foreground">Uy</span>
      </Link>
    </div>
  );
};
