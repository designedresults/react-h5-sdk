import LanguageIcon from '@mui/icons-material/Language';
import Chip, { ChipProps } from '@mui/material/Chip';
import React, { useState } from 'react';

import { useAppSelector } from '../../store';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ChangeCompanyDivision from '../dialogs/ChangeCompanyDivision';

type Props = {
  canEdit?: boolean;
  onChange?: () => void;
  chipProps?: ChipProps;
};

export default function CurrentCompanyDivision({ canEdit, onChange, chipProps }: Props) {
  const { company, companyName, division, divisionName, environment, tenantId } = useAppSelector(state => state.userContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (!company) {
    return;
  }
  return (
    <>
      <Tooltip
        title={
          <>
            <Box>Tenant: {tenantId} </Box>
            <Box>
              Company: {company} - {companyName}{' '}
            </Box>
            <Box>
              Division: {division} - {divisionName}
            </Box>
          </>
        }
        arrow
      >
        <Chip
          icon={<LanguageIcon color="inherit" />}
          label={`${environment} ${company}/${division}`}
          onClick={canEdit ? handleOpen : undefined}
          sx={{ color: 'inherit' }}
          {...chipProps}
        />
      </Tooltip>
      <ChangeCompanyDivision open={open} onChange={onChange} handleClose={handleClose} />
    </>
  );
}
