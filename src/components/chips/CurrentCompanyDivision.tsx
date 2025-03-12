import LanguageIcon from '@mui/icons-material/Language';
import Chip, { ChipProps } from '@mui/material/Chip';
import React, { useState } from 'react';
import { useAppSelector } from '../../features/store';
import ChangeCompanyDivision from '../dialogs/ChangeCompanyDivision';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

type Props = {
  canEdit?: boolean;
};

export default function CurrentCompanyDivision(props: Props & ChipProps) {
  const { company, companyName, division, divisionName, environment, tenantId } = useAppSelector(state => state.userContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { ['canEdit']: removedProp, ...filteredProps } = props;

  if (!company) {
    return;
  }
  return (
    <>
      <Tooltip
        title={
          <>
            <Box>Tenant: {tenantId} </Box>
            <Box>Company: {company} - {companyName} </Box>
            <Box>Division: {division} - {divisionName}</Box>
          </>
        }
        arrow
      >
        <Chip
          icon={<LanguageIcon color="inherit" />}
          label={`${environment} ${company}/${division}`}
          onClick={props.canEdit ? handleOpen : undefined}
          sx={{ color: 'inherit' }}
          {...filteredProps}
        />
      </Tooltip>
      {open && <ChangeCompanyDivision open={open} handleClose={handleClose} />}
    </>
  );
}
