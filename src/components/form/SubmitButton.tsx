import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React, { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  loading?: boolean
}

export default function SubmitButton(props: Props & PropsWithChildren & ButtonProps) {
  const ctx = useFormContext();
  const disabled =
    (props.disabled === undefined ? false : props.disabled) ||
    (ctx?.formState?.isValid  === undefined ? false : !ctx.formState.isValid) ||
    (ctx?.formState?.isSubmitting === undefined ? false : !ctx.formState.isSubmitting);
  const loading = (props.loading === undefined ? false : props.loading) ||
  ctx?.formState?.isSubmitting === undefined ? false : ctx.formState.isSubmitting;
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
