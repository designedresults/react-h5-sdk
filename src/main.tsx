import { Fallback, PageNotFound, SizedBox } from '@/components';
import CurrentCompanyDivision from '@/components/chips/CurrentCompanyDivision';
import CurrentFacilityWarehouse from '@/components/chips/CurrentFacilityWarehouse';
import CurrentPrinter from '@/components/chips/CurrentPrinter';
import CurrentUser from '@/components/chips/CurrentUser';

import { useDialog } from '@/components/dialogs/useDialog';
import { AppToolbar } from '@/components/layout/AppToolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { LicenseInfo } from '@mui/x-license';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import { setFlagConfig, useFlag, useFlags } from './features/flag/flagSlice';
import { store, useAppSelector } from './store';
import theme from './theme';
import { initUserContext } from './features/user/api/getUserContext';
import flagConfig from './features.json'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_PRO_KEY);

store.dispatch(initUserContext())
store.dispatch(setFlagConfig(flagConfig));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
        </LocalizationProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Page />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  const [conoDivi, faciWhse, prt] = useFlags(["showCompanyDivision", "showFacilityWarehouse", "showPrinter"])
  const canImpersonate = useFlag("canImpersonate")

  return (
    <>
      <ErrorBoundary FallbackComponent={Fallback}>
        <AppToolbar>
          <Typography variant="h4" component="p">
            App Title
          </Typography>
          <Box flexGrow={1} />
          <Stack direction="row" spacing={1}>
            <CurrentUser chipProps={{ size: 'small', variant: 'outlined' }} showRoles canImpersonate={canImpersonate} />
            {conoDivi &&
              <CurrentCompanyDivision chipProps={{ size: 'small', variant: 'outlined' }} canEdit />
            }
            {faciWhse &&
              <CurrentFacilityWarehouse chipProps={{ size: 'small', variant: 'outlined' }} canEdit />
            }
            {prt &&
              <CurrentPrinter chipProps={{ size: 'small', variant: 'outlined' }} canEdit />
            }
          </Stack>
        </AppToolbar>
        <Outlet />
      </ErrorBoundary>
    </>
  );
}

function Page() {
  const state = useAppSelector(state => state.userContext);
  const flag = useAppSelector(state => state.flagContext);
  const { Dialog, show } = useDialog({ title: 'Default title', severity: 'success' });

  return (
    <>
      <Dialog />
      <Container maxWidth="lg">
        <Grid container component={Paper} marginY={1}>
          <Grid size={6}>
            <Typography variant="subtitle2">Vite env vars</Typography>
            <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Globally delcared vars</Typography>
            <pre>{JSON.stringify({ __APP_NAME__, __APP_DESCRIPTION__, __APP_VERSION__, __BUILD_DATE__ }, null, 2)}</pre>
          </Grid>
        </Grid>
        <Box marginY={2}>
          <FormContainer
            onSuccess={async data => {
              if (Number(data.field1) > 100) {
                const ok = await show({ message: 'Value is large', severity: 'warning' });
                if (ok) {
                  await show({ message: 'Submitted with large value' });
                }
              } else {
                await show({ message: 'Submitted' });
              }
            }}
          >
            <TextFieldElement name="field1" label="Text field" autoFocus />
            <Button type="submit">Submit</Button>
          </FormContainer>
        </Box>
        <Box marginY={2}>
          <Button
            color="info"
            onClick={() => {
              show({ title: 'Info title' });
            }}
          >
            Show Info Dialog
          </Button>
          <Button
            color="error"
            onClick={() => {
              show({ message: 'An error occured', severity: 'error' });
            }}
          >
            Show Error Dialog
          </Button>
          <Button
            color="success"
            onClick={async () => {
              console.log(
                await show({ title: 'Confirm Dialog Title', message: 'Confirm dialog message', severity: 'success' })
              );
            }}
          >
            Show Success Dialog
          </Button>
          <Button
            color="warning"
            onClick={async () => {
              console.log(
                await show({
                  title: 'Confirm Dialog Title',
                  message: 'Confirm dialog message',
                  severity: 'warning',
                })
              );
            }}
          >
            Show Warning Dialog
          </Button>
          <Button
            color="error"
            onClick={async () => {
              console.log(
                await show({ title: 'Confirm Dialog Title', message: 'Confirm dialog message', severity: 'error' })
              );
            }}
          >
            Show Error Dialog
          </Button>
        </Box>

        <Paper>
          <SizedBox padding={2}>
            <Typography variant="subtitle2">Redux Store State</Typography>
            <pre
              style={{
                overflowY: 'scroll',
                height: '100%',
                fontSize: '.8em',
              }}
            >
              {JSON.stringify(state, null, 2)}
            </pre>
          </SizedBox>
        </Paper>
      </Container>
    </>
  );
}
