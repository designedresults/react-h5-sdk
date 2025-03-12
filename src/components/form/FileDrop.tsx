import { UploadFile } from "@mui/icons-material";
import { Alert, Button } from "@mui/material";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useList } from "@uidotdev/usehooks";
import React from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

interface FileDropProps {
  options?: DropzoneOptions;
  onUpload: (file: File[]) => void;
  autoUpload?: boolean;
}

const FileDrop: React.FC<FileDropProps> = ({ options, onUpload, autoUpload }) => {
  const [files, { set, push, removeAt, clear }] = useList<File>([]);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: acceptedFiles => {
      if (autoUpload === true) {
        onUpload(acceptedFiles);
      } else {
        if (options?.multiple) {
          acceptedFiles.forEach(push);
        } else {
          set(acceptedFiles);
        }
      }
    },
    noClick: true,
    ...options,
  });
  const { ref, ...rootProps } = getRootProps();
  const inputProps = getInputProps();
  return (
    <Box
      component={Paper}
      ref={ref}
      {...rootProps}
      width={'100%'}
      px={2}
      py={1}
      sx={{ backgroundColor: isDragActive ? grey[200] : grey[100] }}
    >
      <Stack direction="row" alignItems={'center'} spacing={2}>
        <UploadFile />
        <Typography>
          Drag and drop or{' '}
          <Button variant="text" onClick={open}>
            click here
          </Button>{' '}
          to upload a file.
        </Typography>
      </Stack>
      {files.map((file, i) => (
        <Box key={i} pt={1}>
          <Alert
            sx={{ px: 1, py: 0 }}
            severity="success"
            variant="outlined"
            onClose={() => {
              removeAt(i);
            }}
          >
            {file.name}
          </Alert>
        </Box>
      ))}
      {autoUpload !== true && files.length > 0 && (
        <Stack pt={1} direction="row" justifyContent={'end'} spacing={1}>
          <Button
            variant="outlined"
            onClick={() => {
              clear();
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onUpload(files);
              clear();
            }}
          >
            Upload
          </Button>
        </Stack>
      )}
      <input {...inputProps} />
    </Box>
  );
};

export default FileDrop;
