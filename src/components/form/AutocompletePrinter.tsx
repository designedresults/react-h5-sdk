import React from 'react';

import { AutocompleteProps } from '@mui/material/Autocomplete';
import { AutocompleteElement } from 'react-hook-form-mui';
import { userApi } from '../..';

export default function AutocompletePrinter(
  props: Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'>
) {
  const { data, isLoading } = userApi.useListPrintersQuery();

  return (
    <AutocompleteElement
      name="printer"
      label="Printer"
      required
      loading={isLoading}
      options={data ?? []}
      matchId
      autocompleteProps={props}
    />
  );
}
