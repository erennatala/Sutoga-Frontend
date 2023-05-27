import React, {useEffect, useState} from 'react';
import {
    Grid,
    Box,
    Avatar,
    IconButton,
    Link,
    ButtonBase,
    Typography,
    Dialog,
    DialogTitle,
    DialogActions, Button
} from '@mui/material';
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const StyledAccount = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    width: '100%',
}));

const BASE_URL = process.env.REACT_APP_URL

export default function ProfileCardSm({ username, profilePhotoUrl, isFriend, onSuccess }) {
    const navigate = useNavigate();
    const [requestSent, setRequestSent] = useState(false);
    const [checkingFriendship, setCheckingFriendship] = useState(true)
    const [friendRequestId, setFriendRequestId] = useState(null)
    const [isSent, setIsSent] = useState(false)
    const [isSender, setIsSender] = useState(false)
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showNothing, setShowNothing] = useState(false)
    const [areFriends, setAreFriends] = useState(isFriend)
    const [isHovered, setIsHovered] = useState(false);
    const [disable, setDisable] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            const username1 = await window.electron.ipcRenderer.invoke('getUsername');
            if (username === username1) {
                setShowNothing(true)
            }
        }

        checkUser()
    }, [])

    useEffect(() => {
        const checkFriendRequest = async () => {
            try {
                const token = await window.electron.ipcRenderer.invoke('getToken');
                const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');

                const response = await axios.post(
                    `${BASE_URL}users/checkFriendRequestByUsername?userId=${loggedInUserId}&username=${username}`,
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
                        setIsSender(true);
                        setRequestSent(true)
                        setDisable(false)
                    } else {
                        setIsSent(true)
                        setIsSender(false);
                        setRequestSent(true)
                    }
                }
            } catch (error) {
                console.error('Error checking friend request:', error);
            } finally {
                setDisable(false)
            }
        };

        if (isFriend === false) {
            checkFriendRequest()
        }
    }, [])

    const handleAdd = async () => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const formData = new FormData();
            formData.append('senderId', userId);
            formData.append('receiverUsername', username);

            const response = await axios.post(`${BASE_URL}users/sendFriendRequest`, formData, {
                headers: {
                    'Authorization': token
                }
            });
            setIsSender(true)
            setRequestSent(true)
            onSuccess("add");
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemove = async () => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const response = await axios.delete(`${BASE_URL}users/${userId}/removeByUsername/${username}`, {
                headers: {
                    Authorization: token
                }
            });

            if (response.status === 200) {
                setAreFriends(false)
                onSuccess("remove");
            } else {
                console.log('Failed to remove friend');
            }
        } catch (error) {
            console.log(error);
        }

        setShowConfirmationDialog(false);
    };

    const handleSure = async () => {
        setShowConfirmationDialog(true);
    };

    const handleConfirmationDialogClose = () => {
        setShowConfirmationDialog(false);
    };

    const handleConfirmationDialogYes = () => {
        handleRemove();
    };

    const handleConfirmationDialogNo = () => {
        setShowConfirmationDialog(false);
    };

    const handleNavigate = async () => {
        const loggedinusername = await window.electron.ipcRenderer.invoke('getUsername');
        if (username === loggedinusername) {
            navigate(`/profile`, {replace: true});
        } else {
            navigate(`/profile/${username}`, {replace: true});
        }
    }

    const removeRequest = async () => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');
            const userId = await window.electron.ipcRenderer.invoke('getId');

            const response = await axios.delete(`${BASE_URL}users/${userId}/removeRequest/${username}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                setRequestSent(false);
                setIsSent(false);
                setIsSender(false);
            } else {
                console.log('Failed to remove friend request');
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleFriendButtonHover = () => {
        setIsHovered(true);
    };

    const handleFriendButtonLeave = () => {
        setIsHovered(false);
    };

    const handleAcceptRequest = async () => {
        try {
            const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');
            const token = await window.electron.ipcRenderer.invoke("getToken");
            const response = await axios.post(`${BASE_URL}users/acceptFriendRequest/${friendRequestId}`,{},{
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                setAreFriends(true);
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

            const response = await axios.post(`${BASE_URL}users/declineFriendRequest/${friendRequestId}`,{}, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                setIsSent(false);
            } else {
                console.error('Failed to decline friend request.');
            }
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    return(
        <StyledAccount>

            <Dialog open={showConfirmationDialog} onClose={handleConfirmationDialogClose}>
                <DialogTitle>Are you sure you want to remove {username}?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleConfirmationDialogNo}>No</Button>
                    <Button onClick={handleConfirmationDialogYes}>Yes</Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Avatar src={profilePhotoUrl} alt="photoURL" sx={{ width: 50, height: 50 }} />
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{ overflow: 'hidden' }} onClick={handleNavigate}>
                        <ButtonBase>
                            <Link underline="none" sx={{color: "black"}}>
                                <Typography variant="h6" component="div" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 200, mt: 1 }}> {/* Adjust nickname font size here */}
                                    {username}
                                </Typography>
                            </Link>
                        </ButtonBase>
                    </Box>
                </Grid>
                {!showNothing &&
                    (!areFriends ? (
                        <Grid item xs={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {!requestSent ? (<IconButton size="small" onClick={handleAdd} disabled={disable}>
                                    <AddIcon />
                                </IconButton>) : (
                                    isSender ? (<IconButton size="small" onClick={handleRemove}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color={isHovered ? "error" : "warning"}
                                            onClick={removeRequest}
                                            onMouseEnter={handleFriendButtonHover}
                                            onMouseLeave={handleFriendButtonLeave}
                                        >
                                            {isHovered ? "Cancel" : "Pending"}
                                        </Button>
                                    </IconButton>) : (
                                       <>
                                           <Button size="small" variant="contained" color="success" onClick={handleAcceptRequest}>Accept</Button>
                                           <Button size="small" variant="contained" color="error" onClick={handleDeclineRequest}>Decline</Button>
                                       </>
                                ))}
                            </Box>
                        </Grid>
                    ) : (
                        <Grid item xs={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton size="small" onClick={handleSure}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    ))}
            </Grid>
        </StyledAccount>
    )
}