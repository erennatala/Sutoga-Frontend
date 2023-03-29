import { Helmet } from 'react-helmet-async';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { styled } from '@mui/material/styles';
import * as React from 'react';
import {
    Link,
    Container,
    Typography,
    Divider,
    Stack,
    Button,
    TextField,
    InputAdornment,
    IconButton, Checkbox, Select, MenuItem, Box, Snackbar
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Alert, DatePicker, LoadingButton, LocalizationProvider} from "@mui/lab";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import axios from "axios";
import Iconify from "../components/iconify";

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
}));

const BASE_URL = process.env.REACT_APP_URL

export default function RegisterPage() {
    const navigate = useNavigate();
    const [toastOpen, setToastOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false)

    const [steamId, setSteamId] = useState();

    const [userName, setUserName] = useState(null);
    const [email, setEmail] = useState(null);
    const [pwd, setPwd] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [gender, setGender] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(0);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const steamIdFromUrl = urlParams.get('steamid');
        if (steamIdFromUrl) {
            setSteamId(steamIdFromUrl);
        }
    }, []);

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            const signuprequest = JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                username: userName,
                email: email,
                password: pwd,
                phoneNumber: phoneNumber,
                birthDate: birthDate
            });

            const response = axios.post(`${BASE_URL}auth/register`, signuprequest, {
                headers: { 'Content-Type': 'application/json' },
            });

            let data;
            await response.then((result) => {
                data = result.data;
                return data;
            })
            setSuccess(true);
            setToastOpen(true)
            navigate('/home', { replace: true });
        } catch(err) {
            console.log("hTA")
        }
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastOpen(false);
    };

    return(
        <>
        <Helmet>
            <title> Register | Sutoga </title>
        </Helmet>

            <Snackbar open={toastOpen} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    This is a success message!
                </Alert>
            </Snackbar>

        <StyledRoot>
            <Container maxWidth="sm">
                <StyledContent>
                    <Typography variant="h4" gutterBottom>
                        Sign up to Sutoga
                    </Typography>

                <Stack spacing={3}>
                    <Stack direction="row">
                        <TextField  name="firstName" label="First Name" onChange={(e) => setFirstName(e.target.value)}/>

                        <Box sx={{ flexGrow: 1 }} />

                        <TextField  name="lastName" label="Last Name" onChange={(e) => setLastName(e.target.value)}/>
                    </Stack>
                    <TextField name="username" label="Username" onChange={(e) => setUserName(e.target.value)}/>

                    <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)}/>

                    <TextField
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPwd(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Stack direction="row">
                        <TextField
                            id="date"
                            label="Birthday"
                            type="date"
                            defaultValue="2000-01-01"
                            sx={{ width: 250 }}
                            onChange={(e) => setBirthDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <Box sx={{ flexGrow: 1 }} />

                        <PhoneInput
                            country={"tr"}
                            inputStyle={{ borderRadius: "13px", height: "40px", width: "100%" }}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e)}
                        />
                    </Stack>

                </Stack>

                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} sx={{mt: 2}}>
                    Sign Up
                </LoadingButton>
                </StyledContent>
            </Container>
        </StyledRoot>
        </>
    )
}