import { ChangeCompanyDivisionArgs, useChangeCompanyDivisionMutation } from '@/features/user/api/changeCompanyDivision';
import { useAppSelector } from '@/store';
import EditIcon from '@mui/icons-material/edit';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import React, { useEffect } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import { AutocompleteCompany, AutocompleteDivision } from '../form';
import ResultDialog from './ResultDialog';

type Props = {
  open: boolean;
  handleClose: () => void;
  onChange?: () => void;
};

export default function ChangeCompanyDivision({ open, handleClose, onChange }: Props) {
  const { userId, company, division } = useAppSelector(state => state.userContext);
  const formContext = useForm<ChangeCompanyDivisionArgs>({
    defaultValues: {
      userId,
      company: company ?? '',
      division: division ?? ''
    }
  })
  const { formState, reset } = formContext
  const [submit, result] = useChangeCompanyDivisionMutation();


  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      if (onChange) {
        onChange();
      }
      reset()
      handleClose();
    }
  }, [formState.isSubmitSuccessful])

  return (
    <>
      <Dialog open={open} fullWidth maxWidth={'sm'}>
        <FormContainer
          formContext={formContext}
          onSuccess={async (data) => await submit(data)}
        >
          <DialogTitle>Update Company and Division</DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2} margin={2}>
              <AutocompleteCompany />
              <AutocompleteDivision />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={formState.isSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<EditIcon />} loading={formState.isSubmitting}>
              Update
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
      {(result.isError) &&
        <ResultDialog result={result} title="Update company and division" />
      }
    </>
  );
}
