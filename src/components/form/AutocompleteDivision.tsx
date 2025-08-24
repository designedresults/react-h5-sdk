import React from 'react';

import { AutocompleteProps } from '@mui/material/Autocomplete';
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui';

import { useListDivisionsQuery } from '@/features/user/api/listDivisions';
import { useAppSelector } from '@/store';

export default function AutocompleteDivision(
  props: Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'>
) {
  const { userId } = useAppSelector(state => state.userContext);
  const ctx = useFormContext();

  const company = ctx.watch('company');
  const { data, isLoading } = useListDivisionsQuery({ userId, company }, {
    skip: !userId || !company,
  });

  return (
    <AutocompleteElement
      name="division"
      label="Division"
      autocompleteProps={{
        disabled: !company,
        ...props,
      }}
      options={data ?? []}
      loading={isLoading}
      matchId
      required
    />
  );
}
