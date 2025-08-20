import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

export const BackButton = (props: { handleOnClick: () => void }) => {
  const { handleOnClick } = props;
  return (
    <Button variant="ghost" size="icon" onClick={handleOnClick} aria-label="Go back to home">
      <ArrowLeft />
    </Button>
  );
};
