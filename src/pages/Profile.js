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
    Tabs, Tab, DialogTitle, Dialog, DialogActions, DialogContent
} from '@mui/material';
// components
import {useDispatch, useSelector} from "react-redux";
import PostCard from "../components/cards/PostCard";
import {TabPanelProps} from "@mui/lab";
import GameCard from "../components/cards/GameCard";
import PostCardLeft from "../components/cards/PostCardLeft";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProfileCardSm from "../components/cards/ProfileCardSm";
import axios from "axios";
import LoadingRow from "../components/loading/LoadingRow";
import InfiniteScroll from "react-infinite-scroll-component";


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

const BASE_URL = process.env.REACT_APP_URL

export default function Profile() {
    const theme = useTheme();
    const [toastOpen, setToastOpen] = useState(false);
    const [tab, setTab] = useState(0);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [windowSize, setWindowSize] = useState([0, 0]);

    const avatarSize = windowSize[0] < 1600 ? 200 : 250;
    const usernameFontSize = isSmallScreen ? '0.9rem' : '1.5rem';
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const [openAccountSettings, setOpenAccountSettings] = useState(false);

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState([]);

    const nicknames = ["ahmet", "mehmet", "kerem", "eren", "emru"];

    useEffect(() => {
        loadMorePosts();
    }, []);

    const loadMorePosts = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const response = await axios.get(`${BASE_URL}posts/getUserPosts`, {
                params: {
                    userId: userId,
                    pageNumber: page,
                    pageSize: 10
                },
                headers: { 'Authorization': `${token}` },
            });

            if (response.data && Array.isArray(response.data.content)) {
                setPosts(prevPosts => [...prevPosts, ...response.data.content]);
                setPage(prevPage => prevPage + 1);
                setHasMore(response.data.content.length > 0);
            } else {
                setHasMore(false);
            }

            console.log(response.data.content)

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccountSettingsOpen = () => {
        setOpenAccountSettings(true);
    };

    const handleAccountSettingsClose = () => {
        setOpenAccountSettings(false);
    };

    const handleEditProfileOpen = () => {
        setOpenEditProfile(true);
    };

    const handleEditProfileClose = () => {
        setOpenEditProfile(false);
    };

    useEffect(() => {
        const resizeListener = (event, size) => setWindowSize(size);

        window.electron.ipcRenderer.on('window-resize', resizeListener);

        return () => {
            window.electron.ipcRenderer.removeListener('window-resize', resizeListener);
        };
    }, []);


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

    useEffect(() => {
        (async () => {
            const size = await window.electron.ipcRenderer.invoke('get-window-size');
            setWindowSize(size);
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

            <Dialog open={openEditProfile} onClose={handleEditProfileClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    {/* Your form fields for editing the profile go here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditProfileClose}>Cancel</Button>
                    <Button>Save Changes</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAccountSettings} onClose={handleAccountSettingsClose}>
                <DialogTitle>Account Settings</DialogTitle>
                <DialogContent>
                    {/* Your form fields for account settings go here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAccountSettingsClose}>Cancel</Button>
                    <Button>Save Changes</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={toastOpen} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    This is a success message!
                </Alert>
            </Snackbar>

                <Grid container columns={16} sx={{px: 7}}>
                    <Grid xs={16}>
                        <Card sx={{height: "300px"}}>
                            <CardContent>
                                <Stack direction="row" spacing={8}>
                                    <Grid>
                                        <Avatar src="" alt="photoURL" sx={{ minWidth: avatarSize, minHeight: avatarSize }}/>
                                    </Grid>

                                    <Grid direction="column" sx={{paddingY: 6}} xs={6}>
                                        <Typography variant="h3" sx={{fontWeight: "bold", fontSize: usernameFontSize}} gutterBottom>
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
                                        <Button variant="contained" color="primary" sx={{height: 50, mb: 2, mt: 2}}
                                                onClick={handleEditProfileOpen}>
                                            Edit profile
                                        </Button>

                                        <Box sx={{ flexGrow: 1 }} />

                                        <Button variant="contained" color="primary" onClick={handleAccountSettingsOpen} sx={{height: 50}}>
                                            Account settings
                                        </Button>
                                    </Grid>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>

                <Grid container columns={16} sx={{px: 7}}>
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
                                        <Box sx={{ flexGrow: 0.1 }} />
                                        <Tab label="Friends" {...a11yProps(3)} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={tab} index={0}>
                                    <Grid container columns={16} justifyContent="center">
                                        <Grid item xs={16} md={13}>
                                            <InfiniteScroll
                                                dataLength={posts.length}
                                                next={loadMorePosts}
                                                hasMore={hasMore}
                                                loader={<LoadingRow />}
                                                endMessage={
                                                    <p style={{ textAlign: 'center' }}>
                                                        <b>Yay! You have seen it all</b>
                                                    </p>
                                                }
                                            >
                                                {posts.length > 0 ? (
                                                    posts.map((post, index) => (
                                                        <PostCardLeft key={index} post={post}/>
                                                    ))
                                                ) : (
                                                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                                                        Looks like there are no posts yet. Stay tuned!
                                                    </p>
                                                )}
                                            </InfiniteScroll>
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
                                    <Grid container columns={16} justifyContent="center">
                                        <Grid item xs={16} md={13}>
                                            <PostCardLeft img="https://wallpapers.com/images/file/spider-man-action-adventure-1080p-gaming-6psueyj01802y9f1.jpg" />
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={tab-3} index={3}>
                                    <Grid container spacing={2}>
                                        {nicknames.map((nickname) => (
                                            <Grid key={nickname} item xs={12} sm={6}>
                                                <ProfileCardSm nickname={nickname}/>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </TabPanel>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
        </>
    );
}