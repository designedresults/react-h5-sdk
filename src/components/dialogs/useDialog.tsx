import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/ErrorSharp';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { PropsWithChildren } from 'react';

import { useState } from 'react';

export function useDialog() {
  const [promise, setPromise] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [children, setChildren] = useState<React.ReactNode | undefined>(undefined);
  const [confirm, setConfirm] = useState(false);

  type Props = {
    title?: string;
    message?: string;
    severity?: AlertColor;
    confirm?: boolean;
  };
  const show = (props: Props & PropsWithChildren) =>
    new Promise<boolean>(resolve => {
      setPromise({ resolve });
      setTitle(props.title ?? 'Confirm');
      if (props.message) {
        setMessage(props.message);
      }
      if (props.severity) {
        setSeverity(props.severity);
      }
      if (props.children) {
        setChildren(props.children);
      }
      if (props.confirm === undefined && props.severity === 'warning') {
        setConfirm(true);
      } else {
        setConfirm(props.confirm == true);
      }
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === 'Enter' ||
      e.which === 13 // Wait until IME is settled.
    ) {
      handleConfirm();
    }
  };

  const CustomDialog = () => (
    <Dialog open={promise !== null} fullWidth color={severity} onClose={handleCancel} onKeyDown={handleKeyDown}>
      <DialogTitle>
        <Stack direction="row" alignItems={'start'}>
          <Box paddingRight={2}>
            {severity === 'warning' && <WarningIcon color={severity} />}
            {severity === 'error' && <ErrorIcon color={severity} />}
            {severity === 'success' && <CheckCircleIcon color={severity} />}
            {severity === 'info' && <InfoIcon color={severity} />}
          </Box>
          <Typography flexGrow={1}>{title}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        {confirm && (
          <Button onClick={handleCancel} color={severity} variant="outlined">
            Cancel
          </Button>
        )}
        <Button onClick={handleConfirm} color={severity} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
  return [CustomDialog, show];
}
