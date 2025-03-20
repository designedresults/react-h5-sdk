import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { Box, CssBaseline, Paper, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { Provider } from 'react-redux';
import AppToolbar from './components/layout/AppToolbar';
import SizedBox from './components/layout/SizedBox';
import CurrentCompanyDivision from './components/chips/CurrentCompanyDivision';
import CurrentFacilityWarehouse from './components/chips/CurrentFacilityWarehouse';
import CurrentPrinter from './components/chips/CurrentPrinter';
import CurrentUser from './components/chips/CurrentUser';
import { store, useAppSelector } from './features/store';
import { loadUserContext } from './features/userContextSlice';

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
        <Typography fontWeight={'bold'}>Redux Store State</Typography>
        <Paper>
          <SizedBox padding={2}>
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
