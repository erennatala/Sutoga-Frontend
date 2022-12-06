import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';

export default function Profile() {
    const theme = useTheme();

    return(
        <>
            <Helmet>
                <title> Profile </title>
            </Helmet>
        </>
    );
}