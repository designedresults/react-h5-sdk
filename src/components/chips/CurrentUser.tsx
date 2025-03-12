import PersonIcon from '@mui/icons-material/Person';
import Chip, { ChipProps } from '@mui/material/Chip';
import React from 'react';
import { useAppSelector } from '../../features/store';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

export default function CurrentUser(props: ChipProps) {
  const { userId, userName } = useAppSelector(state => state.userContext);
  if (!userId) {
    return;
  }
  return (
    <Tooltip
      title={
        <>
          <Box>User id: {userId}</Box>
          <Box>User name: {userName}</Box>
        </>
      }
     arrow >
      <Chip icon={<PersonIcon color="inherit" />} sx={{ color: 'inherit' }} label={userId} {...props} />
    </Tooltip>
  );
}
