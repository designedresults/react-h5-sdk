import { usePreviewFlags } from '@/features/flag/flagSlice';
import { useGetUserContextQuery, useSetUserContextMutation } from '@/features/user/api/getUserContext';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { FormContainer, useForm } from 'react-hook-form-mui';
import AutocompleteUser from '../form/AutocompleteUser';
import ResultDialog from './ResultDialog';


type Props = {
  open: boolean;
  handleClose: () => void;
  onChange?: () => void;
};

export default function ImpersonateUser({ open, handleClose, onChange }: Props) {

  type FormValues = {
    userId: string
  }
  const formContext = useForm<FormValues>({
    defaultValues: {
      userId: ""
    }
  })
  const { watch, formState, reset } = formContext

  const [submit, result] = useSetUserContextMutation()

  const selectedUserId = watch('userId')

  useEffect(() => {
    if (onChange) {
      onChange()
    }
    reset()
    handleClose()
  }, [formState.isSubmitSuccessful])


  return (
    <>
      <Dialog open={open} fullWidth maxWidth={'sm'}>
        <FormContainer
          formContext={formContext}
          onSuccess={async (data) => { await submit(data) }}
        >
          <DialogTitle>Impersonate User</DialogTitle>
          <DialogContent>
            <Stack direction="column" spacing={2} margin={2}>
              <AutocompleteUser />
              {selectedUserId &&
                <Box p={1} height={300} alignContent={"center"} >
                  <UserDetails userId={selectedUserId} />
                </Box>
              }
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={formState.isSubmitting}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              loading={formState.isSubmitting}
              startIcon={<AddModeratorIcon />}
            >
              Impersonate
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>

      {(result.isError) &&
        <ResultDialog result={result} title="Impersonate User" errorMessage='Failed to impersonate user.' />
      }

    </>
  );
}

type UserDetailsProps = {
  userId: string
}
export function UserDetails({ userId }: UserDetailsProps) {
  const { data, isLoading, isFetching, error } = useGetUserContextQuery({ userId })
  const flags = usePreviewFlags(data?.roles)

  if (error) {
    return (
      <Box color="error">
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </Box>
    )
  }

  if (isLoading || isFetching || !data) {
    return (
      <Box textAlign={"center"}>
        <CircularProgress />
      </Box>
    )
  }

  return (

    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell>User id</TableCell>
          <TableCell>{data.userId}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>User name</TableCell>
          <TableCell>{data.userName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Company</TableCell>
          <TableCell>{data.company} - {data.companyName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Division</TableCell>
          <TableCell>{data.division === "" ? "BLANK" : data.division} - {data.divisionName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Facility</TableCell>
          <TableCell>{data.facility} - {data.facilityName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Warehouse</TableCell>
          <TableCell>{data.warehouse} - {data.warehouseName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={data.roles.length + 1}>Roles</TableCell>
        </TableRow>
        {data.roles?.map((role: string) => (<TableRow key={role}><TableCell>{role}</TableCell></TableRow>))}
        {flags &&
          <TableRow>
            <TableCell>Flags</TableCell>
            <TableCell>
              {Object.entries(flags).map(([flag, enabled]) => (
                <Stack key={flag} direction="row" alignItems={"center"} spacing={1}>
                  {enabled ? <CheckBoxIcon fontSize={'small'} /> : <CheckBoxOutlineBlankIcon fontSize={'small'} />}
                  <Typography>{flag}</Typography>
                </Stack>))}
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>

  )
}