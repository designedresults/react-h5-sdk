import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useState } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { useLocation, useNavigate } from 'react-router-dom';
import { MIError } from '../../mi/MIService';
import Container from '@mui/material/Container';

export function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();
  const location = useLocation();
  let back = location.pathname.split('/').slice(0, -1).join('/');
  if (!back) {
    back = '/';
  }
  console.error(error);
  const [open, setOpen] = useState(false);

  const isMIError = error instanceof MIError;

  return (
    <Container maxWidth="md">
      {isMIError && (
        <>
          <Typography variant="h1" color="error">M3 API Error</Typography>
          <Typography variant="body2">
            API: {error.program}/{error.transaction}
          </Typography>
          <Typography variant="body2">Field: {error.errorField}</Typography>
          <Typography variant="body2">Error code: {error.errorCode}</Typography>
          {error.errorCode !== error.errorType && (
            <Typography variant="body2">Error type: {error.errorType}</Typography>
          )}
        </>
      )}
      {!isMIError && (
        <>
          <Typography variant="h1" color="error">
            {error.name}
          </Typography>
          <Typography variant="body1" color="error" gutterBottom>
            {error.message}
          </Typography>
        </>
      )}
      <Stack direction="column" spacing={2} marginTop={4} alignItems={'end'}>
        {error.cause && (
          <FormControl fullWidth>
            <TextField
              color="error"
              label="Error Cause"
              multiline
              maxRows={10}
              disabled
              defaultValue={JSON.stringify(error.cause, null, 2)}
            />
          </FormControl>
        )}

        {open && (
          <FormControl fullWidth>
            <TextField
              fullWidth
              color="error"
              label="Error Trace"
              multiline
              maxRows={10}
              disabled
              defaultValue={error.stack}
            />
          </FormControl>
        )}
        <Stack direction="row" spacing={2}>
          <Button
            color="error"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? 'Hide details' : 'More details...'}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              resetErrorBoundary();
              navigate(back);
            }}
          >
            Back
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
