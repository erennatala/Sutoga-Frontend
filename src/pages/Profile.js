import { Helmet } from 'react-helmet-async';
import React, {useState, useEffect} from "react";
// @mui
import {alpha, useTheme} from '@mui/material/styles';
import {Alert} from "@mui/lab";
import {
    Grid,
    Container,
    Typography,
    Card,
    Box,
    CardContent,
    Avatar,
    Snackbar,
    Stack,
    Button,
    Tabs, Tab
} from '@mui/material';
// components
import { useSelector} from "react-redux";
import Iconify from '../components/iconify';
import PostCard from "../components/cards/PostCard";
import FriendRecCard from "../components/cards/FriendRecCard";
import {TabPanelProps} from "@mui/lab";
import {useNavigate} from "react-router-dom";
import GameCard from "../components/cards/GameCard";


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Profile() {
    const theme = useTheme();
    const username = useSelector((state) => state.auth.userName);
    const [toastOpen, setToastOpen] = useState(false);
    const [tab, setTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };
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
                <Grid container columns={16}>
                    <Grid xs={12}>
                        <Card sx={{height: "300px"}}>
                            <CardContent>
                                <Stack direction="row" spacing={8}>
                                    <Grid>
                                        <Avatar src="" alt="photoURL" sx={{ minWidth: 250, minHeight: 250 }}/>
                                    </Grid>

                                    <Grid direction="column" sx={{paddingY: 6}} xs={6}>
                                        <Typography variant="h3" sx={{fontWeight: "bold"}} gutterBottom>
                                            Keremmican
                                        </Typography>

                                        <Typography flexWrap variant="h7" gutterBottom>
                                            CS oynamayanlar eklemesin xxxxxxagkjadkşgjaşkdgajagjdakgjkal
                                        </Typography>
                                    </Grid>

                                    <Grid container direction="column" sx={{pl: 7, py: 6}}>


                                        <Grid item sx={{mt: 1}}>
                                            <Stack direction={"row"}>
                                                <Typography fontWeight={"bold"}>
                                                    78
                                                </Typography>

                                                <Typography>
                                                    &nbsp;
                                                </Typography>

                                                <Typography>
                                                    friends
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Box sx={{ flexGrow: 0.2 }} />

                                        <Grid item sx={{mt: 1}}>
                                            <Stack direction={"row"}>
                                                <Typography fontWeight={"bold"}>
                                                    11
                                                </Typography>

                                                <Typography>
                                                    &nbsp;
                                                </Typography>

                                                <Typography>
                                                    posts
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Box sx={{ flexGrow: 0.2 }} />

                                        <Grid item sx={{mt: 1}}>
                                            <Stack direction={"row"}>
                                                <Typography fontWeight={"bold"}>
                                                    53
                                                </Typography>

                                                <Typography>
                                                    &nbsp;
                                                </Typography>

                                                <Typography>
                                                    games
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid xs={3} alignItems="center" justifyContent="center">
                        <Button variant="contained" color="inherit">
                            Edit profile
                        </Button>
                    </Grid>
                </Grid>

                <Grid container columns={16}>
                    <Grid xs={12}>
                        <Card sx={{mt: 1}}>
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs" centered>
                                        <Tab label="Flow" {...a11yProps(0)} />
                                        <Box sx={{ flexGrow: 0.1 }} />
                                        <Tab label="Games" {...a11yProps(1)} />
                                        <Box sx={{ flexGrow: 0.1 }} />
                                        <Tab label="Likes" {...a11yProps(2)} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={tab} index={0}>
                                    <Grid container columns={16}>
                                        <Grid spacing={2} xs={16}>

                                            <PostCard img="https://i.ytimg.com/vi/WSwUSIfgA4M/maxresdefault.jpg"/>
                                            <PostCard img="https://cdn.motor1.com/images/mgl/2Np2Qp/s1/need-for-speed-unbound-gameplay-trailer.jpg" />
                                            <PostCard img="https://wallpapers.com/images/file/spider-man-action-adventure-1080p-gaming-6psueyj01802y9f1.jpg" />
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={tab-1} index={1}>
                                    <GameCard />
                                </TabPanel>
                                <TabPanel value={tab-2} index={2}>
                                    <Card>
                                        sa
                                    </Card>
                                </TabPanel>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid xs={4}>
                        <CardContent>
                            <Grid>
                                <Container columns={4} xs={4} sx={{position: "fixed", height: "400px"}}>
                                    <Grid xs={4} sx={{backgroundColor: alpha(theme.palette.grey[500], 0.12), borderRadius: Number(theme.shape.borderRadius)}}>
                                        <FriendRecCard nickname="farukkislakci" title="çaylak"/>
                                        <FriendRecCard nickname="deagleahmet" title="nişancı"/>
                                        <FriendRecCard nickname="lalenur" title="dropcu"/>
                                    </Grid>
                                    <Button variant="text">See more like this</Button>
                                </Container>
                            </Grid>
                        </CardContent>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}