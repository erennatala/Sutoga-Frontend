import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { Avatar, ListItemAvatar, ListItemButton, ListItemText, Typography, IconButton } from '@mui/material';
import { CheckCircleOutlineOutlined, HighlightOffOutlined } from '@mui/icons-material';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const BASE_URL = process.env.REACT_APP_URL

function FriendRequestNotificationItem({ friendRequest, onSuccess, navigateToProfile }) {
    const { sender, receiver, id } = friendRequest;

    const handleAccept = async () => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');

            await axios.post(`${BASE_URL}users/acceptFriendRequest/${friendRequest.friendRequestActivity.id}`,{},  {
                headers: {
                    Authorization: `${token}`,
                },
            });
            onSuccess(friendRequest.id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDecline = async () => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');

            await axios.post(`${BASE_URL}users/declineFriendRequest/${friendRequest.friendRequestActivity.id}`,{}, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            onSuccess(friendRequest.id);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ListItemButton sx={{ py: 1.5, px: 2.5, mt: '1px' }} onClick={() => navigateToProfile(friendRequest.senderUsername)}>
            <ListItemText
                primary={
                    <Typography variant="subtitle1">
                        <Typography component="span" variant="subtitle2" sx={{ fontWeight: 'bold' }} >
                            {friendRequest.senderUsername}
                        </Typography>{' '}
                        sent you a friend request
                    </Typography>
                }
            />
            <IconButton onClick={handleAccept}>
                <CheckCircleOutlineOutlined />
            </IconButton>
            <IconButton onClick={handleDecline}>
                <HighlightOffOutlined />
            </IconButton>
        </ListItemButton>
    );
}

FriendRequestNotificationItem.propTypes = {
    friendRequest: PropTypes.shape({
        id: PropTypes.number.isRequired,
        sender: PropTypes.shape({
            username: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            profilePhotoUrl: PropTypes.string,
        }),
        receiver: PropTypes.shape({
            username: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            profilePhotoUrl: PropTypes.string,
        }),
    }),
    onSuccess: PropTypes.func.isRequired,
};

export default FriendRequestNotificationItem;
