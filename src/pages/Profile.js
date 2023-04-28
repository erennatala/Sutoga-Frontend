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
import {useDispatch, useSelector} from "react-redux";
import PostCard from "../components/cards/PostCard";
import {TabPanelProps} from "@mui/lab";
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
    const [toastOpen, setToastOpen] = useState(false);
    const [tab, setTab] = useState(0);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const username = await window.electron.ipcRenderer.invoke('getUsername');
                setUsername(username);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);



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

                <Grid container columns={16}>
                    <Grid xs={16}>
                        <Card sx={{height: "300px"}}>
                            <CardContent>
                                <Stack direction="row" spacing={8}>
                                    <Grid>
                                        <Avatar src="" alt="photoURL" sx={{ minWidth: 250, minHeight: 250 }}/>
                                    </Grid>

                                    <Grid direction="column" sx={{paddingY: 6}} xs={6}>
                                        <Typography variant="h3" sx={{fontWeight: "bold"}} gutterBottom>
                                            {username}
                                        </Typography>

                                        <Typography flexWrap variant="h7" gutterBottom>
                                            CS oynamayanlar eklemesin xxxxxxagkjadkşgjaşkdgajagjdakgjkal
                                        </Typography>
                                    </Grid>

                                    <Grid container direction="column" sx={{pl: 7, py: 6}}>


                                        <Grid item sx={{mt: 1}}>
                                            <Stack direction={"row"}>
                                                <Typography fontWeight={"bold"} fontSize={22}>
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
                                                <Typography fontWeight={"bold"} fontSize={22}>
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
                                                <Typography fontWeight={"bold"} fontSize={22}>
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

                                    <Grid item xs={3} alignItems="center" justifyContent="center" sx={{py: 6}}>
                                        <Button variant="contained" color="primary" sx={{height: 50, mb: 2, mt: 2}}>
                                            Edit profile
                                        </Button>

                                        <Box sx={{ flexGrow: 1 }} />

                                        <Button variant="contained" color="primary" sx={{height: 50}}>
                                            Account settings
                                        </Button>
                                    </Grid>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>

                <Grid container columns={16}>
                    <Grid xs={16}>
                        <Card sx={{mt: 1}}>
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs" centered>
                                        <Tab label="Posts" {...a11yProps(0)} />
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
                                    <Grid container justifyContent={"center"}>
                                        <Grid item>
                                            <GameCard publisher={"Snowbird Games"} title={"Eador: Genesis"} img={"https://cdn.akamai.steamstatic.com/steam/apps/235660/header.jpg?t=1563274911"}/>
                                        </Grid>
                                        <Grid item>
                                            <GameCard publisher={"Snowbird Games"} title={"Eador: Genesis"} img={"https://cdn.akamai.steamstatic.com/steam/apps/235660/header.jpg?t=1563274911"}/>
                                        </Grid>
                                        <Grid item>
                                            <GameCard publisher={"Snowbird Games"} title={"Eador: Genesis"} img={"https://cdn.akamai.steamstatic.com/steam/apps/235660/header.jpg?t=1563274911"}/>
                                        </Grid>

                                        <Grid item>
                                            <GameCard publisher={"Snowbird Games"} title={"Eador: Genesis"} img={"https://cdn.akamai.steamstatic.com/steam/apps/235660/header.jpg?t=1563274911"}/>
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={tab-2} index={2}>
                                    <Grid container columns={16}>
                                        <Grid spacing={2} xs={16}>
                                            <PostCard img="https://wallpapers.com/images/file/spider-man-action-adventure-1080p-gaming-6psueyj01802y9f1.jpg" />
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
        </>
    );
}