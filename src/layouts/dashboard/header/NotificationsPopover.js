import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { noCase } from 'change-case';
import {useEffect, useRef, useState} from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import axios from 'axios';
import FriendRequestNotificationItem from './FriendRequestNotificationItem';

// ----------------------------------------------------------------------
const BASE_URL = process.env.REACT_APP_URL;

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);
  const listRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestSuccess = (notificationId) => {
    setFriendRequests((prevFriendRequests) =>
        prevFriendRequests.filter((request) => request.id !== notificationId)
    );
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isUnRead: false,
        }))
    );
  };

  const fetchData = async () => {
    try {
      const id = await window.electron.ipcRenderer.invoke('getId');
      const token = await window.electron.ipcRenderer.invoke('getToken');

      setIsLoading(true);

      const friendRequestsResponse = await axios.get(`${BASE_URL}users/unconfirmed?userId=${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      setFriendRequests(friendRequestsResponse.data);

      const notificationsResponse = await axios.get(`${BASE_URL}users/getLikeNotifications`, {
        headers: {
          Authorization: token,
        },
      });

      setNotifications(notificationsResponse.data);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  return (
      <>
        <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
          <Badge badgeContent={totalUnRead} color="error">
            <Iconify icon="eva:bell-fill" />
          </Badge>
        </IconButton>

        <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                ml: 0.75,
                width: 360,
              },
            }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">Notifications</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You have {totalUnRead} unread messages
              </Typography>
            </Box>

            {totalUnRead > 0 && (
                <Tooltip title="Mark all as read">
                  <IconButton color="primary" onClick={handleMarkAllAsRead}>
                    <Iconify icon="eva:done-all-fill" />
                  </IconButton>
                </Tooltip>
            )}
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
            <List disablePadding subheader={<ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>New</ListSubheader>}>
              {/* Render friend request notifications */}
              {friendRequests.map((friendRequest) => (
                  <FriendRequestNotificationItem key={friendRequest.id} friendRequest={friendRequest} onSuccess={() => handleRequestSuccess(friendRequest.id)} />
              ))}
            </List>

            <List disablePadding subheader={<ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>Before that</ListSubheader>}>
              {/* Render like notifications */}
              {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
              ))}
            </List>
          </Scrollbar>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box sx={{ p: 1 }}>
            <Button fullWidth disableRipple>
              View All
            </Button>
          </Box>
        </Popover>
      </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
      <ListItemButton
          sx={{
            py: 1.5,
            px: 2.5,
            mt: '1px',
            ...(notification.isUnRead && {
              bgcolor: 'action.selected',
            }),
          }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={title}
            secondary={
              <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.disabled',
                  }}
              >
                <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
                {fToNow(notification.createdAt)}
              </Typography>
            }
        />
      </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
      <Typography variant="subtitle2">
        {notification.title}
        <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
          {noCase(notification.description)}
        </Typography>
      </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title}

                   src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}