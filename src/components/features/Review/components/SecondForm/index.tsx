import { FormLabel } from '@/components/common/Form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SecondFormProps } from './types';

export const SecondForm = (props: SecondFormProps) => {
  const { control, fields, append, remove } = props;

  const addRoom = () => {
    append({
      room_type: 'bedroom',
      area_m2: 0,
    });
  };

  const removeRoom = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <FormLabel label="¿Qué tan agradable es la propiedad en invierno?" />

        <Controller
          name="winter_comfort"
          control={control}
          render={({ field }) => (
            <RadioGroup
              required
              value={field.value || ''}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hot" id="winter-hot" />
                <FormLabel htmlFor="winter-hot" label="Caluroso" />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="winter-comfortable" />
                <FormLabel htmlFor="winter-comfortable" label="Cómodo" />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cold" id="winter-cold" />
                <FormLabel htmlFor="winter-cold" label="Frío" />
              </div>
            </RadioGroup>
          )}
        />
      </div>
      <div className="space-y-3">
        <FormLabel label="¿Qué tan agradable es la propiedad en verano?" />
        <Controller
          name="summer_comfort"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value || ''}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-6"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hot" id="summer-hot" />
                <FormLabel htmlFor="summer-hot" label="Caluroso" />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="summer-comfortable" />
                <FormLabel htmlFor="summer-comfortable" label="Cómodo" />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cold" id="summer-cold" />
                <FormLabel htmlFor="summer-cold" label="Frío" />
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <div className="space-y-3">
        <FormLabel label="Nivel de humedad" />
        <Controller
          name="humidity"
          control={control}
          render={({ field }) => (
            <RadioGroup
              required
              value={field.value || ''}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="humidity-high" />
                <FormLabel htmlFor="humidity-high" label="Alta" />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="humidity-normal" />
                <FormLabel htmlFor="humidity-normal" label="Normal" />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="humidity-low" />
                <FormLabel htmlFor="humidity-low" label="Baja" />
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel label="Habitaciones" />
          <Button type="button" onClick={addRoom} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Habitación
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No hay habitaciones agregadas
          </div>
        ) : (
          <div className="grid gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel label="Tipo de habitación" />
                    <Controller
                      name={`review_rooms.${index}.room_type`}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                            defaultValue={field.value ?? undefined}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo de propiedad" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bedroom">Dormitorio</SelectItem>
                              <SelectItem value="living_room">Sala de estar</SelectItem>
                              <SelectItem value="kitchen">Cocina</SelectItem>
                              <SelectItem value="bathroom">Baño</SelectItem>
                              <SelectItem value="dining_room">Comedor</SelectItem>
                              <SelectItem value="study">Estudio</SelectItem>
                              <SelectItem value="storage">Almacenamiento</SelectItem>
                            </SelectContent>
                          </Select>
                        );
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormLabel label="Área (m²)" />
                    <Controller
                      name={`review_rooms.${index}.area_m2`}
                      control={control}
                      rules={{
                        required: 'El área es requerida',
                        min: { value: 1, message: 'El área debe ser al menos 1 m²' },
                      }}
                      render={({ field, fieldState }) => (
                        <div>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            placeholder="Ej: 15"
                            min="1"
                            step="0.1"
                          />
                          {fieldState.error && (
                            <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => removeRoom(index)}
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
