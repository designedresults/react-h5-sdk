import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form-mui';
import { useAppDispatch, useAppSelector, userApi } from '../../features';
import AutocompleteUser from '../form/AutocompleteUser';

type Props = {
  open: boolean;
  handleClose: () => void;
  onChange?: () => void;
};

export default function ImpersonateUser({ open, handleClose, onChange }: Props) {
  const { userId, userName } = useAppSelector(state => state.userContext)
  const dispatch = useAppDispatch()
  type FormValues = {
    user: { id: string, label: string } | null,
  }
  const formContext = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      user: { id: userId, label: userName },
    }
  })
  const { watch, handleSubmit, formState } = formContext

  const user = watch('user')

  const { data: userContext, isLoading, isFetching } = userApi.useGetUserQuery(user?.id ?? null, { skip: !user })

  const loading = isLoading || isFetching

  return (
    <Dialog open={open} fullWidth maxWidth={'sm'}>
      <FormProvider {...formContext}>
        <form >
          <DialogTitle>Impersonate User</DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2} margin={2}>
              <AutocompleteUser />
              <Box p={1} height={160} alignContent={"center"} >
                {(loading) &&
                  <Box textAlign={"center"}>
                    <CircularProgress />
                  </Box>
                }

                {userContext && !(loading) &&
                  <>
                    <Typography>Company: {userContext.company} - {userContext.companyName}</Typography>
                    <Typography>Division: {userContext.division} - {userContext.divisionName}</Typography>
                    <Typography>Facility: {userContext.facility} - {userContext.facilityName}</Typography>
                    <Typography>Warehouse: {userContext.warehouse} - {userContext.warehouseName}</Typography>
                    <Typography>Roles: {userContext.roles.join(', ')}</Typography>
                  </>
                }
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} >Cancel</Button>
            <Button
              variant="outlined"
              loading={formState.isSubmitting}
              startIcon={<PersonIcon />}
              onClick={handleSubmit(async () => {
                const { data } = await dispatch(userApi.endpoints.getUser.initiate(null));
                dispatch({ type: 'userContext/setUserContext', payload: data });
                if (onChange) {
                  onChange()
                }
                handleClose()
              })}
            >
              Revert
            </Button>
            <Button
              variant="contained"
              disabled={loading}
              loading={formState.isSubmitting}
              startIcon={<SupervisorAccountIcon />}
              onClick={handleSubmit(async (data) => {
                dispatch({ type: 'userContext/setUserContext', payload: userContext });
                if (onChange) {
                  onChange()
                }
                handleClose()
              })} >
              Impersonate
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
