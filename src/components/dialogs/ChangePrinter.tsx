import EditIcon from '@mui/icons-material/edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import React, { useEffect } from 'react';
import { FormContainer } from 'react-hook-form-mui';

import { useChangePrinterMutation } from '@/features/user/api/changePrinter';
import { useAppSelector } from '@/store';
import Button from '@mui/material/Button';
import AutocompletePrinter from '../form/AutocompletePrinter';

type Props = {
  open: boolean;
  handleClose: () => void;
  onChange?: () => void;
};

export default function ChangeFacilityWarehouse({ open, handleClose, onChange }: Props) {
  const { userId, division, printer } = useAppSelector(state => state.userContext);
  const [submit, action] = useChangePrinterMutation();

  useEffect(() => {
    if (onChange) {
      onChange();
    }
    handleClose();
  }, [action.isSuccess])

  return (
    <Dialog open={open} fullWidth maxWidth={'sm'}>
      <FormContainer
        defaultValues={{
          userId,
          division,
          printerFile: printer?.printerFile ?? '',
          device: printer?.device ?? '',
          sequence: printer?.sequence ?? ''
        }}

        onSuccess={async (data) => {
          await submit(data).unwrap();
        }}
      >
        <DialogTitle>Update Printer</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2} margin={2}>
            <AutocompletePrinter />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={action.isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<EditIcon />} loading={action.isLoading}>
            Update
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
}
