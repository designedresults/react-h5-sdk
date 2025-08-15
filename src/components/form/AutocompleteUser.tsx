import React from 'react';

import { AutocompleteProps } from '@mui/material/Autocomplete';
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui';
import { userApi } from '../..';

export default function AutocompleteUser(
  props: Omit<AutocompleteProps<string, false, false, false>, 'options' | 'renderInput'>
) {
  const { data, isLoading } = userApi.useListUsersQuery()

    const { formState } = useFormContext();

  return (
    <AutocompleteElement
      name="user"
      label="User"
      required
      loading={isLoading}
      options={data as any[] ?? []}
      autocompleteProps={{
        disabled: formState.isSubmitting,
        autoHighlight: true,
        ...props
      }}
    />
  );
}
