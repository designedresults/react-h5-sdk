import Box from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { PropsWithChildren } from 'react';
import { RefreshButton } from '../button/RefreshButton';
import Stack from '@mui/material/Stack';
import { IconButtonProps } from '@mui/material/IconButton';

type Props = {
  title?: string;
  titleProps?: TypographyProps;
  refresh?: Function;
  refreshButtonProps?: IconButtonProps;
  quickFilter?: boolean;
};

export function Toolbar({
  title,
  titleProps,
  refresh,
  refreshButtonProps,
  quickFilter,
  children,
}: Props & PropsWithChildren) {
  return (
    <GridToolbarContainer sx={{ padding: 0 }}>
      <Stack direction="row" width="100%" alignItems={'center'} padding={0.5}>
        {title && <Typography {...titleProps}>{title}</Typography>}
        <Box flexGrow={1} />
        {quickFilter && <GridToolbarQuickFilter />}
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
    </GridToolbarContainer>
  );
}
