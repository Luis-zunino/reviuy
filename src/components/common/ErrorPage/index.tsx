import { type IErrorPageProps } from './types';

/**
 * ErrorPage component
 *
 * Renders an error page with a title and optional subtitle.
 * This component is responsible for displaying an error page.
 */
export const ErrorPage = ({ title, subTitle }: IErrorPageProps) => {
  return (
    <div className="flex flex-col justify-center items-center text-center p-4">
      <h3 className="text-xl font-semibold text-destructive mb-2">{title}</h3>
      {subTitle ? <p className="text-muted-foreground">{subTitle}</p> : null}
    </div>
  );
};
