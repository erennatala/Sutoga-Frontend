import { Helmet } from 'react-helmet-async';
import React, {useState, useEffect} from "react";
// @mui
import { useTheme } from '@mui/material/styles';
import {Alert} from "@mui/lab";
import {Grid, Container, Typography, Card, CardHeader, Box, CardContent, Avatar, Snackbar, Stack} from '@mui/material';
// components
import { useSelector} from "react-redux";
import Iconify from '../components/iconify';


export default function Profile() {
    const theme = useTheme();
    const username = useSelector((state) => state.auth.userName);
    const [toastOpen, setToastOpen] = useState(false);


    // functions

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastOpen(false);
    };

    return(
        <>
            <Helmet>
                <title> {username} </title>
            </Helmet>

            <Snackbar open={toastOpen} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    This is a success message!
                </Alert>
            </Snackbar>

            <Container sx={{ mb: 3, mt: 1 }}>
                <Card sx={{height: "300px"}}>
                    <CardContent>
                        <Stack direction="row" spacing={3}>
                            <Typography variant="h7" gutterBottom>
                                khjehvehvlefjvekjvşk
                            </Typography>

                            <Avatar src="" alt="photoURL" sx={{ width: 250, height: 250 }}/>
                        </Stack>
                    </CardContent>
                </Card>

                <Box sx={{ flexGrow: 1 }} />

                <Card>
                    <Stack direction="row" spacing={3}>
                        <CardContent>
                            <Typography variant="h7" gutterBottom>
                                khjehvehvlefjvekjvşk
                            </Typography>

                            <Avatar src="" alt="photoURL" sx={{ width: 250, height: 250 }}/>
                        </CardContent>
                    </Stack>
                </Card>
            </Container>
        </>
    );
}