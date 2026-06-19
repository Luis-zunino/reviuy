'use client';

import { FieldValues } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils/cn';
import { AsyncSearchSelectProps } from './types';
import { AsyncSearchSelectContent } from './components/AsyncSearchSelectContent';

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
  const { className, form, name, placeholder = 'Escribe ciudad (ej: Mon...)', ...rest } = props;

  return (
    <div className={cn('w-87.5 space-y-4', className?.container)}>
      <FormField
        control={form.control}
        name={name}
        render={({ field, fieldState: { isDirty } }) => (
          <AsyncSearchSelectContent
            field={field}
            isDirty={isDirty}
            placeholder={placeholder}
            className={className}
            errorMessage={form.formState.errors[name]?.message?.toString()}
            {...rest}
          />
        )}
      />
    </div>
  );
};
