import { PageWithSidebar } from '@/components/common';
import { MultiForm } from '@/components/common/Form';
import { FirstForm } from '../FirstForm';
import { SecondForm } from '../SecondForm';
import { ThirdForm } from '../ThirdForm';
import type { ReviewFormProps } from './types';

/**
 * Formulario multi-paso para crear o editar reseñas de propiedades.
 *
 * Implementa un wizard de 3 pasos:
 * 1. Información de la dirección y propiedad
 * 2. Detalles de habitaciones y características
 * 3. Revisión y confirmación
 *
 * @component
 * @example
 * ```tsx
 * <ReviewForm
 *   form={form}
 *   handleSubmit={handleSubmit}
 *   onSubmit={onSubmit}
 *   fields={fields}
 *   append={append}
 *   remove={remove}
 *   replace={replace}
 *   onSelectAddress={handleAddressSelect}
 *   isSubmitDisabled={!isValid}
 * />
 * ```
 *
 * @param {ReviewFormProps} props - Propiedades del formulario
 * @param {UseFormReturn} props.form - Instancia de react-hook-form
 * @param {Function} props.handleSubmit - Handler de envío del formulario
 * @param {Function} props.onSubmit - Función llamada al enviar el formulario
 * @param {Array} props.fields - Array de campos de habitaciones (field array)
 * @param {Function} props.append - Función para agregar habitación
 * @param {Function} props.remove - Función para eliminar habitación
 * @param {Function} props.replace - Función para reemplazar habitaciones
 * @param {Function} props.onSelectAddress - Handler de selección de dirección
 * @param {Function} props.onSelectRealEstate - Handler de selección de inmobiliaria
 * @param {boolean} [props.isSubmitDisabled=false] - Deshabilita el botón de envío
 * @param {boolean} [props.isLoading=false] - Estado de carga
 *
 * @returns {JSX.Element} Formulario de reseña renderizado
 *
 * @remarks
 * - Utiliza validación con Zod
 * - Implementa autocomplete de direcciones con Nominatim
 * - Soporta múltiples habitaciones con campo dinámico
 */
export const ReviewForm = (props: ReviewFormProps) => {
  const {
    isLoading,
    fields,
    replace,
    form,
    handleSubmit,
    onSubmit,
    append,
    remove,
    isSubmitDisabled,
    onSelectAddress,
    open,
    setOpen,
    queryValue,
    handleClearAddress,
    openRealEstateModal,
    setOpenRealEstateModal,
    handleClearRealEstate,
    onSelectRealEstate,
    queryValueRealEstate,
  } = props;
  return (
    <PageWithSidebar
      authIsRequired={true}
      isLoading={isLoading}
      title="Comparte tu experiencia"
      description="Busca una dirección y comparte tu experiencia para ayudar a otros."
    >
      <MultiForm
        onSubmit={handleSubmit(onSubmit)}
        formsChildren={[
          <FirstForm
            key="firstForm"
            form={form}
            open={open}
            setOpen={setOpen}
            queryValue={queryValue}
            handleClear={handleClearAddress}
            onSelectAddress={onSelectAddress}
          />,
          <SecondForm
            key="secondForm"
            control={form.control}
            fields={fields}
            replace={replace}
            append={append}
            remove={remove}
          />,
          <ThirdForm
            key="thirdForm"
            form={form}
            open={openRealEstateModal}
            setOpen={setOpenRealEstateModal}
            handleClear={handleClearRealEstate}
            onSelect={onSelectRealEstate}
            queryValue={queryValueRealEstate}
          />,
        ]}
        form={form}
        isSubmitDisabled={isSubmitDisabled}
        stepLabels={['General', 'Características', 'Inmobiliaria']}
      />
    </PageWithSidebar>
  );
};
