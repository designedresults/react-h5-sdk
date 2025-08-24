import React from 'react';

import { AutocompleteElement, AutocompleteElementProps, useFormContext } from 'react-hook-form-mui';

import { useListDivisionsQuery } from '@/features/user/api/listDivisions';
import { useAppSelector } from '@/store';

export default function AutocompleteDivision(
  props: Partial<Omit<AutocompleteElementProps<{ id: string, label: string }, false, false, false>, 'options' | 'loading'>>
) {
  const { userId } = useAppSelector(state => state.userContext);
  const { formState, watch } = useFormContext();

  const company = watch('company');
  const { data, isLoading } = useListDivisionsQuery({ userId, company }, {
    skip: !userId || !company,
  });

  return (
    <AutocompleteElement
      {...props}
      name={props.name || 'division'}
      label={props.label || 'Division'}
      options={data ?? []}
      loading={isLoading}
      matchId
      required
      autocompleteProps={{
        disabled: !company || formState.isSubmitting,
      }}
    />
  );
}
