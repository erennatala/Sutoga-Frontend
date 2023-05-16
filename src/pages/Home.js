import { Helmet } from 'react-helmet-async';
import React, {useState, useEffect} from "react";
// @mui
import {alpha, useTheme} from '@mui/material/styles';
import {
    Grid,
    Stack,
    TextField,
    ClickAwayListener, Collapse, InputAdornment, IconButton, Box, Card
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component'
import LoadingRow from '../components/loading/LoadingRow'
// components
import {useSelector} from "react-redux";
import axios from "axios";
import Iconify from '../components/iconify';
import PostCard from "../components/cards/PostCard";
import { LinearProgress } from '@mui/material';
import PostCardLeft from "../components/cards/PostCardLeft";

const BASE_URL = process.env.REACT_APP_URL

export default function Home() {
    const theme = useTheme();
    const userName = useSelector((state)=> state.auth.userName);
    const [friendRec, setFriendRec] = useState([{id: 1}])

    const [openCreate, setOpenCreate] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [row, setRow] = useState(1);
    const [hideLabel, setHideLabel] = useState(false);
    const [isInputOpen, setIsInputOpen] = useState(false);
    const [canSend, setCanSend] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileType, setFileType] = useState('image/jpeg');

    const [postLabel, setPostLabel] = useState("What's happening?")
    const [postText, setPostText] = useState("");

    const [windowSize, setWindowSize] = useState(getWindowSize());

    const [userId, setUserId] = useState(null)

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadMorePosts();
    }, []);

    const loadMorePosts = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const response = await axios.get(`${BASE_URL}posts/getHomePosts`, {
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
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const id = await window.electron.ipcRenderer.invoke('getId');
                setUserId(id);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.size <= 15 * 1024 * 1024) { // Limit file size to 15MB
            setSelectedFile(file);
        } else {
            alert("File size must be less than 15MB.");
        }
    };

    const openFileDialog = async () => {
        try {
            const options = {
                properties: ['openFile'],
                filters: [
                    { name: 'Media Files', extensions: ['jpg', 'png', 'gif', 'mp4', 'mov', 'avi'] },
                    { name: 'All Files', extensions: ['*'] },
                ],
            };
            const filePaths = await window.electron.ipcRenderer.invoke('open-file-dialog', options);

            if (filePaths && filePaths[0]) {
                const fileData = await window.electron.ipcRenderer.invoke('get-file-data', filePaths[0]);

                let fileType = 'image/jpeg';
                const extension = filePaths[0].split('.').pop().toLowerCase();

                if (extension === 'mp4' || extension === 'mov' || extension === 'avi') {
                    fileType = 'video/' + extension;
                }

                setFileType(fileType);

                const file = new File([new Blob([fileData])], filePaths[0].split('/').pop(), {
                    type: fileType,
                });
                setFileType(fileType);
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setMediaPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const createPost = async (postText, userId, media) => {
        try {
            const formData = new FormData();
            formData.append('description', postText);
            formData.append('userId', userId);

            if(media) {
                formData.append('media', media);
            }

            const token = await window.electron.ipcRenderer.invoke('getToken');

            const postUrl = `${BASE_URL}posts/create`;

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${token}`
                },
            };

            const response = await axios.post(postUrl, formData, config);

            setPosts(prevPosts => [response.data, ...prevPosts]);
        } catch (error) {
            console.log(error);
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        setMediaPreview(null);
    };


    const handleClickCreate = () => {
        setRow(3)
        setCollapse(false)
        setCollapse(true)
        setOpenCreate(true);
        setIsInputOpen(true)
    };

    const handleClickAway = () => {
        setRow(1)
        setOpenCreate(false);
        setCollapse(true);
        setCollapse(false);
        setIsInputOpen(false);
    };

    const handleWrite = (e) => {
        if (e !== "") {
            setPostLabel("")
            setCanSend(true)
        } else {
            setPostLabel("What's happening?")
            setCanSend(false)
        }
    }

    const handlePostDelete = (postId) => {
        setPosts(posts.filter((post) => post.id !== postId));
    };

    const handlePost = () => {
        simulateUpload();
        createPost(postText, userId, selectedFile);
    };

    const simulateUpload = () => {
        let progress = 0;
        setUploadProgress(progress);

        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                setUploadProgress(null);
            }
        }, 500);
    };

    return(
        <>
            <Helmet>
                <title> Home </title>
            </Helmet>

            <Grid container columns={16} direction="column">
                <Stack direction="column" justifyContent={"center"}>
                    <Grid container xs={12} alignItems="center"
                          justifyContent="center">
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <Grid item sx={{pb: 1}}>
                                <Collapse in={collapse} collapsedSize={100}>
                                    <Box display="flex" alignItems="center">
                                    <TextField
                                        InputLabelProps={{
                                            shrink: false,
                                            style: {
                                                fontSize: "1.15rem",
                                                fontWeight: 500,
                                                marginLeft: "22px",
                                                marginTop: "13px"
                                            },
                                        }}
                                        inputProps={{maxLength: 250}}
                                        hiddenLabel={hideLabel}
                                        name="create_field"
                                        label={postLabel}
                                        onClick={handleClickCreate}
                                        sx={{
                                            ...{
                                                borderRadius: "1.5rem",
                                                backgroundColor: alpha("#e8d5b7", 0.1),
                                                minWidth: 800
                                            },
                                            "& .MuiInputBase-root": {
                                                borderRadius: "1.5rem",
                                            },
                                            "& .MuiInputBase-input": {
                                                paddingTop: theme.spacing(2),
                                                paddingBottom: theme.spacing(2),
                                                paddingLeft: theme.spacing(3),
                                                paddingRight: theme.spacing(3),
                                                fontSize: "1.1rem",
                                                fontWeight: 400,
                                            },
                                        }}
                                        multiline focused={false} rows={row} fullWidth
                                        onChange={(e) => {
                                            setPostText(e.target.value)
                                            handleWrite(e.target.value)
                                        }}
                                        // In TextField's InputProps
                                        InputProps={{
                                            endAdornment: (
                                                <>
                                                    {isInputOpen ? (
                                                        <Stack direction="row">
                                                            <Grid>
                                                                {mediaPreview && (
                                                                    <Box mr={1}>
                                                                        {fileType.startsWith('image/') ? (
                                                                            <img
                                                                                src={mediaPreview}
                                                                                alt="Media preview"
                                                                                style={{ maxWidth: '100px', maxHeight: '100px', pt: 4 }}
                                                                            />
                                                                        ) : (
                                                                            <video
                                                                                src={mediaPreview}
                                                                                alt="Media preview"
                                                                                style={{ maxWidth: '100px', maxHeight: '100px', pt: 4 }}
                                                                                controls
                                                                            />
                                                                        )}
                                                                        {uploadProgress > 0 && uploadProgress < 100 && (
                                                                            <div>
                                                                                <LinearProgress variant="determinate" value={uploadProgress} />
                                                                            </div>
                                                                        )}
                                                                    </Box>
                                                                )}
                                                            </Grid>
                                                            <Grid container xs={1} direction={"column"}>
                                                                <IconButton edge="end" color="black" onClick={openFileDialog}>
                                                                    <Iconify icon={"material-symbols:broken-image-outline"} />
                                                                </IconButton>
                                                                {selectedFile && (
                                                                    <IconButton edge="end" color="black" onClick={removeSelectedFile}>
                                                                        <Iconify icon={"material-symbols:close"} />
                                                                    </IconButton>
                                                                )}
                                                                <IconButton edge="end" color={canSend ? ("primary") : ("black")} disabled={!canSend} onClick={handlePost}>
                                                                    <Iconify icon={canSend ? ("material-symbols:arrow-circle-right") : ("material-symbols:arrow-circle-right-outline")} />
                                                                </IconButton>
                                                            </Grid>
                                                        </Stack>
                                                    ) : (
                                                        <InputAdornment position={"end"}>
                                                            <IconButton edge="end" color="black" onClick={openFileDialog}>
                                                                <Iconify icon={"material-symbols:broken-image-outline"} />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )}
                                                </>
                                            ),
                                        }}
                                    >
                                        {uploadProgress !== null && (
                                            <LinearProgress
                                                variant="determinate"
                                                value={uploadProgress}
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                }}
                                            />
                                        )}
                                    </TextField>
                                    </Box>
                                </Collapse>
                            </Grid>
                        </ClickAwayListener>
                    </Grid>

                    <Grid item spacing={2} sx={{px: 15}}>
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
                                    <PostCardLeft key={index} post={post} fileType={fileType} onDelete={handlePostDelete} />
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    Looks like there are no posts yet. Stay tuned!
                                </p>
                            )}
                        </InfiniteScroll>
                    </Grid>
                </Stack>
            </Grid>
        </>
    );
}