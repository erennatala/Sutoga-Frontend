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
import {useLocation} from "react-router-dom";


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
    const location = useLocation();

    const avatarSize = windowSize[0] < 1600 ? 200 : 250;
    const usernameFontSize = isSmallScreen ? '0.9rem' : '1.5rem';

    const [isLoading, setIsLoading] = useState(true);
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
    const [isSent, setIsSent] = useState(false);

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

    const [loadingFriendRequest, setLoadingFriendRequest] = useState(true);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [loadingDeclineRequest, setLoadingDeclineRequest] = useState(false);

    const [isHovered, setIsHovered] = useState(false);

    const [friends, setFriends] = useState([])

    useEffect(() => {
        switch (tab) {
            case 0:
                setLikes([])
                if (posts.length === 0) {
                    setHasMore(true);
                    setPage(0);
                    loadMorePosts();
                }
                break;
            case 2:
                setLikes([])
                if (games.length === 0) {
                    setGamePage(0);
                    setHasMoreGames(true)
                    loadMoreGames();
                }
                break;
            case 4:
                setLikePage(0);
                setHasMoreLikes(true)
                loadMoreLikes();
                break;
            case 6:
                setLikes([])
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
            if (!user) {
                setCheckingFriendship(false);
                return;
            }

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
        if (loadingLike || !hasMoreLikes) {
            return;
        }

        setLoadingLike(true);

        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = user.id;

            const response = await axios.get(`${BASE_URL}posts/getUserLikedPosts`, {
                params: {
                    userId: userId,
                    pageNumber: likePage,
                    pageSize: 10
                },
                headers: {
                    'Authorization': token
                }
            });

            if (response.data && Array.isArray(response.data.content)) {
                const newLikes = response.data.content;
                setLikes(prevLikes => [...prevLikes, ...newLikes]);
                setLikePage(prevPage => prevPage + 1);
                setHasMoreLikes(newLikes.length === 10);
            } else {
                setHasMoreLikes(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingLike(false);
        }
    };

    const checkFriendRequest = async (userId, accountId) => {
        try {
            setLoadingRequest(true)
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
                const { id, senderId, receiverId } = response.data;
                setFriendRequestId(id);

                if (loggedInUserId === senderId) {
                    setIsSent(true)
                    setIsSender(true);
                } else {
                    setIsSent(true)
                    setIsSender(false);
                }
            }
            setLoadingRequest(false)
            setLoadingFriendRequest(false)
        } catch (error) {
            console.error('Error checking friend request:', error);
        }
    };

    const handleRemoveFriend = async (userId, friendId) => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');

            await axios.delete(`${BASE_URL}users/${loggedInUserId}/remove/${user.id}`, {
                headers: {
                    Authorization: token,
                },
            });
            setLoadingFriendRequest(false)
            setLoadingRequest(false)
            setIsFriend(false);
            setIsSender(false);
            setFriendRequestId(null);
            setIsSent(false)
        } catch (error) {
            console.error('Error removing friend:', error);
            // Hata durumunda gerekli işlemleri yapabilirsiniz
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

                console.log(window.location.pathname)

                console.log("window.location.pathname:", window.location.pathname);
                console.log("Username Param:", usernameParam);

                const response = await axios.get(`${BASE_URL}users/getByUsername/${usernameParam}`, {
                    headers: { 'Authorization': `${token}` },
                });
                const userData = response.data;
                setUser(userData);
                getPostCount(userData.id)
                getFriendCount(userData.id)
                setLoadingUser(false);
            } catch (error) {
                console.log("Error fetching user data:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [location.pathname]);

    const getFriendCount = async (id) => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = id;

            const response = await axios.get(`${BASE_URL}users/getFriendCount/${userId}`, {
                headers: {
                    Authorization: token,
                },
            });

            setUser((prevUser) => ({
                ...prevUser,
                friendCount: response.data,
            }));
        } catch (error) {
            console.error('Error fetching friend count:', error);
        }
    };

    const handleFriendButtonHover = () => {
        setIsHovered(true);
    };

    const handleFriendButtonLeave = () => {
        setIsHovered(false);
    };

    const getPostCount = async (id) => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = id;

            const response = await axios.get(`${BASE_URL}users/getPostCount/${userId}`, {
                headers: {
                    Authorization: token,
                },
            });

            setUser((prevUser) => ({
                ...prevUser,
                postCount: response.data,
            }));
        } catch (error) {
            console.error('Error fetching post count:', error);
        }
    };

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
            setLoadingFriendRequest(true);
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const formData = new FormData();
            formData.append('senderId', userId);
            formData.append('receiverUsername', user.userName);

            const response = await axios.post(`${BASE_URL}users/sendFriendRequest`, formData, {
                headers: {
                    'Authorization': token
                }
            });
            setIsSent(true);
            setIsSender(true);
            setLoadingFriendRequest(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveSentRequest = async () => {

    }

    const handleAcceptRequest = async () => {
        try {
            setLoadingDeclineRequest(true);
            const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');
            const token = await window.electron.ipcRenderer.invoke("getToken");
            const response = await axios.post(`${BASE_URL}users/acceptFriendRequest/${friendRequestId}`,{},{
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                setIsFriend(true);
            } else {
                console.error('Failed to accept friend request.');
            }
            setLoadingDeclineRequest(false);
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleDeclineRequest = async () => {
        try {
            setLoadingDeclineRequest(true);
            const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');
            const token = await window.electron.ipcRenderer.invoke("getToken");
            const response = await axios.post(`${BASE_URL}users/declineFriendRequest/${friendRequestId}`,{}, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                setIsFriend(false);
                setIsSent(false);
            } else {
                console.error('Failed to decline friend request.');
            }
            setLoadingDeclineRequest(false);
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    useEffect(() => {
        if (user) {
            loadMorePosts();
        }
    }, [user]);

    const loadMorePosts = async () => {
        if (!user) {
            console.error('User object is null');
            return;
        }

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
            console.log(error);
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

    if (loadingUser || checkingFriendship || isLoading) {
        return(<LoadingRow />)
    }

    const handleLike = (postId, newValue) => {
        setPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, likeCount: newValue } : post));
    };

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
                                                {user.friendCount}
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
                                                {user.postCount}
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
                                        !isSent ? (
                                            <Button
                                                variant="contained"
                                                color={"primary"}
                                                onClick={handleAddFriend}
                                                sx={{ height: 50 }}
                                                disabled={loadingRequest || loadingFriendRequest}
                                            >
                                                + Add
                                            </Button>
                                        ) : (
                                            isSender ? (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    sx={{ height: 50 }}
                                                    onClick={handleRemoveSentRequest}
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
                                                        disabled={loadingDeclineRequest}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={handleDeclineRequest}
                                                        sx={{ height: 50 }}
                                                        disabled={loadingDeclineRequest}
                                                    >
                                                        Decline
                                                    </Button>
                                                </>
                                            )
                                        )
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color={isHovered ? "error" : "primary"}
                                            onClick={handleRemoveFriend}
                                            onMouseEnter={handleFriendButtonHover}
                                            onMouseLeave={handleFriendButtonLeave}
                                            sx={{ height: 50 }}
                                        >
                                            {isHovered ? "Remove" : "Friend"}
                                        </Button>
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
                                                    <PostCardLeft
                                                        key={post.id}
                                                        post={post}
                                                        isLiked={post.likedByUser}
                                                        commentCount={post.commentCount}
                                                        likeCount={post.likeCount}
                                                        handleLike={handleLike}
                                                    />
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
                            <TabPanel value={tab - 2} index={2}>
                                <Grid container columns={16} justifyContent="center">
                                    <Grid item xs={16} md={13}>
                                        <InfiniteScroll
                                            dataLength={likes.length}
                                            next={loadMoreLikes}
                                            hasMore={hasMoreLikes}
                                            loader={<LoadingRow />}
                                            endMessage={
                                                <p style={{ textAlign: 'center' }}>
                                                    <b>Yay! You have seen it all</b>
                                                </p>
                                            }
                                        >
                                            {likes.length > 0 ? (
                                                likes.map((post) => (
                                                    <PostCardLeft
                                                        key={post.id}
                                                        post={post}
                                                        isLiked={post.likedByUser}
                                                        commentCount={post.commentCount}
                                                        likeCount={post.likeCount}
                                                        handleLike={handleLike}
                                                    />
                                                ))
                                            ) : (
                                                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                                                    Looks like there are no liked posts yet. Stay tuned!
                                                </p>
                                            )}
                                        </InfiniteScroll>
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