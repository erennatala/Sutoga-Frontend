import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import {Grid, Container, Typography, Card, CardHeader, Box} from '@mui/material';
// components
import Iconify from '../components/iconify';
import PostCard from "../components/cards/PostCard";
import FriendRecCard from "../components/cards/FriendRecCard";

export default function Home() {
    const theme = useTheme();

    const data = [0,0,0];

    return(
        <>
            <Helmet>
                <title> Home </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Hoşgeldin Kerem!
                </Typography>

                <Grid container spacing={2} columns={12}>
                    <Grid xs={8}>
                        <Card>
                            {data.map((card) =>
                            <PostCard />
                            )}
                        </Card>
                    </Grid>

                    <Grid xs={4}>
                        <FriendRecCard />
                    </Grid>
                </Grid>

            </Container>
        </>
    );
}