import BusinessIcon from '@mui/icons-material/Business';
import Chip, { ChipProps } from '@mui/material/Chip';
import React, { useState } from 'react';

import { useAppSelector } from '../../store';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ChangeFacilityWarehouse from '../dialogs/ChangeFacilityWarehouse';

type Props = {
  canEdit?: boolean;
  onChange?: () => void;
  chipProps?: ChipProps;
};

export default function CurrentFacilityWarehouse({ canEdit, onChange, chipProps }: Props) {
  const { facility, facilityName, warehouse, warehouseName } = useAppSelector(state => state.userContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (!facility || !warehouse) {
    return;
  }

  return (
    <>
      <Tooltip
        title={
          <>
            <Box>
              Facility: {facility} - {facilityName}
            </Box>
            <Box>
              Warehouse: {warehouse} - {warehouseName}
            </Box>
          </>
        }
        arrow
      >
        <Chip
          icon={<BusinessIcon color="inherit" />}
          label={`${facility}/${warehouse}`}
          onClick={canEdit ? handleOpen : undefined}
          sx={{ color: 'inherit' }}
          {...chipProps}
        />
      </Tooltip>
      <ChangeFacilityWarehouse open={open} handleClose={handleClose} onChange={onChange} />
    </>
  );
}
