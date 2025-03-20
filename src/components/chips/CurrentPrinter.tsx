import PrintIcon from '@mui/icons-material/Print';
import Chip, { ChipProps } from '@mui/material/Chip';
import React, { useState } from 'react';
import { useAppSelector } from '../../features/store';
import ChangePrinter from '../dialogs/ChangePrinter';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

type Props = {
  canEdit?: boolean;
  chipProps?: ChipProps
};

export default function CurrentPrinter({canEdit, chipProps}: Props) {
  
  const { printer } = useAppSelector(state => state.userContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (printer === null) {
    return;
  }

  return (
    <>
      <Tooltip
        title={
          <>
            {!printer?.device && <Box>No printer</Box>}
            {printer?.device && <Box>Printer: {printer?.device}</Box>}
            {printer?.printerFile && <Box>Print file: {printer?.printerFile}</Box>}
          </>
        }
        arrow
      >
        <Chip
          icon={<PrintIcon color="inherit" />}
          label={`${printer?.device ?? 'NONE'}`}
          onClick={canEdit ? handleOpen : undefined}
          sx={{ color: 'inherit' }}
          {...chipProps}
        />
      </Tooltip>
      {open && <ChangePrinter open={open} handleClose={handleClose} />}
    </>
  );
}
