import { OsmType, PagesUrls } from '@/enums';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { formSchema, FormSearcherAddressHome } from '../constants';
import { getAddressOsmId } from '@/utils';
import { NominatimEntity } from '@/modules/addresses';

export const useSearcherAddressHome = () => {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();

  const form = useForm<FormSearcherAddressHome>({
    resolver: zodResolver(formSchema),
  });

  const { watch, setValue } = form;
  const { address_text, osm_id, osm_type } = watch();

  const onSelect = (item: NominatimEntity) => {
    form.setValue('address_text', item.display_name, {
      shouldValidate: true,
    });
    form.setValue('osm_id', String(item.osm_id), {
      shouldValidate: true,
    });
    form.setValue('osm_type', String(item.osm_type), {
      shouldValidate: true,
    });
    form.setValue('latitude', item.lat, {
      shouldValidate: true,
    });
    form.setValue('longitude', item.lon, {
      shouldValidate: true,
    });
    setOpen(false);
  };

  const handleSelect = (address: { osm_id: string; osm_type: OsmType }) => {
    const { osm_id, osm_type } = address;
    const osmId = getAddressOsmId({ osm_type, osm_id });

    if (!osmId) return;
    push(PagesUrls.ADDRESS_DETAILS.replace(':osmId', osmId));
  };

  const handleClear = () => {
    setValue('address_text', '');
    setOpen(false);
  };

  useEffect(() => {
    if (osm_id?.length && osm_type?.length) {
      handleSelect({
        osm_type: osm_type as OsmType,
        osm_id,
      });
    }

    return () => form.reset();
  }, [osm_id, osm_type]);

  return {
    open,
    setOpen,
    queryValue: address_text,
    handleClear,
    form,
    onSelect,
  };
};
