import React from 'react';

import { AutocompleteProps } from '@mui/material/Autocomplete';
import { AutocompleteElement } from 'react-hook-form-mui';
import { userApi } from '../..';

export default function AutocompleteFacility(
  props: Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'>
) {
  const { data, isLoading } = userApi.useListFacilitiesQuery();

  return (
    <AutocompleteElement
      name="facility"
      label="Facility"
      required
      loading={isLoading}
      options={data ?? []}
      matchId
      autocompleteProps={props}
    />
  );
}
