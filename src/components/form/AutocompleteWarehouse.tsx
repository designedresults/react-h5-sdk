import React, { useEffect } from 'react';

import { useListWarehousesQuery } from '../../features/user/api/listWarehouses';
import { AutocompleteElement, AutocompleteElementProps, useFormContext } from 'react-hook-form-mui';


export default function AutocompleteWarehouse(
  props: Partial<Omit<AutocompleteElementProps<{ id: string, label: string }, false, false, false>, 'options' | 'loading'>>
) {
  const { formState, watch, setValue } = useFormContext();
  const facility = watch('facility');
  const { data, isLoading } = useListWarehousesQuery({ facility });

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
      {...props}
      name={props.name || 'warehouse'}
      label={props.label || 'Warehouse'}
      options={data as any[] ?? []}
      loading={isLoading}
      required
      matchId
      autocompleteProps={{
        disabled: !facility || formState.isSubmitting,
      }}
    />
  );
}
