import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {Box, Stack, AppBar, Toolbar, IconButton, Typography} from '@mui/material';
// utils
import { useSelector} from "react-redux";
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import React, {useEffect, useState} from "react";
import Searchbar from "./Searchbar";
import axios from "axios";

// ----------------------------------------------------------------------

const NAV_WIDTH = 220;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 70;

const StyledRoot = styled(AppBar)(({ theme }) => ({
    ...bgBlur({ color: theme.palette.background.default }),
    boxShadow: 'none',
    [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${NAV_WIDTH + 1}px)`,
    },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    minHeight: HEADER_MOBILE,
    [theme.breakpoints.up('lg')]: {
        minHeight: HEADER_DESKTOP,
        padding: theme.spacing(0, 5),
    },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
    onOpenNav: PropTypes.func,
    profilePhotoUrl: PropTypes.string,
    username: PropTypes.string,
};

const BASE_URL = process.env.REACT_APP_URL

export default function Header({ onOpenNav, onSuccess }) {
    const [localUsername, setLocalUsername] = useState("")
    const [photoUrl, setPhotoUrl] = useState("")

    useEffect(() => {
        (async () => {
            try {
                const username = await window.electron.ipcRenderer.invoke('getUsername');
                setLocalUsername(username);
            } catch (error) {
                console.log(error);
            }
        })();

        getProfilePhoto()
    }, []);

    const getProfilePhoto = async () => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const username = await window.electron.ipcRenderer.invoke('getUsername');

            const photoresponse = await axios.get(`${BASE_URL}users/profilePhoto?username=${username}`, {
                headers: {
                    'Authorization': `${token}`
                }
            });

            setPhotoUrl(photoresponse.data);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <StyledRoot>
            <StyledToolbar sx={{ml: 3}}>
                <Typography variant="h5" color="common.black">Welcome back</Typography>
                <Typography>&nbsp;</Typography>
                <Typography variant="h5" color="common.black" fontWeight={"bold"}>{localUsername}</Typography>
                <Typography variant="h5" color="common.black">!</Typography>

                <IconButton
                    onClick={onOpenNav}
                    sx={{
                        mr: 1,
                        color: 'text.primary',
                        display: { lg: 'none' },
                    }}
                >
                    <Iconify icon="eva:menu-2-fill" />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={{
                        xs: 0.5,
                        sm: 1,
                    }}
                >
                    <Searchbar />
                    <NotificationsPopover onSuccess={onSuccess}/>
                    <AccountPopover profilePhotoUrl={photoUrl} />

                </Stack>
            </StyledToolbar>
        </StyledRoot>
    );
}