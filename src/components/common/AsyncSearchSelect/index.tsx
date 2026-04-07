'use client';

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

/**
 * AsyncSearchSelect - Componente de selección con búsqueda asíncrona
 * @template T - Tipo de los valores del formulario
 * @template V - Tipo de las opciones de búsqueda, debe tener al menos 'id' y 'name'
 * @param props - Props del componente, incluyendo configuración de formulario, opciones, estado de carga, etc.
 * @description Este componente combina un campo de entrada con un popover que muestra resultados de búsqueda asíncrona. Permite a los usuarios escribir para buscar opciones, muestra un indicador de carga mientras se obtienen los resultados y maneja la selección de una opción. También incluye validación y manejo de errores del formulario.
 * @example
 * <AsyncSearchSelect
 *   label="Ciudad"
 *   name="city"
 *   form={form}
 *   options={cityOptions}
 *   isFetching={isFetchingCities}
 *   handleClear={() => form.setValue('city', '')}
 *   onSelect={(option) => form.setValue('city', option.name)}
 * />
 * @returns El componente AsyncSearchSelect listo para ser utilizado en formularios con búsqueda asíncrona.
 * @see {@link AsyncSearchSelectProps} para más detalles sobre las props.
 * @see {@link FormField}, {@link Popover}, {@link Command} para la implementación interna.
 */
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
                            {emptyComponent ?? 'No se encontraron resultados'}
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
