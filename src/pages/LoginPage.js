import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import {Link, Container, Typography, Divider, Stack, Button, Snackbar} from '@mui/material';
// hooks
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import { Provider} from "react-redux";
import {Alert} from "@mui/lab";
import store from "../store"

// components
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

const BASE_URL = process.env.REACT_APP_URL

export default function LoginPage({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const [steamId, setSteamId] = useState(null);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const steamIdFromUrl = urlParams.get('steamid');
    if (steamIdFromUrl) {
      setSteamId(steamIdFromUrl);
    }
  }, []);

  // functions

  const handleError = () => {
    console.log("as")
    setOpen(true)
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSteamClick = () => {
    window.location.href = "http://localhost:3001/auth/steam";
  }

  return (
    <>
      <Helmet>
        <title> Login | Sutoga </title>
      </Helmet>

      <StyledRoot sx={{mt: -7}}>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to Sutoga
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link variant="subtitle2" to="register" onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}>Get started</Link>
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleSteamClick}>
                <Iconify icon="mdi:steam" width={30} height={30} />
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                Wrong username or password
              </Alert>
            </Snackbar>

            <LoginForm onError={handleError} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
