import React from 'react';
import { BackButton } from '../BackButton';
import type { HeaderProps } from './types';

export const Header = (props: HeaderProps) => {
  const { title, subtitle } = props;
  return (
    <header className="mb-8 flex gap-2">
      <BackButton />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle ? <p className="text-gray-600 mt-2">{subtitle}</p> : null}
      </div>
    </header>
  );
};
