import {useEffect, useState} from 'react';
import { useSelector, useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import {logout} from "../../../actions/authActions";
// mocks_
import account from '../../../_mock/account';
import { setAuthenticated } from '../../../actions/authActions';
const { ipcRenderer } = window.electron;

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    path: '/home'
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    path: '/profile'
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    path: '/settings'
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover({ setIsAuthenticated }) {
  const [open, setOpen] = useState(null);
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth.userName);
  const navigate = useNavigate()

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      await ipcRenderer.invoke('logout');
      dispatch(setAuthenticated(false));
    } catch (error) {
      console.error('Error while calling ipcRenderer.invoke(\'logout\'):', error);
    }
  };


  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {username}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
