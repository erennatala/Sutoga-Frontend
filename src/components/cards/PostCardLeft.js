import {
    Avatar,
    Box, Button,
    ButtonBase,
    ButtonGroup,
    Card,
    Container, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, FormControl, FormControlLabel,
    Grid, IconButton,
    Link, Menu, MenuItem, Radio, RadioGroup,
    Stack, TextField,
    Typography
} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Iconify from "../iconify";
import { format, isValid } from 'date-fns';
import CommentCard from "./CommentCard";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingRow from '../../components/loading/LoadingRow';
import ProfileCardSm from "./ProfileCardSm";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2),
}));

const BASE_URL = process.env.REACT_APP_URL

export default function PostCardLeft(props) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [reportOpen, setReportOpen] = useState(false);
    const [reportOption, setReportOption] = useState('');
    const [reportText, setReportText] = useState('');
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(props.post.likedByUser);
    const [likeCount, setLikeCount] = useState(props.post.likeCount)
    const [commentCount, setCommentCount] = useState(props.post.commentCount)

    const [loadingLikes, setLoadingLikes] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);

    const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
    const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);

    const [loggedInId, setLoggedInId] = useState(null)
    const [likes, setLikes] = useState([])

    const formattedDate = format(new Date(props.post.postDate), 'dd MMMM yyyy HH:mm');

    useEffect(() => {
        const fetchUserId = async () => {
            const userId = await window.electron.ipcRenderer.invoke('getId');
            setLoggedInId(userId);
        }

        fetchUserId();
    }, []);

    const fetchComments = useCallback(
        async (page) => {
            const source = axios.CancelToken.source();
            setLoading(true);

            try {
                const token = await window.electron.ipcRenderer.invoke('getToken');
                const response = await axios.get(`${BASE_URL}comments/post/${props.post.id}?page=${page}&size=10`, {
                    headers: {
                        Authorization: token
                    },
                    cancelToken: source.token,  // Passing cancel token
                });

                if(response.data.content.length === 0){
                    setHasMore(false);
                }

                setComments(prevComments => [...prevComments, ...response.data.content]);
                setPageNumber(prevPageNumber => prevPageNumber + 1);
                setLoading(false);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("cancelled");
                } else {
                    console.log(error);
                }
            }

            // Cancel function to be used by InfiniteScroll
            return () => source.cancel();
        }, []
    );

    const getLikers = async () => {
        setLoadingLikes(true)
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const response = await axios.get(`${BASE_URL}likes/getLikersByPostId/${props.post.id}/${userId}`, {
                headers: {
                    Authorization: token
                }
            });

            setLikes(response.data)
            setLoadingLikes(false)
        } catch (e) {
            console.log(e)
        }
    }

    const handleOpenLikedModal = () => {
        getLikers()
        setIsLikedModalOpen(true);
    };

    const handleCloseLikedModal = () => {
        setIsLikedModalOpen(false);
    };

    const handleRemovePost = () => {
        handleMenuClose();
        setRemoveDialogOpen(true);
    };

    const handleRemoveConfirm = () => {
        handleRemovePostConfirmed()
        setRemoveDialogOpen(false);
    };

    const handleRemoveCancel = () => {
        setRemoveDialogOpen(false);
    };

    const handleLike = async () => {
        if (liked) {
            try {
                const token = await window.electron.ipcRenderer.invoke('getToken');
                const userId = await window.electron.ipcRenderer.invoke('getId');

                await axios.delete(`${BASE_URL}likes/post/${props.post.id}/user/${userId}`, {
                    headers: { 'Authorization': `${token}` },
                });

                setLiked(false);
                props.handleLike(props.post.id, likeCount - 1);
                setLikeCount(likeCount-1)
            } catch (err) {

            }
        } else {
            try {
                const token = await window.electron.ipcRenderer.invoke('getToken');
                const id = await window.electron.ipcRenderer.invoke('getId');

                const createLikeRequest = { userId: id, postId: props.post.id };

                await axios.post(`${BASE_URL}likes`, createLikeRequest, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                setLiked(true);
                props.handleLike(props.post.id, likeCount + 1);
                setLikeCount(likeCount+1)
            } catch (err) {

            }
        }
    };


    const handleShareSubmit = () => {

    }

    const handleOpenCommentModal = () => {
        setIsCommentModalOpen(true);
        fetchComments(0)
    };

    const handleCloseCommentModal = () => {
        setIsCommentModalOpen(false);
        setCommentText('');
        setComments([])
    };

    const handleCommentTextChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleCommentSubmit = async () => {
        if (commentText.trim() === '') {
            return;
        }

        if (commentText.length > 250) {
            console.log('Comment is too long');
            return;
        }

        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const createCommentRequest = {
                postId: props.post.id,
                text: commentText,
                senderId: userId
            };

            const response = await axios.post(`${BASE_URL}comments`, createCommentRequest, {
                headers: {
                    Authorization: token
                }
            });

            const newComment = {
                id: response.data.id,
                text: response.data.text,
                profilePhotoUrl: response.data.profilePhotoUrl,
                username: response.data.username,
                userId: response.data.userId
            };

            setComments(prevComments => [...prevComments, newComment]);
            setCommentCount(prevCommentCount => prevCommentCount + 1);
            setCommentText('');
        } catch (error) {
            console.log(error);
        }
    };

    const handleShare = () => {
        setIsShareModalOpen(true);
    };

    const handleCloseShareModal = () => {
        setIsShareModalOpen(false);
    };

    const handleUserProfileClick = async () => {
        const username = await window.electron.ipcRenderer.invoke('getUsername');
        if (props.post.username === username) {
            navigate(`/profile`);
        } else {
            navigate(`/profile/${props.post.username}`);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleRemovePostConfirmed = async () => {
        const token = await window.electron.ipcRenderer.invoke('getToken');

        await axios.delete(`${BASE_URL}posts/${props.post.id}`, {
            headers: {
                Authorization: token
            }
        });
        handleMenuClose();
        props.onDelete(props.post.id);
    };

    const handleReportOpen = () => {
        setReportOpen(true);
    };

    const handleReportClose = () => {
        setReportOpen(false);
    };

    const handleReportOptionChange = (event) => {
        setReportOption(event.target.value);
    };

    const handleReportTextChange = (event) => {
        setReportText(event.target.value);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');

            const response = await axios.delete(`${BASE_URL}comments/${commentId}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 204) {
                const updatedComments = comments.filter((comment) => comment.id !== commentId);

                if (updatedComments.length === 0) {
                    setComments([]);
                } else {
                    setComments(updatedComments);
                }
                setLoading(false);
                setHasMore(false)
                setCommentCount(commentCount-1)
            } else {
                console.error('Failed to delete comment:', response.data);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return(
        <>
            <Dialog open={isLikedModalOpen} onClose={handleCloseLikedModal} fullWidth
                    maxWidth="sm">
                <DialogTitle>Liked By</DialogTitle>
                <DialogContent>
                    {loadingLikes ? (
                        <LoadingRow />
                    ) : likes.length === 0 ? (
                        <Typography>No likes yet</Typography>
                    ) : (
                        likes.map((liker) => (
                            <>
                                <ProfileCardSm
                                    key={liker.id}
                                    username={liker.username}
                                    profilePhotoUrl={liker.profilePhotoUrl}
                                    isFriend={liker.isFriend || liker.id === loggedInId}
                                />
                                <Divider variant={"fullWidth"} />
                            </>
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseLikedModal}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isCommentModalOpen} onClose={handleCloseCommentModal} maxWidth="md" fullWidth>
                <DialogContent>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1 }}>
                        Comments
                    </Typography>
                    <InfiniteScroll
                        dataLength={comments.length}
                        next={() => fetchComments(pageNumber)}
                        hasMore={hasMore}
                        loader={<LoadingRow />}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                    >
                        {comments.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                userId={loggedInId}
                                usersPost={props.post.usersPost}
                                onDelete={(e) => handleDeleteComment(e)}
                            />
                        ))}
                    </InfiniteScroll>
                    <TextField
                        label="Enter your comment"
                        value={commentText}
                        onChange={handleCommentTextChange}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCommentModal}>Cancel</Button>
                    <Button onClick={handleCommentSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={isShareModalOpen} onClose={handleCloseShareModal}>
                <DialogTitle>Share</DialogTitle>
                <DialogContent>
                    {/* Your friend list or share options go here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseShareModal}>Cancel</Button>
                    <Button onClick={handleShareSubmit}>Share</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={reportOpen} onClose={handleReportClose}>
                <DialogTitle>Report</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset">
                        <RadioGroup value={reportOption} onChange={handleReportOptionChange}>
                            <FormControlLabel value="spam" control={<Radio />} label="Spam" />
                            <FormControlLabel value="hate-speech" control={<Radio />} label="Hate Speech" />
                            <FormControlLabel value="harassment" control={<Radio />} label="Harassment" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        label="Additional Comments"
                        multiline
                        rows={4}
                        value={reportText}
                        onChange={handleReportTextChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReportClose}>Cancel</Button>
                    <Button>Submit</Button>
                </DialogActions>
            </Dialog>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {props.post.usersPost ? (
                    <MenuItem onClick={handleRemovePost}>Remove</MenuItem>
                ) : (<MenuItem onClick={handleReportOpen}>Report</MenuItem>)
                }

            </Menu>

            <Dialog open={isRemoveDialogOpen} onClose={handleRemoveCancel}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <p>Do you want to remove this post?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRemoveCancel} color="primary">Cancel</Button>
                    <Button onClick={handleRemoveConfirm} color="primary">Remove</Button>
                </DialogActions>
            </Dialog>

        <Container sx={{ px: 9, pt: 1, pb: 2}} spacing={2}>
            <Card>
                <Grid item container direction="column">
                    <Stack direction="row" justifyContent="space-between" onClick={(e) => e.stopPropagation()}>
                    <Box>
                        <ButtonBase onClick={handleUserProfileClick}>
                            <Link underline="none">
                                <StyledAccount>
                                    <Avatar src={props.post.photoUrl} alt="photoURL" />
                                    <Grid>
                                        <Box sx={{ ml: 2 }}>
                                            <Stack direction="row">
                                                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                                    {props.post.username}
                                                </Typography>
                                                <Typography>&nbsp;</Typography>
                                                <Typography>&nbsp;</Typography>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </StyledAccount>
                            </Link>
                        </ButtonBase>
                    </Box>

                    <Box>
                        <Grid sx={{ pl: 1, flexGrow: 0.5, mt: 2, mr: 2, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <ButtonGroup variant="text" aria-label="text button group">
                                <IconButton onClick={handleLike}>
                                    <Iconify icon={liked ? ("flat-color-icons:like") : ("icon-park-outline:like")} />
                                </IconButton>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mr: 1, mt: 1, cursor: 'pointer' }} onClick={handleOpenLikedModal}>
                                    {likeCount}
                                </Typography>
                                <IconButton onClick={handleOpenCommentModal}>
                                    <Iconify icon={"majesticons:comment-line"} />
                                </IconButton>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mr: 1, mt: 1 }}>
                                    {commentCount}
                                </Typography>
                                {/*<IconButton onClick={handleShare}>*/}
                                {/*    <Iconify icon="material-symbols:ios-share" />*/}
                                {/*</IconButton>*/}
                                <IconButton onClick={handleMenuOpen}>
                                    <Iconify icon="mdi:dots-horizontal" />
                                </IconButton>
                            </ButtonGroup>
                        </Grid>
                    </Box>
                    </Stack>

                    <Divider sx={{mb: 2 }}/>

                    <Grid item style={{ height: '100%' }}>
                        {props.post.mediaUrl ? (
                            <Box>
                                <Box sx={{ ml: 3, mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                        {props.post.description}
                                    </Typography>
                                </Box>

                                <Grid container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                                    <Box justifyContent="center" alignItems="center">
                                        {props.post.mediaUrl.endsWith('.mp4') ||
                                        props.post.mediaUrl.endsWith('.mov') ||
                                        props.post.mediaUrl.endsWith('.avi') ? (
                                            <video
                                                style={{
                                                    marginLeft: '2px',
                                                    marginBottom: '2px',
                                                    borderRadius: '2px',
                                                    width: '100%',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                }}
                                                controls
                                            >
                                                <source src={props.post.mediaUrl} type="video/mp4" />
                                            </video>
                                        ) : (
                                            <img
                                                src={props.post.mediaUrl}
                                                style={{
                                                    marginLeft: '2px',
                                                    marginBottom: '2px',
                                                    borderRadius: '2px',
                                                    width: '100%',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                }}
                                                alt="x"
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            </Box>
                        ) : (
                            <Typography variant={props.img ? 'subtitle2' : 'h6'} sx={{ color: 'text.primary', ml: 2, mb: 2 }}>
                                {props.post.description}
                            </Typography>
                        )}
                    </Grid>

                    <Divider/>

                    <Grid item onClick={(e) => e.stopPropagation()}>
                        <Typography sx={{ color: 'text.primary', ml: 2, py: 1, fontSize: 14 }} variant="subtitle1">
                            {formattedDate}
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
            <Divider sx={{ pt: 3 }} />
        </Container>
        </>
    )
}