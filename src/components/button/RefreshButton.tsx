import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButtonProps } from '@mui/material/IconButton';
import React from 'react';

export function RefreshButton(props: IconButtonProps) {
  return (
    <IconButton {...props}>
      <RefreshIcon />
    </IconButton>
  );
}
