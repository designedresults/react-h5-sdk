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
import { AutocompleteCompany, AutocompleteDivision } from '../form';

type Props = {
  open: boolean;
  handleClose: () => void;
};

export default function ChangeCompanyDivision({ open, handleClose }: Props) {
  const { company, division } = useAppSelector(state => state.userContext);
  const [submit, action] = userApi.useChangeCompanyDivisionMutation();

  return (
    <Dialog open={open} fullWidth maxWidth={'sm'}>
      <FormContainer
        defaultValues={{ company: company ?? '', division: division ?? '' }}
        onSuccess={async data => {
          await submit(data).unwrap();
          handleClose();
        }}
      >
        <DialogTitle>Update Company and Division</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2} margin={2}>
            <AutocompleteCompany />
            <AutocompleteDivision />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={action.isLoading}>Cancel</Button>
          <Button variant="contained" startIcon={<EditIcon />} loading={action.isLoading}>
            Update
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
}
