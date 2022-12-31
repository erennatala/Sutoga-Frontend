import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import React, {useState, useEffect} from "react";
// @mui
import {alpha, useTheme} from '@mui/material/styles';
import {Grid, Container, Typography, Card, CardHeader, Box, Stack, Button} from '@mui/material';
// components
import Iconify from '../components/iconify';
import PostCard from "../components/cards/PostCard";
import FriendRecCard from "../components/cards/FriendRecCard";

export default function Home() {
    const theme = useTheme();

    const [friendRec, setFriendRec] = useState([]) // TODO 3 veya 5 elemanlı user objeleri

    const data = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    const friendData = [0,0,0]

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

                <Grid container columns={16}>
                    <Grid spacing={2} xs={11}>
                        {data.map((card) =>
                            <PostCard />
                        )}
                    </Grid>
                    <Grid xs={4}>
                        <Container columns={4} xs={4} sx={{position: "fixed", height: "400px"}}>
                            <Grid xs={4} sx={{backgroundColor: alpha(theme.palette.grey[500], 0.12), borderRadius: Number(theme.shape.borderRadius) * 1.5}}>
                                {friendData.map((card) => <FriendRecCard />)}
                            </Grid>
                            <Button variant="text">See more like this</Button>
                        </Container>
                    </Grid>
                </Grid>
        </>
    );
}