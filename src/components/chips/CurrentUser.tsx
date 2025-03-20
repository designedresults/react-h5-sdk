import PersonIcon from '@mui/icons-material/Person';
import Chip, { ChipProps } from '@mui/material/Chip';
import React from 'react';
import { useAppSelector } from '../../features/store';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

type Props = {
  showRoles?: boolean;
  chipProps?: ChipProps;
};
export default function CurrentUser({ showRoles, chipProps }: Props) {
  const { userId, userName, roles } = useAppSelector(state => state.userContext);
  if (!userId) {
    return;
  }
  return (
    <Tooltip
      title={
        <>
          <Box>User id: {userId}</Box>
          <Box>User name: {userName}</Box>
          {showRoles && (
            <>
              <Box>Roles:</Box>
              {roles?.map(role => (<Box key={role} paddingLeft={1}>{role}</Box>))}
            </>
          )}
        </>
      }
      arrow
    >
      <Chip icon={<PersonIcon color="inherit" />} sx={{ color: 'inherit' }} label={userId} {...chipProps} />
    </Tooltip>
  );
}
