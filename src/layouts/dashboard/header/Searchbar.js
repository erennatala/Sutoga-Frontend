import {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import {Input, Slide, IconButton, InputAdornment, ClickAwayListener, Box, Link, Avatar} from '@mui/material';
import Iconify from '../../../components/iconify';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const BASE_URL = process.env.REACT_APP_URL

const StyledSearchbar = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
}));

const SearchResultContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  maxHeight: '200px',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
  zIndex: 1,
}));

const SearchResult = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SearchResultImage = styled('img')({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '10px',
});

export default function Searchbar() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleProfileClick = async (username) => {
    const loggedinusername = await window.electron.ipcRenderer.invoke('getUsername');
    if (username === loggedinusername) {
      navigate(`/profile`, {replace: true});
    } else {
      navigate(`/profile/${username}`, {replace: true});
    }
    setResults([])
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = async (query) => {
    if (query !== "") {
      const loggedinusername = await window.electron.ipcRenderer.invoke('getUsername');
      const token = await window.electron.ipcRenderer.invoke('getToken');

      const config = {
        headers: {
          Authorization: `${token}`
        }
      };
      const response = await axios.get(`${BASE_URL}users/search?q=${query}`, config);
      setResults(response.data.map(user => ({
        ...user,
        profilePhotoUrl: user.profilePhotoUrl || ''
      })).filter(user => user.username !== loggedinusername));
    } else {
      setResults([]);
    }
  };

  return (
      <ClickAwayListener onClickAway={handleClose}>
        <StyledSearchbar>
          <IconButton onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButton>

          {open && (
              <Input
                  autoFocus
                  fullWidth
                  disableUnderline
                  placeholder="Search…"
                  onChange={(e) => handleSearch(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                    </InputAdornment>
                  }
                  sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
              />
          )}

          {open && results.length > 0 && (
              <SearchResultContainer>
                {results.map((result) => {
                  return (
                      <SearchResult
                          key={result.username}
                          onClick={() => handleProfileClick(result.username)}
                          sx={{ cursor: 'pointer' }}
                      >
                        <Avatar
                            src={result.profilePhotoUrl || ''}
                            alt={result.username}
                            style={{ marginRight: '10px' }}
                        />
                        <div style={{ color: 'black' }}>{result.username}</div>
                      </SearchResult>
                  );
                })}
              </SearchResultContainer>
          )}

        </StyledSearchbar>
      </ClickAwayListener>
  );
}
