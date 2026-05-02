import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { type IconButtonProps } from '@mui/material/IconButton';

export function RefreshButton(props: IconButtonProps) {
  return (
    <IconButton {...props}>
      <RefreshIcon />
    </IconButton>
  );
}
