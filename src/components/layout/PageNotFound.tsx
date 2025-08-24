import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  title?: string;
  message?: string;
};

export default function PageNotFound({ title, message }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  let back = location.pathname.split("/").slice(0, -1).join("/");
  if (!back) {
    back = "/";
  }
  return (
    <>
      <Typography variant="h1">{title ?? "Page Not Found"}</Typography>
      <Typography variant="body1" gutterBottom>
        {message ?? "Unable to display this page."}
      </Typography>
      <Stack direction="column" width="100%" spacing={2} alignItems={"end"}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            navigate(back);
          }}
        >
          Back
        </Button>
      </Stack>
    </>
  );
}
