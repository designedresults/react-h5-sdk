import Box from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { QuickFilter } from '@mui/x-data-grid-pro';
import React, { PropsWithChildren } from 'react';
import { RefreshButton } from '../button/RefreshButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { IconButtonProps } from '@mui/material/IconButton';

type Props = {
  title?: string;
  titleProps?: TypographyProps;
  refresh?: Function;
  refreshButtonProps?: IconButtonProps;
  quickFilter?: boolean;
};

export function GridToolbar({
  title,
  titleProps,
  refresh,
  refreshButtonProps,
  quickFilter,
  children,
}: Props & PropsWithChildren) {
  return (
    <Toolbar variant="dense">
      <Stack direction="row" width="100%" alignItems={'center'} padding={0.5}>
        {title && (
          <Typography {...titleProps} paddingLeft={'calc(21px - 1em)'}>
            {title}
          </Typography>
        )}
        <Box flexGrow={1} />
        {quickFilter && <QuickFilter />}
        {children}
        {refresh && (
          <RefreshButton
            size="small"
            {...refreshButtonProps}
            onClick={() => {
              refresh();
            }}
          />
        )}
      </Stack>
    </Toolbar>
  );
}
