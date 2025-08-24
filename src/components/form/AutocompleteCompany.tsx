import React from 'react';

import { useListCompaniesQuery } from '../../features/user/api/listCompanies';
import { useAppSelector } from '../../store';
import { AutocompleteElement, AutocompleteElementProps, useFormContext } from 'react-hook-form-mui';


export default function AutocompleteCompany(
  props: Partial<Omit<AutocompleteElementProps<{ id: string, label: string }, false, false, false>, 'options' | 'loading'>>
) {
  const { userId } = useAppSelector(state => state.userContext)
  const { data, isLoading } = useListCompaniesQuery({ userId });
  const { formState } = useFormContext();

  return (
    <AutocompleteElement
      {...props}
      name={props.name || 'company'}
      label={props.label || 'Company'}
      options={data ?? []}
      loading={isLoading}
      matchId
      required
      autocompleteProps={{
        disabled: formState.isSubmitting
      }}
    />
  );
}
