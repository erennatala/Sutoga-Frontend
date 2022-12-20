import { Helmet } from 'react-helmet-async';
import React from "react";
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import {Grid, Container, Typography, Card, CardHeader, Box} from '@mui/material';
// components
import Iconify from '../components/iconify';


export default function Profile() {
    const theme = useTheme();

    return(
        <>
            <Helmet>
                <title> Profile </title>
            </Helmet>

            <Container sx={{ mb: 3, mt: 1 }}>
                <Card sx={{height: "800px"}}>
                    <CardHeader title="profile">
                        <Box/>
                    </CardHeader>
                </Card>
            </Container>
        </>
    );
}