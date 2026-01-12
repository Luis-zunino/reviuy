'use client';

import * as React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useSearchableSelect } from './hooks';
import { SearchableSelectProps } from '../../types';
import { FC } from 'react';

export const SearchableSelect: FC<SearchableSelectProps> = (props) => {
  const {
    options,
    value,
    onValueChange,
    placeholder = 'Buscar una dirección...',
    emptyMessage = 'No se encontraron resultados.',
    className,
    disabled = false,
    name,
    error,
    onBlur,
    id,
    onInputChange,
    ref,
    isLoading = false,
    loadingMessage = 'Buscando...',
  } = props;

  const {
    open,
    setOpen,
    searchValue,
    handleInputChange,
    handleSelect,
    handleClear,
    handleInputClick,
    handleInputFocus,
    internalInputRef,
    handleInputBlur,
  } = useSearchableSelect({
    options,
    value,
    onValueChange,
    disabled,
    onBlur,
    ref,
    onInputChange,
  });

  // Determinar si mostrar el popover
  const shouldShowPopover = searchValue && (options.length > 0 || isLoading);

  return (
    <div className="space-y-1 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              'relative outline-none focus:outline-none focus-visible:outline-none',
              'data-[state=open]:outline-none',
              className?.inputContainer
            )}
          >
            <Input
              ref={internalInputRef}
              id={id}
              name={name}
              value={searchValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'pr-16',
                error && 'border-destructive focus-visible:ring-destructive',
                className?.input
              )}
              onClick={handleInputClick}
              onFocus={handleInputFocus}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
              autoComplete="off"
            />

            {/* Loading indicator o clear button */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isLoading && searchValue ? (
                <div className="flex items-center px-2" aria-label="Cargando resultados">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : searchValue && searchValue.length > 0 && !disabled ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={handleClear}
                  tabIndex={-1}
                  aria-label="Limpiar selección"
                >
                  <X className="h-3 w-3" />
                </Button>
              ) : null}
            </div>
          </div>
        </PopoverTrigger>

        {shouldShowPopover && (
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
            <Command className="w-full flex-1">
              <CommandList>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6 px-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                    <span className="text-sm text-muted-foreground">{loadingMessage}</span>
                  </div>
                ) : options.length > 0 ? (
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.osm_id}
                        value={option.display_name}
                        onSelect={() => handleSelect(option)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === option ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span className="flex-1 truncate">{option.display_name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>
                    <div className="py-6 px-4 text-center text-sm text-muted-foreground">
                      {emptyMessage}
                    </div>
                  </CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>

      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

SearchableSelect.displayName = 'SearchableSelect';
