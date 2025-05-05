import { M3API } from '@designedresults/m3api-h5-sdk';
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
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Fallback, PageNotFound, useSelectedRows } from './components';
import CurrentCompanyDivision from './components/chips/CurrentCompanyDivision';
import CurrentFacilityWarehouse from './components/chips/CurrentFacilityWarehouse';
import CurrentPrinter from './components/chips/CurrentPrinter';
import CurrentUser from './components/chips/CurrentUser';
import { Toolbar } from './components/datagrid/Toolbar';
import { useDialog } from './components/dialogs/useDialog';
import { AppToolbar } from './components/layout/AppToolbar';
import { SizedBox } from './components/layout/SizedBox';
import { store, useAppSelector } from './features/store';
import { loadUserContext } from './features/userContextSlice';
import theme from './theme';
import { LicenseInfo } from '@mui/x-license';
import { DataGridPro } from '@mui/x-data-grid-pro';

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_PRO_KEY);

const m3api = new M3API();
store.dispatch(loadUserContext(m3api));

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

function Layout() {
  return (
    <>
      <ErrorBoundary FallbackComponent={Fallback}>
        <AppToolbar>
          <Typography variant="h4" component="p">
            App Title
          </Typography>
          <Box flexGrow={1} />
          <Stack direction="row" spacing={1}>
            <CurrentUser chipProps={{ size: 'small' }} showRoles />
            <CurrentCompanyDivision chipProps={{ size: 'small', variant: 'outlined' }} canEdit />
            <CurrentFacilityWarehouse chipProps={{ size: 'small', variant: 'outlined' }} canEdit />
            <CurrentPrinter chipProps={{ size: 'small', variant: 'outlined' }} canEdit />
          </Stack>
        </AppToolbar>
        <Outlet />
      </ErrorBoundary>
    </>
  );
}

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

function Page() {
  const state = useAppSelector(state => state);
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
          {/* <Button
            color="success"
            onClick={async () => {
              console.log(
                await confirm({ title: 'Confirm Dialog Title', message: 'Confirm dialog message', severity: 'success' })
              );
            }}
          >
            Show Success Dialog
          </Button> */}
          {/* <Button
            color="warning"
            onClick={async () => {
              console.log(
                await confirm({
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
                await confirm({ title: 'Confirm Dialog Title', message: 'Confirm dialog message', severity: 'error' })
              );
            }}
          >
            Show Error Dialog
          </Button> */}
        </Box>
        <Box marginY={1}>
          <SampleDataGrid />
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

function SampleDataGrid() {
  function CustomDataGridToolbar() {
    const rows = useSelectedRows();
    return (
      <Toolbar
        title="Custom Toolbar Title"
        titleProps={{ variant: 'body1' }}
        refresh={() => {}}
        refreshButtonProps={{ size: 'small' }}
      >
        <ButtonGroup size="small">
          <Button disabled={rows.length === 0}>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>
      </Toolbar>
    );
  }

  return (
    <DataGridPro
      columns={[{ field: 'A' }, { field: 'B' }]}
      rows={[
        { id: 0, A: '111', B: '222' },
        { id: 1, A: '333', B: '444' },
      ]}      
      hideFooter={true}
      slots={{
        toolbar: CustomDataGridToolbar,
      }}
    />
  );
}
