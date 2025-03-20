import EditIcon from '@mui/icons-material/edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import React from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { useAppSelector, userApi } from '../../features/store';
import AutocompleteFacility from '../form/AutocompleteFacility';
import AutocompleteWarehouse from '../form/AutocompleteWarehouse';
import Typography from '@mui/material/Typography';

type Props = {
  open: boolean;
  handleClose: () => void;
};

export default function ChangeFacilityWarehouse({ open, handleClose }: Props) {
  const { facility, warehouse } = useAppSelector(state => state.userContext);
  const [submit, action] = userApi.useChangeFacilityWarehouseMutation();
  if (action.isError) {
    throw action.error
  }

  return (
    <Dialog open={open} fullWidth maxWidth={'sm'}>
      <FormContainer
        defaultValues={{ facility: facility ?? '', warehouse: warehouse ?? '' }}
        onSuccess={async data => {
          await submit(data).unwrap();
          handleClose();
        }}
      >
        <DialogTitle>Update Facility and Warehouse</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2} margin={2}>
            <AutocompleteFacility />
            <AutocompleteWarehouse />
          </Stack>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} disabled={action.isLoading}>Cancel</Button>
          <Button type="submit" variant="contained" startIcon={<EditIcon />} loading={action.isLoading}>
            Update
          </Button>
        </DialogActions>
        {/* {action.isError && 
        <Typography variant="body1" color="error">{JSON.stringify(action.error)}</Typography>
        } */}
      </FormContainer>
    </Dialog>
  );
}
