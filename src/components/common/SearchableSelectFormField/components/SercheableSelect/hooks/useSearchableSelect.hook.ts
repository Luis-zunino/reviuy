import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { SearchableSelectRef } from './types';
import type { NominatimEntity } from '@/types';

export const useSearchableSelect = ({
  options,
  value,
  onValueChange,
  disabled = false,
  onBlur,
  ref,
  onInputChange,
}: SearchableSelectRef) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const internalInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => internalInputRef.current!);

  const selectedOption = options.find((option) => option === value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);

    if (onInputChange) {
      onInputChange(inputValue);
    }

    // Si el input está vacío, limpiar el valor del formulario
    if (!inputValue || inputValue.trim() === '') {
      onValueChange?.(undefined);
    } else if (value && inputValue !== selectedOption?.display_name) {
      onValueChange?.(undefined);
    }

    if (!open && inputValue) {
      setOpen(true);
    }
  };

  const handleSelect = (value: NominatimEntity) => {
    onValueChange?.(value.osm_id.toString());
    setSearchValue(value.display_name);
    setIsFocused(false);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.(undefined);
    setSearchValue('');
    setIsFocused(true);
    internalInputRef.current?.focus();
  };

  const handleInputClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setIsFocused(true);
    setOpen(true);
    internalInputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (disabled) return;
    setIsFocused(true);
    setOpen(true);
  };

  const handleInputBlur = () => {
    onBlur?.();
  };

  useEffect(() => {
    if (selectedOption && !searchValue && !isFocused) {
      setSearchValue(selectedOption.display_name);
    }
  }, [selectedOption, searchValue, isFocused]);

  return {
    open: open && !disabled && isFocused,
    setOpen,
    searchValue,
    handleInputChange,
    handleSelect,
    handleClear,
    handleInputClick,
    handleInputFocus,
    internalInputRef,
    handleInputBlur,
  };
};
