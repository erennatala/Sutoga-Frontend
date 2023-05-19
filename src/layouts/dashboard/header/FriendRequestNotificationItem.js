import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, ListItemAvatar, ListItemButton, ListItemText, Typography, IconButton } from '@mui/material';
import { CheckCircleOutlineOutlined, HighlightOffOutlined } from '@mui/icons-material';

function FriendRequestNotificationItem({ friendRequest }) {
    const { sender, receiver } = friendRequest;

    const handleAccept = () => {
        // Accept logic here
    };

    const handleDecline = () => {
        // Decline logic here
    };

    return (
        <ListItemButton sx={{ py: 1.5, px: 2.5, mt: '1px' }}>
            <ListItemAvatar>
                <Avatar src={sender.profilePhotoUrl} alt={sender.username} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="subtitle1">
                        <Typography component="span" variant="subtitle2" sx={{ fontWeight: 'bold' }}>
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
};

export default FriendRequestNotificationItem;
