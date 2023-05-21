import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, ListItemAvatar, ListItemButton, ListItemText, Typography, IconButton } from '@mui/material';
import { CheckCircleOutlineOutlined, HighlightOffOutlined } from '@mui/icons-material';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const BASE_URL = process.env.REACT_APP_URL

function FriendRequestNotificationItem({ friendRequest, onSuccess }) {
    const { sender, receiver, id } = friendRequest;
    const navigate = useNavigate();

    const navigateToProfile = (username) => {
        const url = `/profile/${username}`;
        navigate(url, { replace: true });
    };

    const handleAccept = async () => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');

            await axios.post(`${BASE_URL}users/acceptFriendRequest/${id}`,{},  {
                headers: {
                    Authorization: `${token}`,
                },
            });
            onSuccess();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDecline = async () => {
        try {
            const token = await window.electron.ipcRenderer.invoke('getToken');

            await axios.post(`${BASE_URL}users/declineFriendRequest/${id}`,{}, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            onSuccess();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ListItemButton sx={{ py: 1.5, px: 2.5, mt: '1px' }}>
            <ListItemAvatar onClick={() => navigateToProfile(sender.username)}>
                <Avatar src={sender.profilePhotoUrl} alt={sender.username} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="subtitle1">
                        <Typography component="span" variant="subtitle2" sx={{ fontWeight: 'bold' }} onClick={() => navigateToProfile(sender.username)}>
                            {sender.username}
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
