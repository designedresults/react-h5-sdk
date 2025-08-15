import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Box from '@mui/material/Box';
import Chip, { ChipProps } from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';
import { useAppSelector } from '../../features/store';
import ImpersonateUser from '../dialogs/ImpersonateUser';

type Props = {
  showRoles?: boolean;
  onChange?: () => void;
  chipProps?: ChipProps;
  canImpersonate?: boolean;
};
export default function CurrentUser({ showRoles, onChange, chipProps, canImpersonate }: Props) {
  const { userId, userName, roles, impersonator } = useAppSelector(state => state.userContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (!userId) {
    return;
  }


  return (
    <>
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
        <Chip icon={
          impersonator ? 
          <SupervisorAccountIcon color="inherit" /> :
          <PersonIcon color="inherit" /> 
        } sx={{ color: 'inherit' }} label={userId}
          onClick={canImpersonate ? handleOpen : undefined}
          {...chipProps} />
      </Tooltip>
      <ImpersonateUser open={open} onChange={onChange} handleClose={handleClose} />
    </>
  );
}
