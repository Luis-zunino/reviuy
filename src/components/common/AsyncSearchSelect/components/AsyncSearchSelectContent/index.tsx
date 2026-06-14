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
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { AsyncSearchSelectContentProps } from './interfaces';

export const AsyncSearchSelectContent = <
  T extends FieldValues,
  V extends { id?: string | null; name?: string | null },
>(
  props: AsyncSearchSelectContentProps<T, V>
) => {
  const {
    field,
    isDirty,
    label,
    description,
    options,
    isFetching,
    handleClear,
    open,
    setOpen,
    onSelect,
    placeholder,
    emptyComponent,
    className,
    errorMessage,
  } = props;

  const hasOptions = options && options.length > 0;
  const showEmpty = isDirty && !isFetching && field.value && field.value.length >= 3;

  const emptyContent = showEmpty ? (
    <CommandEmpty>{emptyComponent ?? 'No se encontraron resultados'}</CommandEmpty>
  ) : null;

  const optionsContent = hasOptions ? (
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
  ) : (
    emptyContent
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
                onFocus={() => setOpen(Boolean(options && options.length > 0))}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(e);
                  const shouldOpen = value.length >= 3 && isDirty;
                  setOpen(shouldOpen);
                }}
                value={field.value}
                aria-invalid={Boolean(errorMessage)}
                className={className?.input}
              />
              {isFetching && (
                <div className="absolute right-3 top-2.5">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {field.value && !isFetching && (
                <Button
                  type="button"
                  variant="link"
                  size="icon"
                  className="absolute right-3 top-2.5 size-4 p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={handleClear}
                  icon={X}
                />
              )}
            </div>
          </FormControl>
        </PopoverAnchor>
        {isDirty ? (
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
                {optionsContent}
                {isFetching && (
                  <div className="min-h-6 flex items-center justify-center p-2">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        ) : null}
      </Popover>
      {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}
    </FormItem>
  );
};
