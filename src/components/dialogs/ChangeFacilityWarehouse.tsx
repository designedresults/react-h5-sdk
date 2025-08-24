import { ChangeFacilityWarehouseArgs, useChangeFacilityWarehouseMutation } from '@/features/user/api/changeFacilityWarehouse';
import { useAppDispatch, useAppSelector } from '@/store';
import EditIcon from '@mui/icons-material/edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import AutocompleteFacility from '../form/AutocompleteFacility';
import AutocompleteWarehouse from '../form/AutocompleteWarehouse';

type Props = {
  open: boolean;
  handleClose: () => void;
  onChange?: () => void;
};

export default function ChangeFacilityWarehouse({ open, handleClose, onChange }: Props) {
  const { userId, company, division, facility, warehouse } = useAppSelector(state => state.userContext);
  const dispatch = useAppDispatch()
  const formContext = useForm<ChangeFacilityWarehouseArgs>({
    defaultValues: {
      userId,
      company,
      division,
      facility: facility ?? '',
      warehouse: warehouse ?? ''
    }
  })
  const { reset, formState } = formContext
  const [submit, { isSuccess, error }] = useChangeFacilityWarehouseMutation();

  useEffect(() => {
    if (isSuccess) {
      if (onChange) {
        onChange();
      }
      reset()
      handleClose();
    }
  }, [isSuccess])



  return (
    <Dialog open={open} fullWidth maxWidth={'sm'}>
      <FormContainer
        formContext={formContext}
        onSuccess={submit}
      >
        <DialogTitle>Update Facility and Warehouse</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2} margin={2}>
            <AutocompleteFacility />
            <AutocompleteWarehouse />
          </Stack>
          {error !== undefined &&
            <Typography color="error" sx={{ textAlign: 'right' }}>{JSON.stringify(error, null, 2)}</Typography>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={formState.isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<EditIcon />} loading={formState.isSubmitting}>
            Update
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog >
  );
}
