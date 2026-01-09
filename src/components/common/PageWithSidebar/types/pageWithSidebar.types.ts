export interface PageWithSidebarProps {
  title: string;
  description: string;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  headerClassName?: string;
  sidebarClassName?: string;
  contentClassName?: string;
}
