import React from 'react';


import { AutocompleteElement, AutocompleteElementProps, useFormContext } from 'react-hook-form-mui';
import { useListUsersQuery } from '../../features/user/api/listUsers';

export default function AutocompleteUser(
  props: Partial<Omit<AutocompleteElementProps<{id: string, label: string}, false, false, false>, 'options' | 'loading'>>
) {
  const { data, isLoading, isFetching, error } = useListUsersQuery()
  const { formState } = useFormContext();

  if (error) {
    return null
  }

  return (
    <AutocompleteElement
      {...props}
      name={props.name || 'userId'}
      label={props.label || 'User'}
      loading={isLoading || isFetching}
      options={data ?? []}
      matchId
      required
      autocompleteProps={{
        disabled: formState.isSubmitting,
      }}
    />
  );
}
