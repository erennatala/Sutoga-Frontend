import {useEffect, useState} from 'react';
import { useSelector, useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import {logout} from "../../../actions/authActions";
// mocks_
import { setAuthenticated } from '../../../actions/authActions';
import axios from "axios";
const { ipcRenderer } = window.electron;

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    path: '/settings'
  },
];

const BASE_URL = process.env.REACT_APP_URL

export default function AccountPopover({ setIsAuthenticated }) {
  const [open, setOpen] = useState(null);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const userName = await window.electron.ipcRenderer.invoke('getUsername');
      setUsername(userName);
    };

    fetchUsername();
  }, []);

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

  useEffect(() => {
    const getUserIdProfilePhoto = async () => {
      const token = await window.electron.ipcRenderer.invoke('getToken');
      const userId = await window.electron.ipcRenderer.invoke('getId');
      try {
        const response = await axios.get(`${BASE_URL}users/getProfilePhoto/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setPhotoUrl(response.data);
      } catch (error) {
        console.error('Error retrieving profile photo URL:', error);
        return null;
      }
    };

    getUserIdProfilePhoto();

    return () => {
      setPhotoUrl('');
    };
  }, []);

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
        <Avatar src={photoUrl} alt="photoURL" />
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
