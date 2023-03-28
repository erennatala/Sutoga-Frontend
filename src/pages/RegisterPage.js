import { Helmet } from 'react-helmet-async';

import { styled } from '@mui/material/styles';
import {
    Link,
    Container,
    Typography,
    Divider,
    Stack,
    Button,
    TextField,
    InputAdornment,
    IconButton, Checkbox, Select, MenuItem, Box
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {DatePicker, LoadingButton, LocalizationProvider} from "@mui/lab";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
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

    const [showPassword, setShowPassword] = useState(false);

    const [steamId, setSteamId] = useState();

    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [pwd, setPwd] = useState();
    const [birthDate, setBirthDate] = useState();
    const [gender, setGender] = useState();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const steamIdFromUrl = urlParams.get('steamid');
        if (steamIdFromUrl) {
            setSteamId(steamIdFromUrl);
        }
    }, []);

    const handleClick = () => {
        navigate('/home', { replace: true });
    }

    return(
        <>
        <Helmet>
            <title> Register | Sutoga </title>
        </Helmet>

        <StyledRoot>
            <Container maxWidth="sm">
                <StyledContent>
                    <Typography variant="h4" gutterBottom>
                        Sign up to Sutoga
                    </Typography>

                <Stack spacing={3}>
                    <TextField name="username" label="Username" />

                    <TextField name="email" label="Email address" />

                    <TextField
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
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
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <Box sx={{ flexGrow: 1 }} />

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={""}
                            label="Gender"
                            onChange={(e) => setGender(e.target.value)}
                            sx={{ width: 250}}
                        >
                            <MenuItem value={"Female"}>Female</MenuItem>
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Other"}>Other</MenuItem>
                        </Select>
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