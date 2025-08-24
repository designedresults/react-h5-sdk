import React from 'react';

import { useListPrintersQuery } from '../../features/user/api/listPrinters';
import { AutocompleteElement, AutocompleteElementProps, useFormContext } from 'react-hook-form-mui';


export default function AutocompletePrinter(
  props: Partial<Omit<AutocompleteElementProps<{ id: string, label: string }, false, false, false>, 'options' | 'loading'>>
) {
  const { formState } = useFormContext();
  const { data, isLoading } = useListPrintersQuery();

  return (
    <AutocompleteElement
      {...props}
      name={props.name || 'device'}
      label={props.label || 'Printer'}
      options={data ?? []}
      loading={isLoading}
      required
      matchId
      autocompleteProps={{
        disabled: formState.isSubmitting
      }}
    />
  );
}
