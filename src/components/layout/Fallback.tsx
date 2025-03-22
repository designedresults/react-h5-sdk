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

import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';
import { M3APIError, M3APIErrorCause } from '@designedresults/m3api-h5-sdk';

export function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();
  const location = useLocation();
  let back = location.pathname.split('/').slice(0, -1).join('/');
  if (!back) {
    back = '/';
  }

  const [open, setOpen] = useState(false);

  const isM3APIError = error instanceof M3APIError;

  let cause: M3APIErrorCause | undefined = undefined;
  if (isM3APIError) {
    cause = error.cause as M3APIErrorCause;
  }

  return (
    <Container maxWidth="md">
      <Box padding={4}>
        {isM3APIError && (
          <>
            <Typography variant="h1" color="error">
              M3 API Error
            </Typography>
            {cause?.errorMessages?.map(msg => (
              <Typography variant="body1" color="error">
                {msg}
              </Typography>
            ))}
          </>
        )}
        {!isM3APIError && (
          <>
            <Typography variant="h1" color="error">
              {error.name}
            </Typography>
            <Typography variant="body1" color="error" gutterBottom>
              {error.message}
            </Typography>
          </>
        )}
        <Stack direction="row" spacing={2} justifyContent={'end'}>
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
        <Stack direction="column" spacing={2} marginTop={4}>
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
            <>
              {error.program && error.transaction && (
                <Typography variant="subtitle1">
                  {error.program}/{error.transaction}
                </Typography>
              )}
              {error.record && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(error.record).map(key => (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{error.record[key]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
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
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
