import { Typography } from "@mui/material";
import Button from "@mui/material/Button";

import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TypedUseMutationResult } from "@reduxjs/toolkit/dist/query/react";
import dayjs from "dayjs";
import React, { useState } from "react";

type Props = {
  result: TypedUseMutationResult<any, any, any>;
  title?: string
  errorMessage?: string
  successMessage?: string
  dialogProps?: Partial<Omit<DialogProps, 'open'>>
  onClose?: () => void;
};

export default function ResultDialog({ result, title: label, errorMessage, successMessage, dialogProps, onClose }: Props) {

  const { requestId, endpointName, originalArgs, error, isError, isSuccess, startedTimeStamp, fulfilledTimeStamp, reset } = result
  const [open, setOpen] = useState(isError || isSuccess);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
    reset()
  };

  const color = isError ? "error" : "success"


  return (
    <Dialog {...dialogProps} onClose={handleClose} open={open} color={color} fullWidth>
      <DialogTitle>
        {label || endpointName}
      </DialogTitle>
      <DialogContent dividers>
        {isError &&
          <>
            {errorMessage && <Typography variant="body1">{errorMessage}</Typography>}
            <pre>{JSON.stringify(error, null, 2)}</pre>
            <Typography variant="body2">Endpoint: {endpointName}</Typography>
            <Typography variant="body2">Args: {JSON.stringify(originalArgs)}</Typography>
            <Typography variant="body2">Request id: {requestId}</Typography>
            <Typography variant="body2">Requested at: {dayjs(startedTimeStamp).format()}</Typography>
          </>
        }
        {isSuccess &&
          <>
            <Typography>{successMessage || endpointName + " completed succesfully."}</Typography>
            <Typography variant="body2">Endpoint: {endpointName}</Typography>
            <Typography variant="body2">Args: {JSON.stringify(originalArgs)}</Typography>
            <Typography variant="body2">Request id: {requestId}</Typography>
            <Typography variant="body2">Requested at: {dayjs(startedTimeStamp).format()} - {fulfilledTimeStamp - startedTimeStamp}</Typography>

          </>
        }
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          color={color}
          variant="contained"
          onClick={handleClose}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
