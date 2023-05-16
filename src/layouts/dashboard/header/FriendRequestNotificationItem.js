import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';

function FriendRequestNotificationItem({ friendRequest }) {
    const { sender, receiver } = friendRequest;

    return (
        <ListItemButton sx={{ py: 1.5, px: 2.5, mt: '1px' }}>
            <ListItemAvatar>
                <Avatar src={sender.profilePhotoUrl} alt={sender.username} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="subtitle2">
                        {sender.username} sent you a friend request
                    </Typography>
                }
                secondary={
                    <Typography variant="caption" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', color: 'text.disabled' }}>
                        {sender.firstName} {sender.lastName}
                    </Typography>
                }
            />
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
