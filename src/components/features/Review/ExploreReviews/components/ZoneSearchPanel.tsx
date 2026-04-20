'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LocateFixed, Search, X } from 'lucide-react';

interface ZoneSearchPanelProps {
  zoneInput: string;
  geoStatus: 'idle' | 'loading' | 'success' | 'error';
  geoError: string | null;
  locationLabel: string | null;
  onZoneInputChange: (value: string) => void;
  onDetectLocation: () => void;
  onClearSearch: () => void;
}

export const ZoneSearchPanel = ({
  zoneInput,
  geoStatus,
  geoError,
  locationLabel,
  onZoneInputChange,
  onDetectLocation,
  onClearSearch,
}: ZoneSearchPanelProps) => {
  const hasActiveSearch = zoneInput.length > 0 || geoStatus === 'success';

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-1">Mi ubicación</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Detecta tu posición automáticamente para ver reseñas cercanas.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={onDetectLocation}
          disabled={geoStatus === 'loading'}
          aria-label="Detectar mi ubicación actual"
        >
          <LocateFixed className="h-4 w-4 shrink-0" aria-hidden="true" />
          {geoStatus === 'loading' ? 'Detectando...' : 'Usar mi ubicación'}
        </Button>

        {geoStatus === 'success' && locationLabel && (
          <p className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
            📍 {locationLabel}
          </p>
        )}

        {geoError && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {geoError}
          </p>
        )}
      </div>

      <Separator />

      <div>
        <Label htmlFor="zone-search" className="text-sm font-semibold">
          Buscar por zona
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-3">Ingresa un barrio o ciudad.</p>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="zone-search"
            type="search"
            placeholder="Ej: Pocitos, Montevideo..."
            value={zoneInput}
            onChange={(e) => onZoneInputChange(e.target.value)}
            className="pl-9 pr-9 text-sm"
            aria-label="Buscar por zona o barrio"
          />
        </div>
        {zoneInput.length > 0 && zoneInput.trim().length < 3 && (
          <p className="mt-1 text-xs text-muted-foreground">Ingresa al menos 3 caracteres.</p>
        )}
      </div>

      {hasActiveSearch && (
        <>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-muted-foreground"
            onClick={onClearSearch}
          >
            <X className="h-4 w-4" />
            Limpiar búsqueda
          </Button>
        </>
      )}
    </div>
  );
};
