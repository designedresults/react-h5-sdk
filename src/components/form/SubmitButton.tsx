import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React, { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

export default function SubmitButton(props: PropsWithChildren & ButtonProps) {
  const ctx = useFormContext();
  const disabled = props.disabled || !(ctx?.formState?.isValid ?? false) || (ctx?.formState?.isSubmitting ?? false);
  const loading = ctx?.formState?.isSubmitting ?? false;
  const { ['children']: removed, ...filteredProps } = props;
  return (
    <Button
      {...filteredProps}
      type="submit"
      startIcon={loading && props.startIcon ? <CircularProgress size={16} /> : props.startIcon}
      endIcon={loading && props.endIcon && !props.startIcon ? <CircularProgress size={16} /> : props.endIcon}
      disabled={disabled}
    >
      {props.children}
    </Button>
  );
}
