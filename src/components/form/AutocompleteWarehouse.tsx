import React from 'react';

import { AutocompleteProps } from '@mui/material/Autocomplete';
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui';
import { useAppSelector, userApi } from '../..';

export default function AutocompleteWarehouse(
  props: Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'>
) {
  const { userId } = useAppSelector(state => state.userContext);
  const ctx = useFormContext();

  const facility = ctx.watch('facility');
  const { data, isLoading } = userApi.useListWarehouseByFacilityQuery(facility, {
    skip: !userId,
  });

  return (
    <AutocompleteElement
      name="warehouse"
      label="Warehouse"
      autocompleteProps={{
        disabled: !facility,
        ...props,
      }}
      options={data ?? []}
      loading={isLoading}
      matchId
      required
    />
  );
}
