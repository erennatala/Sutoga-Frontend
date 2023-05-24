import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import {Link, Container, Typography, Divider, Stack, Button, Snackbar, Card} from '@mui/material';
// hooks
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import { Provider} from "react-redux";
import {Alert} from "@mui/lab";
import store from "../store"
import { useDispatch } from 'react-redux';
import { setAuthenticated, setToken, setUserName } from '../actions/authActions';

// components
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';
import LoadingScreen from "./LoadingScreen";

// ----------------------------------------------------------------------

const bgImage = window.location.href + "assets/images/bg.jpg";

const FormCard = styled(Card)({
  padding: '16px',
  borderRadius: '8px',
  backgroundColor: '#fff',
});

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
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
  backgroundColor: 'transparent',
}));

const BASE_URL = process.env.REACT_APP_URL

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [steamId, setSteamId] = useState(null);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleSteamClick = () => {
    window.location.href = "http://localhost:3001/auth/steam";
  }

  useEffect(() => {
    dispatch(setAuthenticated(false));

    const checkIfLoggedIn = async () => {
      const token = await window.electron.ipcRenderer.invoke('getToken');

      if (token) {
        dispatch(setAuthenticated(true));
        navigate('/home', { replace: true })
        setLoading(false);
      }
      else {
        setLoading(false);
      }
    };

    checkIfLoggedIn();
  }, []);

  useEffect(() => {
    dispatch(setAuthenticated(false));

    const getSteamId = async () => {
      const steamIdFromStore = await window.electron.ipcRenderer.invoke('getSteamId');
      if (steamIdFromStore) {
        dispatch(setAuthenticated(true));
        setSteamId(steamIdFromStore);
        navigate('/home', { replace: true })
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    getSteamId();
  }, []);


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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title> Login | Sutoga </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            <FormCard>
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

              <LoginForm onError={handleError}/>
            </FormCard>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
