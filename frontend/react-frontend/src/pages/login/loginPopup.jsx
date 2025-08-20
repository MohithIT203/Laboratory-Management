// loginPopup.js
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function LoginPopup({ type, message }) {
  return (
    <Stack sx={{ width: '50%' }} spacing={2} style={{ marginTop: '10px',position:'absolute',top:'0px',margin:'10px'}}>
      <Alert variant="filled" severity={type}>
        {message}
      </Alert>
    </Stack>
  );
}
