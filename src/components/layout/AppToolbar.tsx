import React, { PropsWithChildren } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

export function AppToolbar(props: PropsWithChildren) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }} marginBottom={2}>
        <AppBar position="static">
          <Toolbar>{props.children}</Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
