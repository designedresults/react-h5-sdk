import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { type FallbackProps } from 'react-error-boundary';


import { M3APIError, type M3APIErrorCause } from '@designedresults/m3api-h5-sdk';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const [open, setOpen] = useState(false);

  const isM3APIError = error instanceof M3APIError;
  const errorObj: any = error as any

  let cause: M3APIErrorCause | undefined = undefined;
  if (isM3APIError) {
    cause = errorObj.cause as M3APIErrorCause;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ padding: 4 }}>
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
              {errorObj.name}
            </Typography>
            <Typography variant="body1" color="error" gutterBottom>
              {errorObj.message}
            </Typography>
          </>
        )}
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }}>
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
            }}
          >
            Back
          </Button>
        </Stack>
        <Stack direction="column" spacing={2} sx={{ marginTop: 4 }}>
          {errorObj.cause && (
            <FormControl fullWidth>
              <TextField
                color="error"
                label="Error Cause"
                multiline
                maxRows={10}
                disabled
                defaultValue={JSON.stringify(errorObj.cause, null, 2)}
              />
            </FormControl>
          )}

          {open && (
            <>
              {errorObj.program && errorObj.transaction && (
                <Typography variant="subtitle1">
                  {errorObj.program}/{errorObj.transaction}
                </Typography>
              )}
              {errorObj.record && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(errorObj.record).map(key => (
                        <TableRow key={key}>
                          <TableCell>{key}</TableCell>
                          <TableCell>{errorObj.record[key]}</TableCell>
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
                  defaultValue={errorObj.stack}
                />
              </FormControl>
            </>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
