import React from 'react';

import { IUserContextState } from '@/features/user';
import { useListCompaniesQuery } from '@/features/user/api/listCompanies';
import { AutocompleteProps } from '@mui/material/Autocomplete';
import { AutocompleteElement } from 'react-hook-form-mui';
import { useAppSelector } from '@/store';


export default function AutocompleteCompany(
  props: Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'>
) {
  const { userId } = useAppSelector(state => state.userContext)
  const { data, isLoading } = useListCompaniesQuery({ userId });

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
