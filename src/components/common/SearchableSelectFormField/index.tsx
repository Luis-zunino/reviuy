'use client';
import { type FieldPath, type FieldValues, useController } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { FormFieldSelectProps } from './types';
import { SearchableSelect } from './components/SercheableSelect';

export const SearchableSelectFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  required,
  rules,
  options,
  onValueChange: customOnValueChange,
  ...props
}: FormFieldSelectProps<TFieldValues, TName>) => {
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  const selectedOption = options.find((opt) => opt.osm_id.toString() === value);

  const handleValueChange = (newValue?: string) => {
    onChange(newValue);
    if (customOnValueChange) {
      customOnValueChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <SearchableSelect
        ref={ref}
        id={name}
        name={name}
        value={selectedOption}
        onValueChange={handleValueChange}
        onBlur={onBlur}
        error={error?.message}
        onInputChange={props.onInputChange}
        options={options}
        {...props}
      />
    </div>
  );
};
