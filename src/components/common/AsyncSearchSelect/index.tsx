'use client';

import * as React from 'react';
import { FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AsyncSearchSelectProps } from './types';

export const AsyncSearchSelect = <
  T extends FieldValues,
  V extends { id?: string | null; name?: string | null },
>(
  props: AsyncSearchSelectProps<T, V>
) => {
  const {
    label,
    name,
    form,
    options,
    isFetching,
    handleClear,
    open,
    setOpen,
    onSelect,
    placeholder = 'Escribe ciudad (ej: Mon...)',
    description,
    emptyComponent,
    className,
  } = props;

  return (
    <div className={cn('w-87.5 space-y-4', className?.container)}>
      <FormField
        control={form.control}
        name={name}
        render={({ field, formState }) => {
          // Determina si el usuario ha escrito algo en el campo
          const hasUserTyped = Boolean(
            formState?.dirtyFields[name as keyof typeof formState.dirtyFields]
          );
          return (
            <FormItem>
              {label ? <FormLabel>{label}</FormLabel> : null}
              {description ? <div className="mb-2 text-sm text-gray-500">{description}</div> : null}
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverAnchor asChild>
                  <FormControl>
                    <div className={cn('relative', className?.inputContainer)}>
                      <Input
                        {...field}
                        placeholder={placeholder}
                        autoComplete="off"
                        onFocus={() =>
                          options && options.length > 0 ? setOpen(true) : setOpen(false)
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(e);
                          const shouldOpen = value.length >= 3 && hasUserTyped;
                          setOpen(shouldOpen);
                        }}
                        value={field.value}
                        aria-invalid={Boolean(form.formState.errors[name])}
                        className={className?.input}
                      />
                      {isFetching && (
                        <div className="absolute right-3 top-2.5">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      {field.value && !isFetching && (
                        <Button
                          type="button"
                          variant="link"
                          size="icon"
                          className="absolute right-3 top-2.5 h-4 w-4 p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                          onClick={handleClear}
                          icon={X}
                        />
                      )}
                    </div>
                  </FormControl>
                </PopoverAnchor>
                {hasUserTyped ? (
                  <PopoverContent
                    className={cn('p-0 w-(--radix-popover-anchor-width)', className?.item)}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                      if (e.target instanceof Element && e.target.closest('input')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Command shouldFilter={false}>
                      <CommandList>
                        {options && options.length > 0 ? (
                          <CommandGroup heading="Resultados">
                            {options.map((item) => (
                              <CommandItem
                                key={item.id}
                                onSelect={() => {
                                  onSelect(item);
                                }}
                              >
                                {item.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ) : hasUserTyped &&
                          !isFetching &&
                          field.value &&
                          field.value.length >= 3 ? (
                          <CommandEmpty>
                            {emptyComponent || 'No se encontraron resultados'}
                          </CommandEmpty>
                        ) : null}
                        {isFetching ? (
                          <div className="min-h-6 flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                        ) : null}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                ) : null}
              </Popover>
            </FormItem>
          );
        }}
      />
      {form.formState.errors[name] && (
        <div className="text-sm text-red-500">
          {form.formState.errors[name]?.message?.toString()}
        </div>
      )}
    </div>
  );
};
