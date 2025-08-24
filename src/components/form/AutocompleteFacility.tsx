import React from 'react';

import { useListFacilitiesQuery } from '../../features/user/api/listFacilities';
import { AutocompleteElement, AutocompleteElementProps, useFormContext } from 'react-hook-form-mui';

export default function AutocompleteFacility(
  props: Partial<Omit<AutocompleteElementProps<{ id: string, label: string }, false, false, false>, 'options' | 'loading'>>
) {
  const { formState } = useFormContext();
  const { data, isLoading } = useListFacilitiesQuery();

  return (
    <AutocompleteElement
      {...props}
      name={props.name || 'facility'}
      label={props.label || 'Facility'}
      loading={isLoading}
      options={data ?? []}
      required
      matchId
      autocompleteProps={{ disabled: formState.isSubmitting }}
    />
  );
}
