import { useSetUserContextMutation } from '../../features/user/api/getUserContext';
import { useAppSelector } from '@/store';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import PersonIcon from '@mui/icons-material/Person';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import Chip, { ChipProps } from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import React, { useMemo, useState } from 'react';
import ImpersonateUser from '../dialogs/ImpersonateUser';
import ResultDialog from '../dialogs/ResultDialog';
import Box from '@mui/material/Box';

type Props = {
  showRoles?: boolean;
  onChange?: () => void;
  chipProps?: ChipProps;
  canImpersonate?: boolean;
};
export default function CurrentUser({ showRoles, onChange, chipProps, canImpersonate }: Props) {

  const { userId, userName, roles, impersonator } = useAppSelector(state => state.userContext);


  const [submit, result] = useSetUserContextMutation()

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { actionIcon, action } = useMemo(() => {
    let actionIcon
    let action

    if (result.isLoading) {
      actionIcon = <CircularProgress size={14} />
      action = () => {}
    } else if (impersonator) {
      // impersonation in effect
      actionIcon = <RemoveModeratorIcon />
      action = async () => {
        await submit({ userId: null })
      }
    } else if (canImpersonate && !impersonator) {
      // able to impersonate, but no impersonation currently set
      actionIcon = <AddModeratorIcon />
      action = handleOpen
    }    

    return { actionIcon, action }
  }, [canImpersonate, impersonator, result.isLoading])

  if (!userId) {
    return;
  }


  return (
    <>
      <Tooltip
        title={
          <>
            <Box>User id: {userId} {impersonator && `(${impersonator})`}</Box>
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
        <Chip
          {...chipProps}
          icon={<PersonIcon color="inherit" />}
          onDelete={action}
          deleteIcon={actionIcon}
          sx={{
            color: 'inherit',
            '& .MuiChip-deleteIcon': {
              color: 'inherit',
            },
            '& .MuiChip-deleteIcon:hover': {
              color: 'inherit',
            },

          }}
          label={userId}

        />
      </Tooltip>
      <ImpersonateUser open={open} onChange={onChange} handleClose={handleClose} />
      {(result.isError || result.isSuccess) &&
        <ResultDialog result={result} title="Impersonate User" />
      }
    </>
  );
}
