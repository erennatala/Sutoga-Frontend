import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
import { useSelector } from 'react-redux';
import {Alert} from "@mui/lab";
import {Snackbar} from "@mui/material";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 14,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const userData = useSelector(state => state.auth);

    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

  return (
      <StyledRoot>
          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                  {snackbarMessage}
              </Alert>
          </Snackbar>

        <Header onOpenNav={() => setOpen(true)} username={userData.username} profilePhotoUrl={userData.profilePhotoUrl} onSuccess={() => handleSnackbar("Friend request accepted!", "success")}/>

        <Nav openNav={open} onCloseNav={() => setOpen(false)} username={userData.username} profilePhotoUrl={userData.profilePhotoUrl} onSuccess={() => handleSnackbar("Friend request sent!", "success")}/>

        <Main>
          <Outlet />
        </Main>
      </StyledRoot>
  );
}