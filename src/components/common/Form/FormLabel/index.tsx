import { Label } from '@/components/ui/label';
import React from 'react';
import type { FormLabelProps } from './types';

export const FormLabel = (props: FormLabelProps) => {
  const { label, isRequired = false, htmlFor, className = 'text-base font-medium' } = props;
  return (
    <Label htmlFor={htmlFor} className={className}>
      {label}
      {isRequired ? <span className="text-red-500 ml-1">*</span> : null}
    </Label>
  );
};
