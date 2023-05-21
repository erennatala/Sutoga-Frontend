import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
import { useSelector } from 'react-redux';

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

  return (
      <StyledRoot>
        <Header onOpenNav={() => setOpen(true)} username={userData.username} profilePhotoUrl={userData.profilePhotoUrl}/>

        <Nav openNav={open} onCloseNav={() => setOpen(false)} username={userData.username} profilePhotoUrl={userData.profilePhotoUrl}/>

        <Main>
          <Outlet />
        </Main>
      </StyledRoot>
  );
}