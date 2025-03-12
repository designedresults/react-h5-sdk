import Button, { ButtonProps } from '@mui/material/Button';
import React, { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

export default function CancelButton(props: PropsWithChildren & ButtonProps) {
  const ctx = useFormContext();
  const disabled = props.disabled || (ctx?.formState?.isSubmitting ?? false);
  const { ['children']: removed, ...filteredProps } = props;
  return (
    <Button {...filteredProps} disabled={disabled}>
      {props.children}
    </Button>
  );
}
