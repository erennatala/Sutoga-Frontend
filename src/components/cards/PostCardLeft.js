import {
    Avatar,
    Box, Button,
    ButtonBase,
    ButtonGroup,
    Card,
    Container, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, FormControl, FormControlLabel,
    Grid, IconButton,
    Link, List, Menu, MenuItem, Radio, RadioGroup,
    Stack, TextField,
    Typography
} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Iconify from "../iconify";
import { format } from 'date-fns';
import CommentCard from "./CommentCard";
import axios from "axios";

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
    const [comments, setComments] = useState([
        { nickname: "JohnDoe", comment: "Great post!" },
        { nickname: "JaneSmith", comment: "I love it!" },
        { nickname: "SamJones", comment: "Amazing work!" },
    ]);
    const [liked, setLiked] = useState(props.post.likedByUser);
    const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);

    const formattedDate = format(new Date(props.post.postDate), 'dd MMMM yyyy HH:mm');

    const handleOpenLikedModal = () => {
        setIsLikedModalOpen(true);
    };

    const handleCloseLikedModal = () => {
        setIsLikedModalOpen(false);
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
                props.post.likeCount -= 1;
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
                props.post.likeCount += 1;
            } catch (err) {

            }
        }
    };


    const handleShareSubmit = () => {

    }

    const handleOpenCommentModal = () => {
        setIsCommentModalOpen(true);
    };

    const handleCloseCommentModal = () => {
        setIsCommentModalOpen(false);
        setCommentText('');
    };

    const handleCommentTextChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleCommentSubmit = () => {
        console.log('Comment submitted:', commentText);
    };

    const handleShare = () => {
        setIsShareModalOpen(true);
    };

    const handleCloseShareModal = () => {
        setIsShareModalOpen(false);
    };

    const handleUserProfileClick = () => {
        navigate(`/userprofile/${props.post.userId}`);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleRemovePost = async () => {
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

    return(
        <>
            <Dialog open={isLikedModalOpen} onClose={handleCloseLikedModal}>
                <DialogTitle>Liked By</DialogTitle>
                <DialogContent>
                    {/* Display the list of users who liked the post */}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseLikedModal}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isCommentModalOpen} onClose={handleCloseCommentModal} maxWidth="md" fullWidth>
                <DialogContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src="" alt="photoURL" />
                        <Typography variant="subtitle2" sx={{ ml: 2, color: 'text.primary' }}>
                            {props.post.username}
                        </Typography>
                    </Box>
                    <Box sx={{ ml: 3, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                            {props.post.description}
                        </Typography>
                    </Box>
                    <Box>
                        {props.post.mediaUrl && (
                            <Box sx={{ mb: 2 }}>
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
                                        alt="Post Media"
                                    />
                                )}
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Divider />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1 }}>
                        Comments
                    </Typography>
                    {comments.map((comment, index) => (
                        <CommentCard
                            key={index}
                            nickname={comment.nickname}
                            comment={comment.comment}
                        />
                    ))}
                    <TextField
                        label="Enter your comment"
                        value={commentText}
                        onChange={handleCommentTextChange}
                        fullWidth
                        multiline
                        rows={4}
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
                {props.post.usersPost && (
                    <MenuItem onClick={handleRemovePost}>Remove</MenuItem>
                )}
                <MenuItem onClick={handleReportOpen}>Report</MenuItem>
            </Menu>

        <Container sx={{ px: 9, pt: 1, pb: 2}} spacing={2}>
            <Card>
                <Grid item container direction="column">
                    <Stack direction="row" justifyContent="space-between" onClick={(e) => e.stopPropagation()}>
                    <Box>
                        <ButtonBase onClick={handleUserProfileClick}>
                            <Link underline="none">
                                <StyledAccount>
                                    <Avatar src="" alt="photoURL" />
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
                                    {props.post.likeCount}
                                </Typography>
                                <IconButton onClick={handleOpenCommentModal}>
                                    <Iconify icon={"majesticons:comment-line"} />
                                </IconButton>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mr: 1, mt: 1 }}>
                                    {props.post.commentCount}
                                </Typography>
                                <IconButton onClick={handleShare}>
                                    <Iconify icon="material-symbols:ios-share" />
                                </IconButton>
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
                                <Box>
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
                                                width: '96%',
                                                height: 'auto',
                                                objectFit: 'cover',
                                            }}
                                            alt="x"
                                        />
                                    )}
                                </Box>
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