import EditIcon from '@mui/icons-material/edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import React from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { useAppSelector, userApi } from '../../features/store';

import AutocompletePrinter from '../form/AutocompletePrinter';
import CancelButton from '../form/CancelButton';
import SubmitButton from '../form/SubmitButton';

type Props = {
  open: boolean;
  handleClose: () => void;
};

export default function ChangeFacilityWarehouse({ open, handleClose }: Props) {
  const { printer } = useAppSelector(state => state.userContext);
  const [submit, action] = userApi.useChangePrinterMutation();

  return (
    <Dialog open={open} fullWidth maxWidth={'sm'}>
      <FormContainer
        defaultValues={{ printer: printer?.device ?? '' }}
        onSuccess={async data => {
          const printMedia = Object.assign({device: data.printer, printer})
          await submit(printMedia).unwrap();
          handleClose();
        }}
      >
        <DialogTitle>Update Printer</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2} margin={2}>
            <AutocompletePrinter />
          </Stack>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleClose}>Cancel</CancelButton>
          <SubmitButton variant="contained" startIcon={<EditIcon />}>
            Update
          </SubmitButton>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
}
