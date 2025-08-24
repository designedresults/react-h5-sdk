import PrintIcon from '@mui/icons-material/Print';
import Chip, { ChipProps } from '@mui/material/Chip';
import React, { useState } from 'react';

import { useAppSelector } from '../../store';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ChangePrinter from '../dialogs/ChangePrinter';

type Props = {
  canEdit?: boolean;
  onChange?: () => void;
  chipProps?: ChipProps
};

export default function CurrentPrinter({ canEdit, onChange, chipProps }: Props) {

  const { printer } = useAppSelector(state => state.userContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (!printer) {
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
      <ChangePrinter open={open} onChange={onChange} handleClose={handleClose} />
    </>
  );
}
