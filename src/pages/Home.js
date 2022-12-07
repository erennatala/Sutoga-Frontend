import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import React, {useState, useEffect} from "react";
// @mui
import { useTheme } from '@mui/material/styles';
import {Grid, Container, Typography, Card, CardHeader, Box} from '@mui/material';
// components
import Iconify from '../components/iconify';
import PostCard from "../components/cards/PostCard";
import FriendRecCard from "../components/cards/FriendRecCard";

export default function Home() {
    const theme = useTheme();

    const [friendRec, setFriendRec] = useState([]) // TODO 3 veya 5 elemanlı user objeleri

    const data = [0,0,0,0,0,0,0,0,0,0,0,0,0];

    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        console.log(windowSize.innerHeight)
    }, [])

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    function getWindowSize() {
        const {innerWidth, innerHeight} = window;
        return {innerWidth, innerHeight};
    }

    return(
        <>
            <Helmet>
                <title> Home </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Good morning Kerem!
                </Typography>
            </Container>



                <Grid container spacing={12} columns={12}>
                    <Grid item xs={8}>
                        {data.map((card) =>
                            <PostCard />
                        )}
                    </Grid>
                    <Grid item xs={4}>
                        <FriendRecCard />
                    </Grid>
                </Grid>
        </>
    );
}