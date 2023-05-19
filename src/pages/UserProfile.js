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
    Tabs, Tab, DialogTitle, Dialog, DialogActions, DialogContent, TextField
} from '@mui/material';
// components
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

export default function UserProfile() {
    const theme = useTheme();
    const [toastOpen, setToastOpen] = useState(false);
    const [tab, setTab] = useState(0);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [windowSize, setWindowSize] = useState([0, 0]);

    const avatarSize = windowSize[0] < 1600 ? 200 : 250;
    const usernameFontSize = isSmallScreen ? '0.9rem' : '1.5rem';

    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState([]);

    const [user, setUser] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const [isSender, setIsSender] = useState(false);
    const [friendRequestId, setFriendRequestId] = useState(false);
    const [checkingFriendship, setCheckingFriendship] = useState(true);

    const [friendPage, setFriendPage] = useState(0)
    const [loadingFriend, setLoadingFriend] = useState(false)
    const [hasMoreFriends, setHasMoreFriends] = useState(true);

    const [games, setGames] = useState([])
    const [gamePage, setGamePage] = useState(0)
    const [loadingGame, setLoadingGame] = useState(false)
    const [hasMoreGames, setHasMoreGames] = useState(true);

    const [likes, setLikes] = useState([])
    const [likePage, setLikePage] = useState(0)
    const [loadingLike, setLoadingLike] = useState(false)
    const [hasMoreLikes, setHasMoreLikes] = useState(true);

    const [friends, setFriends] = useState([])

    useEffect(() => {
        switch (tab) {
            case 0:
                if (posts.length === 0) {
                    setHasMore(true);
                    setPage(0);
                    loadMorePosts();
                }
                break;
            case 2:
                if (games.length === 0) {
                    setGamePage(0);
                    loadMoreGames();
                }
                break;
            case 4:
                if (likes.length === 0) {
                    setLikePage(0);
                    loadMoreLikes();
                }
                break;
            case 6:
                if (friends.length === 0) {
                    setHasMoreFriends(true);
                    setFriendPage(0);
                    getFriends();
                }
                break;
        }
    }, [tab]);

    useEffect(() => {
        const checkFriendshipStatus = async () => {
            try {
                const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');
                const token = await window.electron.ipcRenderer.invoke('getToken');
                const response = await axios.get(`${BASE_URL}users/areFriends`, {
                    params: {
                        userId1: loggedInUserId,
                        userId2: user.id,
                    },
                    headers: {
                        Authorization: token,
                    },
                });

                const areFriends = response.data;
                setIsFriend(areFriends);

                if (!areFriends) {
                    checkFriendRequest(loggedInUserId, user.id);
                }
            } catch (error) {
                console.error('Error checking friendship status:', error);
            } finally {
                setCheckingFriendship(false);
            }
        };

        checkFriendshipStatus();
    }, [user]);

    const loadMoreGames = async () => {

    }

    const loadMoreLikes = async () => {

    }

    const checkFriendRequest = async (userId, accountId) => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');

            const response = await axios.post(
                `${BASE_URL}users/checkFriendRequest?userId=${userId}&accountId=${accountId}`,
                {},
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );

            if (response.data) {
                const { requestId, senderId, receiverId } = response.data;
                setFriendRequestId(requestId);

                if (loggedInUserId === senderId) {
                    setIsSender(true);
                }
            }
        } catch (error) {
            console.error('Error checking friend request:', error);
        }
    };

    useEffect(() => {
        if (friends.length && friends.length % 10 !== 0) {
            setHasMoreFriends(false);
        }
    }, [friends]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await window.electron.ipcRenderer.invoke("getToken");
                const usernameParam = window.location.pathname.split("/")[2];
                const response = await axios.get(`${BASE_URL}users/getByUsername/${usernameParam}`, {
                    headers: { 'Authorization': `${token}` },
                });
                const userData = response.data;
                setUser(userData);
            } catch (error) {
                console.log("Error fetching user data:", error);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, []);

    const getFriends = async () => {
        if (loadingFriend) return;

        setLoadingFriend(true);

        const token = await window.electron.ipcRenderer.invoke('getToken');
        const userId = await window.electron.ipcRenderer.invoke('getId');

        try {
            const response = await axios.get(`${BASE_URL}users/getFriendsByUsername`, {
                params: { username: user.userName, userId: userId, page: friendPage, size: 10 },
                headers: { 'Authorization': `${token}` },
            });

            const newFriends = response.data;
            setFriends(prevFriends => [...prevFriends, ...newFriends]);
            setFriendPage(prevPage => prevPage + 1);

            if (newFriends.length === 0) {
                setHasMoreFriends(false);
            }
        } catch (error) {
            console.log("Error fetching friends data:", error);
        } finally {
            setLoadingFriend(false);
        }
    }

    const handleAddFriend = async () => {
        try {
            const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');
            const token = await window.electron.ipcRenderer.invoke("getToken");
            const response = await axios.post(`${BASE_URL}users/sendFriendRequest`, {
                senderId: loggedInUserId,
                receiverUsername: user.username,
            }, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.data) {
                setIsFriend(true);
                setIsSender(true);
            } else {
                console.error('Failed to send friend request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleAcceptRequest = async () => {
        try {
            const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');
            const token = await window.electron.ipcRenderer.invoke("getToken");
            const response = await axios.post(`${BASE_URL}users/acceptFriendRequest/${friendRequestId}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                setIsFriend(true);
            } else {
                console.error('Failed to accept friend request.');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleDeclineRequest = async () => {
        try {
            const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');
            const token = await window.electron.ipcRenderer.invoke("getToken");
            const response = await axios.post(`${BASE_URL}users/declineFriendRequest/${friendRequestId}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                setIsFriend(false);
            } else {
                console.error('Failed to decline friend request.');
            }
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    const loadMorePosts = async () => {
        if (loadingPosts) return;

        setLoadingPosts(true);

        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = user.id;

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
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingPosts(false);
        }
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
            const size = await window.electron.ipcRenderer.invoke('get-window-size');
            setWindowSize(size);
        })();
    }, []);

    const handleTabChange = (event, newValue) => {
        if (tab !== newValue) {
            setTab(newValue);
        }
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastOpen(false);
    };

    if (loadingUser || checkingFriendship) {
        return(<LoadingRow />)
    }

    return(
        <>
            <Helmet>
                <title> {user.userName} </title>
            </Helmet>

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
                                    <Avatar src={user.profilePhotoUrl} alt="photoURL" sx={{ minWidth: avatarSize, minHeight: avatarSize }}/>
                                </Grid>

                                <Grid direction="column" sx={{paddingY: 6}} xs={6}>
                                    <Typography variant="h3" sx={{fontWeight: "bold", fontSize: usernameFontSize}} gutterBottom>
                                        {user.userName}
                                    </Typography>

                                    <Typography flexWrap variant="h7" gutterBottom>
                                        {user.profileDescription}
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
                                    {!isFriend ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddFriend}
                                            sx={{ height: 50 }}
                                        >
                                            + Add
                                        </Button>
                                    ) : (
                                        <>
                                            {isSender ? (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    disabled
                                                    sx={{ height: 50 }}
                                                >
                                                    Sent!
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        onClick={handleAcceptRequest}
                                                        sx={{ height: 50 }}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={handleDeclineRequest}
                                                        sx={{ height: 50, marginLeft: 2 }}
                                                    >
                                                        Decline
                                                    </Button>
                                                </>
                                            )}
                                        </>
                                    )}

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
                                <InfiniteScroll
                                    dataLength={friends.length}
                                    next={getFriends}
                                    hasMore={hasMoreFriends}
                                    loader={<h4><LoadingRow /></h4>}
                                    endMessage={
                                        <p style={{ textAlign: 'center' }}>
                                            <b>Yay! Small circle ;)</b>
                                        </p>
                                    }
                                >
                                    <Grid container spacing={2}>
                                        {friends.map((friend) => (
                                            <Grid key={friend.id} item xs={12} sm={6}>
                                                <ProfileCardSm username={friend.username} profilePhotoUrl={friend.profilePhotoUrl} isFriend={friend.isFriend}/>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </InfiniteScroll>
                            </TabPanel>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}