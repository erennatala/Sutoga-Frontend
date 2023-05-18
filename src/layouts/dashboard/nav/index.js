import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import {styled, alpha, useTheme} from '@mui/material/styles';
import {Box, Link, Button, Drawer, Typography, Avatar, Stack, Grid, Container, ButtonBase} from '@mui/material';
// hooks
import axios from "axios";
import useResponsive from '../../../hooks/useResponsive';
// components
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import FriendRecCard from "../../../components/cards/FriendRecCard";

// ----------------------------------------------------------------------

const NAV_WIDTH = 255;
const BASE_URL = process.env.REACT_APP_URL
const { electron } = window;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDesktop = useResponsive('up', 'lg');

  const [friendRec, setFriendRec] = useState([])

  const [localUsername, setLocalUsername] = useState('');
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const username = await window.electron.ipcRenderer.invoke('getUsername');
        setLocalUsername(username);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if(userId) getFriendRecs() // This will run only if userId is truthy
  }, [userId])

  useEffect(() => {
    (async () => {
      try {
        const id = await window.electron.ipcRenderer.invoke('getId');
        setUserId(id);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const getFriendRecs = async () => {
    try {
      const token = await window.electron.ipcRenderer.invoke('getToken');

      const recresponse = await axios.get(`${BASE_URL}users/getFriendRecommendations?userId=${userId}`, {
        headers: {
          'Authorization': `${token}`
        }
      });

      setFriendRec(recresponse.data);
    } catch (e) {
      console.log(e);
    }
  }

  const routeChange = () =>{
    const path = `profile`;
    navigate(path);
  }

  const renderContent = (
      <Box sx={{overflow: "hidden"}}>
        <Box sx={{ px: 2.5, py: 3, display: 'inline-flex', maxWidth: "80%", ml: 3 }}>
          <img src="/assets/images/brand/main-logo.png" alt="sidebar-logo"/>
        </Box>

        <Box sx={{ mb: 5, mx: 1}}>
          <ButtonBase onClick={routeChange} sx={{width: "100%"}}>
            <Link underline="none">
              <StyledAccount>
                <Avatar src="" alt="photoURL" />

                <Box sx={{ pl: 1.5 }}>
                  <Typography variant="subtitle2" sx={{
                    color: 'text.primary',
                    fontSize: '1rem', // default font size
                    '@media (min-width: 600px)': {
                      fontSize: '0.9rem', // font size for screen widths >= 600px
                    },
                    '@media (min-width: 1500px)': {
                      fontSize: '0.9rem', // font size for screen widths >= 960px
                    }
                  }}>
                    {localUsername}
                  </Typography>
                </Box>
              </StyledAccount>
            </Link>
          </ButtonBase>
        </Box>

        <NavSection data={navConfig} />

        <Box sx={{ flexGrow: 0.1 }} />

        <Box>
          <Grid xs={12}>
            <Container columns={12} sx={{height: "400px"}}>
              <Grid xs={12} sx={{backgroundColor: alpha(theme.palette.grey[500], 0.12), borderRadius: Number(theme.shape.borderRadius)}}>

                {friendRec.map((user, index) => <div key={index}>
                  <FriendRecCard nickname={user} />
                </div>)}
              </Grid>
              <Button variant="text">See more like this</Button>
            </Container>
          </Grid>
        </Box>
      </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
