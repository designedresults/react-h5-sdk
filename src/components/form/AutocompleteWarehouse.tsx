import React, { useEffect } from 'react';

import { AutocompleteProps } from '@mui/material/Autocomplete';
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui';
import { useListWarehousesQuery } from '@/features/user/api/listWarehouses';
import { Warehouse } from '@/features/user/api/getWarehouse';


export default function AutocompleteWarehouse(
  props: Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'>
) {
  const { watch, setValue } = useFormContext();
  const facility = watch('facility');
  const { data, isLoading } = useListWarehousesQuery({facility});

  useEffect(() => {
    if (data && facility) {
      const mainWarehouse = data.find(w => w.isMain)?.id
      if (mainWarehouse) {
        setValue('warehouse', mainWarehouse)
      }

    }
  }, [facility, data])


  return (
    <AutocompleteElement
      name="warehouse"
      label="Warehouse"
      options={data as any[] ?? []}
      autocompleteProps={{
        disabled: !facility,
        ...props,
      }}
      loading={isLoading}
      required
    />
  );
}
