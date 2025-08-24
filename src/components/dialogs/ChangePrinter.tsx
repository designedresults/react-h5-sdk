import EditIcon from '@mui/icons-material/edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import React, { useEffect } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';

import { ChangePrinterArgs, useChangePrinterMutation } from '@/features/user/api/changePrinter';
import { useAppSelector } from '@/store';
import Button from '@mui/material/Button';
import AutocompletePrinter from '../form/AutocompletePrinter';
import ResultDialog from './ResultDialog';

type Props = {
  open: boolean;
  handleClose: () => void;
  onChange?: () => void;
};

export default function ChangeFacilityWarehouse({ open, handleClose, onChange }: Props) {
  const { userId, division, printer } = useAppSelector(state => state.userContext);
  const device = useAppSelector(state => state.userContext.printer?.device)

  const formContext = useForm<ChangePrinterArgs>({
    defaultValues: {
      userId,
      division,
      printerFile: printer?.printerFile,
      device,
      sequence: printer?.sequence
    }
  })
  const { formState, reset } = formContext
  const [submit, result] = useChangePrinterMutation();

  useEffect(() => {
    if (onChange) {
      onChange();
    }
    reset()
    handleClose();
  }, [result.isSuccess])

  return (
    <>
      <Dialog open={open} fullWidth maxWidth={'sm'}>
        <FormContainer
          formContext={formContext}
          onSuccess={async (data) => await submit(data)}
        >
          <DialogTitle>Update Printer</DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2} margin={2}>
              <AutocompletePrinter />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}
              disabled={formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<EditIcon />}
              loading={formState.isSubmitting}
            >
              Update
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
      {(result.isError) &&
        <ResultDialog result={result} title="Update printer" />
      }
    </>
  );
}
