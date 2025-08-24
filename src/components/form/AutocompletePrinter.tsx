import React from 'react';

import { AutocompleteProps } from '@mui/material/Autocomplete';
import { AutocompleteElement } from 'react-hook-form-mui';
import { useListPrintersQuery } from '@/features/user/api/listPrinters';


export default function AutocompletePrinter(
  props: Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'>
) {
  const { data, isLoading } = useListPrintersQuery();

  return (
    <AutocompleteElement
      name="device"
      label="Printer"
      required
      loading={isLoading}
      options={data ?? []}
      matchId
      autocompleteProps={props}
    />
  );
}
