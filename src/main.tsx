import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { Provider } from 'react-redux';
import CurrentCompanyDivision from './components/chips/CurrentCompanyDivision';
import CurrentFacilityWarehouse from './components/chips/CurrentFacilityWarehouse';
import CurrentPrinter from './components/chips/CurrentPrinter';
import CurrentUser from './components/chips/CurrentUser';
import { Toolbar } from './components/datagrid/Toolbar';
import AppToolbar from './components/layout/AppToolbar';
import SizedBox from './components/layout/SizedBox';
import { store, useAppSelector } from './features/store';
import { loadUserContext } from './features/userContextSlice';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';

store.dispatch(loadUserContext());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
      </LocalizationProvider>
    </Provider>
  </React.StrictMode>
);

function App() {
  const state = useAppSelector(state => state);

  function CustomDataGridToolbar() {
    return (
      <Toolbar
        title="Custom Toolbar Title"
        titleProps={{ variant: 'body1' }}
        refresh={() => {}}
        refreshButtonProps={{ size: 'small' }}
      >
        <ButtonGroup size="small">
          <Button>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>
      </Toolbar>
    );
  }

  return (
    <>
      <AppToolbar>
        <Typography variant="h4" component="p">
          App Title
        </Typography>
        <Box flexGrow={1} />
        <CurrentUser chipProps={{ size: 'small' }} showRoles />
        <CurrentCompanyDivision chipProps={{ size: 'small', variant: 'outlined' }} canEdit />
        <CurrentFacilityWarehouse chipProps={{ size: 'small', variant: 'outlined' }} canEdit />
        <CurrentPrinter chipProps={{ size: 'small', variant: 'outlined' }} canEdit />
      </AppToolbar>
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
        <Box marginY={1}>
          <DataGrid
            columns={[]}
            rows={[]}
            slots={{
              toolbar: CustomDataGridToolbar,
            }}
          />
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
