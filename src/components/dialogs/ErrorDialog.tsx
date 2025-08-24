import CopyIcon from "@mui/icons-material/CopyAll";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";

export type ErrorDialogProps = {
  error: any;
  onClose?: () => void;
};

export default function ErrorDialog({ error, onClose }: ErrorDialogProps) {
  let name = "Error";
  let message = "";
  let cause = "";
  let stack = "";
  if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object") {
    if (error.name) {
      name = error.name;
    }
    if (error.message) {
      message = error.message;
    }
    if (!message && error.errorMessage) {
      message = error.errorMessage;
    }
    if (error.stack) {
      stack = error.stack;
    }
    if (error.cause) {
      cause = JSON.stringify(error.cause, null, 2);
    }
  }

  const [open, setOpen] = useState(true);
  const [showStack, setShowStack] = useState(false);
  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };
  return (
    <Dialog onClose={handleClose} open={open} color={"error"} fullWidth>
      <DialogTitle>
        {name} - {message}
      </DialogTitle>
      <DialogContent dividers>
        {cause && <pre style={{ fontSize: ".8em" }}>{cause}</pre>}
        <Button
          color="error"
          size="small"
          onClick={() => {
            setOpen(!showStack);
          }}
        >
          {showStack ? "Hide details" : "More details..."}
        </Button>
        {showStack && stack && <pre style={{ fontSize: ".6em" }}>{stack}</pre>}
      </DialogContent>
      <DialogActions>
        {cause && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<CopyIcon />}
            onClick={(e) => {
              window.navigator.clipboard.writeText(cause);
            }}
          >
            Copy
          </Button>
        )}
        <Button
          autoFocus
          color={"error"}
          variant="contained"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
