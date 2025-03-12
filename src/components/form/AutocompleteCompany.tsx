import React from 'react';

import { AutocompleteProps } from '@mui/material/Autocomplete';
import { AutocompleteElement } from 'react-hook-form-mui';
import { userApi } from '../..';

export default function AutocompleteCompany(
  props: Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'>
) {
  const { data, isLoading } = userApi.useListCompaniesQuery();

  return (
    <AutocompleteElement
      name="company"
      label="Company"
      required
      loading={isLoading}
      options={data ?? []}
      matchId
      autocompleteProps={props}
    />
  );
}
