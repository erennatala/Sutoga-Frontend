import React, {useEffect, useState} from 'react';
import {Grid, Box, Avatar, IconButton, Link, ButtonBase, Typography, Dialog} from '@mui/material';
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

    useEffect(() => {
        const checkFriendRequest = async () => {
            try {
                const token = await window.electron.ipcRenderer.invoke('getToken');
                const loggedInUserId = await window.electron.ipcRenderer.invoke('getId');

                const response = await axios.post(
                    `${BASE_URL}users/checkFriendRequestByUsername?userId=${userId}&username=${username}`,
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
            } catch (error) {
                console.error('Error checking friend request:', error);
            }
        };

        checkFriendRequest()
    }, [isFriend === false])

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
            setRequestSent(true)
            onSuccess();
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemove = async () => {
        try {

        } catch (error) {
            console.log(error);
        }
    }

    const handleSure = async () => {

    }

    const handleNavigate = async () => {
        const loggedinusername = await window.electron.ipcRenderer.invoke('getUsername');
        if (username === loggedinusername) {
            navigate(`/profile`, {replace: true});
        } else {
            navigate(`/profile/${username}`, {replace: true});
        }
    }

    return(
        <StyledAccount>

            <Dialog open={showConfirmationDialog}>

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
                {!isFriend ? (
                    <Grid item xs={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {!requestSent ? (<IconButton size="small" onClick={handleAdd}>
                                <AddIcon />
                            </IconButton>) : (
                                <IconButton size="small" onClick={handleRemove}>
                                    <DoneIcon />
                                </IconButton>
                            )}
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
                )}
            </Grid>
        </StyledAccount>
    )
}