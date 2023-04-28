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

const NAV_WIDTH = 220;
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
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  useEffect(() => {
    getFriendRecs()
  }, [])

  const getFriendRecs = async () => {
    try {
      //const recresponse = axios.get(`${BASE_URL  }users/getFriendRecommendations?userId=${  19}`)
      const recresponse = axios.get(`/users/getFriendRecommendations?userId=${19}`);
      // eslint-disable-next-line no-unused-vars
      let data;
      await recresponse.then((result) => {
        // eslint-disable-next-line no-return-assign,prefer-destructuring
        return data = result.data;
      })
      setFriendRec(data)
    } catch (e) {
      console.log(e)
    }
  }

  const routeChange = () =>{
    const path = `profile`;
    navigate(path);
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex', maxWidth: "80%", ml: 3 }}>
        <img src="/assets/images/brand/main-logo.png" alt="sidebar-logo"/>
      </Box>

      <Box sx={{ mb: 5, mx: 1 }}>
        <ButtonBase onClick={routeChange}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src="" alt="photoURL" />

            <Box sx={{ pl: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
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
        <Grid xs={4} sx={{mr: 3}}>
          <Container columns={4} sx={{position: "fixed", height: "400px"}}>
            <Grid xs={4} sx={{backgroundColor: alpha(theme.palette.grey[500], 0.12), borderRadius: Number(theme.shape.borderRadius)}}>

              {friendRec.map((user, index) => <React.Fragment key={index}>
                <FriendRecCard nickname={user} />
              </React.Fragment>)}
            </Grid>
            <Button variant="text">See more like this</Button>
          </Container>
        </Grid>
      </Box>
    </Scrollbar>
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
