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
import {Alert, LoadingButton} from "@mui/lab";
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

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [feedbackList, setFeedbackList] = useState({
        firstName: [firstName, false, "", 2],
        lastName: [lastName, false, "", 2],
        email: [email, false, "", 10],
        username: [userName, false, "", 3, 15],
        pwd: [pwd, false, "", 8],
        phoneNumber: [phoneNumber, false, "", 2],
        birthDate: [birthDate, false, "", 2]})

    function validation(e){

        let tempFeedbackList = {
            firstName: [firstName, false, "Enter your name", 2],
            lastName: [lastName, false, "Enter your last name", 2],
            email: [email, false, "Enter a valid email adress", 10],
            username: [userName, false, "Enter a valid username (min 3, max 15 characters)", 3, 15],
            pwd: [pwd, false, "Password must be 8 characters at least", 8],
            phoneNumber: [phoneNumber, false, "Enter a phone number", 2],
            birthDate: [birthDate, false, "", 2]}
        setFeedbackList(tempFeedbackList);

        let count = 0;

        for (let key in tempFeedbackList) {
            if (tempFeedbackList[key][0] === '' && e === "submit" || tempFeedbackList[key][0].length < tempFeedbackList[key][3] && e === "dynamic" && tempFeedbackList[key][0].length > 0) {
                tempFeedbackList[key][1] = true;
                setFeedbackList(tempFeedbackList);
                count++;
            } else if(key !== 'emailInput') {
                tempFeedbackList[key][1] = false;
            }
        }

        return count === 0;
    }

    useEffect(() => {
        validation('dynamic')
    }, [firstName, lastName, userName, pwd])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const steamIdFromUrl = urlParams.get('steamid');
        if (steamIdFromUrl) {
            setSteamId(steamIdFromUrl);
        }
    }, []);

    const handleClick = async (e) => {
        e.preventDefault();

        if (!validation("submit")) {
            setSuccess(false)
            return;
        }

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
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Error
                </Alert>
            </Snackbar>

        <StyledRoot>
            <Container maxWidth="sm">
                <StyledContent>
                    <Typography variant="h4" gutterBottom>
                        Sign up to Sutoga
                    </Typography>

                <Stack spacing={3}>

                    <Stack direction="row" spacing={2}>
                        <TextField sx={{width: "100%"}} name="firstName" label="First Name" onChange={(e) => setFirstName(e.target.value)}
                                   required error={feedbackList['firstName'][1]}/>

                        <TextField sx={{width: "100%"}} name="lastName" label="Last Name" onChange={(e) => setLastName(e.target.value)}
                                    required error={feedbackList['lastName'][1]}/>
                    </Stack>

                    <TextField name="username" label="Username" onChange={(e) => setUserName(e.target.value)}
                               required error={feedbackList['username'][1]}
                               />

                    <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)}
                               required error={feedbackList['email'][1]}
                               />

                    <TextField
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPwd(e.target.value)}
                        required error={feedbackList['pwd'][1]}
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

                    <Stack direction="row" spacing={2}>
                        <TextField
                            id="date"
                            label="Birthday"
                            type="date"
                            defaultValue="2000-01-01"
                            sx={{ width: 250 }}
                            required error={feedbackList['birthDate'][1]}
                            onChange={(e) => setBirthDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <Box sx={{ flexGrow: 1 }} />

                        <PhoneInput
                            country={"tr"}
                            inputStyle={{ borderRadius: "13px", height: "100%", width: "100%" }}
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