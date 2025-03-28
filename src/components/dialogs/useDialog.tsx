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
import React, { ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';

type Props = {
  title: string;
  message?: string;
  severity?: AlertColor;
  confirm?: boolean;
};

export function useDialog(defaultProps: Props) {
  const [promise, setPromise] = useState<any>(null);
  const [props, setProps] = useState<any>(null);

  function show(props?: Omit<Props, 'title'> & { title?: string }) {
    setProps({
      title: props?.title ?? defaultProps?.title,
      message: props?.message ?? defaultProps?.message,
      severity: props?.severity ?? defaultProps?.severity,
      confirm: props?.confirm ?? defaultProps?.confirm,
    });

    return new Promise<boolean>(resolve => {
      setPromise({ resolve });
    });
  }
  function handleClose() {
    setPromise(null);
    setProps(null);
  }
  function handleConfirm() {
    promise.resolve(true);
    handleClose();
  }
  function handleCancel() {
    promise.resolve(false);
    handleClose();
  }

  const CustomDialog = useMemo(() => {
    return (): ReactNode => {
      const title = props?.title ?? '';
      const message = props?.message ?? '';
      const severity = props?.severity ?? 'info';
      const confirm = props?.confirm === undefined && severity === 'warning' ? true : props?.confirm == true;
      const okButtonRef = useRef<HTMLButtonElement>(null);
      useLayoutEffect(() => {
        okButtonRef.current?.focus();
      }, [okButtonRef]);
      return (
        <Dialog open={promise !== null} fullWidth color={severity} onClose={handleCancel} disablePortal>
          <DialogTitle>
            <Stack direction="row" alignItems={'start'}>
              {severity && (
                <Box paddingRight={2}>
                  {severity === 'warning' && <WarningIcon color={severity} />}
                  {severity === 'error' && <ErrorIcon color={severity} />}
                  {severity === 'success' && <CheckCircleIcon color={severity} />}
                  {severity === 'info' && <InfoIcon color={severity} />}
                </Box>
              )}
              <Typography flexGrow={1}>{title}</Typography>
            </Stack>
          </DialogTitle>
          {message && (
            <DialogContent>
              <DialogContentText>{message}</DialogContentText>
            </DialogContent>
          )}
          <DialogActions>
            {confirm && (
              <Button onClick={handleCancel} color={severity} variant="outlined">
                Cancel
              </Button>
            )}
            <Button onClick={handleConfirm} color={severity} variant="contained" ref={okButtonRef}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      );
    };
  }, [props]);

  return { Dialog: CustomDialog, show };
}
