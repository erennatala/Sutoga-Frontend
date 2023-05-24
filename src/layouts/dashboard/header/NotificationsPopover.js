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
import io from 'socket.io-client';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import axios from 'axios';
import FriendRequestNotificationItem from './FriendRequestNotificationItem';
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------
const BASE_URL = process.env.REACT_APP_URL;

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [open, setOpen] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const listRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [totalUnRead, setTotalUnRead] = useState(0);

  useEffect(() => {
    const initialUnReadCount = countRecentNotifications(notifications);
    setTotalUnRead(initialUnReadCount);
  }, [notifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const id = await window.electron.ipcRenderer.invoke('getId');
      const token = await window.electron.ipcRenderer.invoke('getToken');

      const response = await axios.get(`${BASE_URL}users/notifications/${id}`, {
        headers: {
          Authorization: `${token}`,
        },});
      setNotifications(response.data);
    };


    fetchNotifications();
  }, []);

  useEffect(() => {
    const initializeSocket = async () => {
      const newSocket = io("localhost:9092/");

      setSocket(newSocket);

      newSocket.on('notification', (newNotification) => {
        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const notificationDate = new Date(newNotification.createdAt);
        if (notificationDate > oneDayAgo) {
          setTotalUnRead(totalUnRead + 1);
        }
      });
    };

    initializeSocket();

    return () => {
      socket?.close();
    };
  }, []);

  const handleSuccess = (notificationId) => {
    setNotifications((prevNotifications) =>
        prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  const navigateToProfile = (username) => {
    const url = `/profile/${username}`;
    navigate(url, { replace: true });
  };

  const countRecentNotifications = notifications => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return notifications.reduce((count, notification) => {
      const notificationDate = new Date(notification.createdAt);
      return notificationDate > oneDayAgo ? count + 1 : count;
    }, 0);
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
            <List disablePadding>
              {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} handleSuccess={handleSuccess} navigateToProfile={navigateToProfile}/>
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
  handleSuccess: PropTypes.func,
};

function NotificationItem({ notification, handleSuccess, navigateToProfile }) {
  const { avatar, title } = renderContent(notification, handleSuccess, navigateToProfile);

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

function renderContent(notification, handleSuccess, navigateToProfile) {
  let title;
  let avatar;

  if (notification.likeActivity) {
    title = (
        <Typography variant="subtitle2" onClick={() => navigateToProfile(notification.senderUsername)}>
          {notification.senderUsername} liked your post.
        </Typography>
    );
    avatar = <Avatar alt={notification.senderUsername} src={notification.senderPhotoUrl} />;
  } else if (notification.commentActivity) {
    title = (
        <Typography variant="subtitle2" onClick={() => navigateToProfile(notification.senderUsername)}>
          {notification.senderUsername} commented on your post: {notification.commentActivity.content}
        </Typography>
    );
    avatar = <Avatar alt={notification.senderUsername} src={notification.senderPhotoUrl} />;
  } else if (notification.friendRequestActivity) {
    title = (
        <FriendRequestNotificationItem key={notification.friendRequestActivity.id} friendRequest={notification} onSuccess={(e) => handleSuccess(e)} onClick={() => navigateToProfile(notification.senderUsername)}/>
    );
    avatar = <Avatar alt={notification.senderUsername} src={notification.senderPhotoUrl} />;
  } else {
    title = (
        <Typography variant="subtitle2">
          {notification.title}
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            {noCase(notification.description)}
          </Typography>
        </Typography>
    );
    avatar = <Avatar alt={notification.title} src={notification.senderPhotoUrl} />;
  }

  return { avatar, title };
}
