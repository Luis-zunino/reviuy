import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { PropsWithChildren } from 'react';

export interface ProfileSectionListProps extends PropsWithChildren {
  title: string;
  actionButton?: () => void;
  actionButtonLabel?: string;
}
export const ProfileSectionList = (props: ProfileSectionListProps) => {
  const { title, actionButton, actionButtonLabel } = props;
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {actionButton ? (
          <Button onClick={actionButton} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden md:flex">{actionButtonLabel || 'Action'}</span>
          </Button>
        ) : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{props.children}</div>
    </section>
  );
};
