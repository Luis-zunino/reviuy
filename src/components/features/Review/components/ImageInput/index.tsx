'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { AlertCircle, ImagePlus, Upload } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type ImageInputPreview = {
  key: string;
  file: File;
  previewUrl: string;
};

export type ImageInputProps = {
  value?: File[];
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  className?: string;
};

const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(0)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};

const buildAcceptMap = (acceptedTypes: string[]) =>
  acceptedTypes.reduce<Record<string, []>>((acc, type) => {
    acc[type] = [];
    return acc;
  }, {});

const getRejectionMessage = (rejections: FileRejection[], maxSizeBytes: number) => {
  const firstError = rejections[0]?.errors[0];

  if (!firstError) {
    return 'No se pudieron cargar una o más imágenes.';
  }

  if (firstError.code === 'file-too-large') {
    return `Cada imagen puede pesar hasta ${formatFileSize(maxSizeBytes)}.`;
  }

  if (firstError.code === 'file-invalid-type') {
    return 'Solo se permiten imágenes JPG, PNG o WebP.';
  }

  return 'No se pudieron cargar una o más imágenes.';
};

export const ImageInput = ({
  value,
  defaultValue,
  onChange,
  maxFiles = 5,
  maxSizeMb = 5,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  disabled = false,
  label = 'Imágenes',
  description = 'Arrastrá imágenes o hacé click para seleccionarlas.',
  error,
  className,
}: ImageInputProps) => {
  const [internalFiles, setInternalFiles] = useState<File[]>(defaultValue ?? []);
  const [localError, setLocalError] = useState<string | null>(null);

  const isControlled = value !== undefined;
  const files = isControlled ? value : internalFiles;
  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  const setFiles = useCallback(
    (nextFiles: File[]) => {
      if (!isControlled) {
        setInternalFiles(nextFiles);
      }

      onChange?.(nextFiles);
    },
    [isControlled, onChange]
  );

  const previews = useMemo<ImageInputPreview[]>(
    () =>
      files.map((file, index) => ({
        key: `${file.name}-${file.lastModified}-${index}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.previewUrl));
    };
  }, [previews]);

  const handleDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (disabled) {
        return;
      }

      if (rejectedFiles.length > 0) {
        setLocalError(getRejectionMessage(rejectedFiles, maxSizeBytes));
      } else {
        setLocalError(null);
      }

      if (acceptedFiles.length === 0) {
        return;
      }

      const remainingSlots = maxFiles - files.length;

      if (remainingSlots <= 0) {
        setLocalError(`Podés subir hasta ${maxFiles} imágenes.`);
        return;
      }

      const nextAcceptedFiles = acceptedFiles.slice(0, remainingSlots);

      if (acceptedFiles.length > remainingSlots) {
        setLocalError(
          `Solo podés agregar ${remainingSlots} imagen${remainingSlots === 1 ? '' : 'es'} más.`
        );
      }

      setFiles([...files, ...nextAcceptedFiles]);
    },
    [disabled, files, maxFiles, maxSizeBytes, setFiles]
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      setLocalError(null);
      setFiles(files.filter((_, index) => index !== indexToRemove));
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleDrop,
    accept: buildAcceptMap(acceptedTypes),
    multiple: true,
    maxSize: maxSizeBytes,
    noClick: true,
    noKeyboard: true,
    disabled,
  });

  const currentError = error ?? localError;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <Badge variant="outline">
            {files.length}/{maxFiles}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          'rounded-2xl border border-dashed p-5 transition-colors',
          'bg-gradient-to-br from-background to-muted/30',
          isDragActive && 'border-primary bg-primary/5',
          currentError && 'border-destructive/60 bg-destructive/5',
          disabled && 'cursor-not-allowed opacity-60',
          !disabled && 'cursor-pointer hover:border-primary/50 hover:bg-primary/5'
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
          <div
            className={cn(
              'flex size-14 items-center justify-center rounded-2xl border',
              isDragActive
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground'
            )}
          >
            {isDragActive ? <Upload className="size-6" /> : <ImagePlus className="size-6" />}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isDragActive
                ? 'Soltá las imágenes acá'
                : 'Arrastrá imágenes o elegilas desde tu dispositivo'}
            </p>
            <p className="text-xs text-muted-foreground">
              Hasta {maxFiles} imágenes. Máximo {maxSizeMb} MB por archivo. JPG, PNG o WebP.
            </p>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={open} disabled={disabled}>
            Seleccionar imágenes
          </Button>
        </div>
      </div>

      {currentError ? (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{currentError}</span>
        </div>
      ) : null}

      {previews.length > 0 ? (
        <div className="grid grid-cols-5 gap-3">
          {previews.map((preview, index) => (
            <div
              key={preview.key}
              className="max-w-50 overflow-hidden rounded-2xl border bg-muted/30"
            >
              <img
                src={preview.previewUrl}
                alt={preview.file.name}
                className="aspect-square max-w-50"
              />

              <div className="space-y-2 p-2">
                <p className="truncate text-xs font-medium text-foreground">{preview.file.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatFileSize(preview.file.size)}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="h-8 w-full"
                  onClick={() => handleRemove(index)}
                >
                  Quitar imagen
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
