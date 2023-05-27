import PropTypes from 'prop-types';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Box, List, ListItemText } from '@mui/material';
import { useState, useEffect } from 'react';
import { StyledNavItem, StyledNavItemIcon } from './styles';
import socketIoClient from "socket.io-client";


NavSection.propTypes = {
    data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
    return (
        <Box {...other}>
            <List disablePadding sx={{ p: 1 }}>
                {data.map((item) => (
                    <NavItem key={item.title} item={item} />
                ))}
            </List>
        </Box>
    );
}

NavItem.propTypes = {
    item: PropTypes.object,
};

function NavItem({ item }) {
    const { title, path, icon, info } = item;

    const [socket, setSocket] = useState(null);
    const [messageCount, setMessageCount] = useState(0);
    const [username, setUsername] = useState('');
    const location = useLocation();

    useEffect(() => {
        (async () => {
            try {
                const credentials = await window.electron.ipcRenderer.invoke('getCredentials');

                setUsername(credentials.userName);

                const socketIo = socketIoClient("https://sutogachat.site/");
                setSocket(socketIo);

            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    useEffect( () => {
        const isMessagesPage = location.pathname === '/messages';

        console.log("aaaaaaaaaaa")

        if (socket) {
            socket.on('conservation', (data) => {
                const { receiverList } = data;
                console.log(receiverList, username)
                if (receiverList.includes(username) ) {
                    if (!isMessagesPage) {
                        setMessageCount(count => count + 1);
                    }
                }
            });

            socket.on('conservation-update', (data) => {
                const { receiverList } = data;

                console.log(receiverList, username,location.pathname)

                if (receiverList.includes(username) ) {
                    if (!isMessagesPage) {
                        setMessageCount(count => count + 1);
                    }
                }
            });

            return () => {
                socket.off('conservation');
                socket.off('conservation-update');
            }
        }
    }, [socket, location, username]);

    const handleClick = () => {
        if (title === 'messages') {
            setMessageCount(0);
        }
    }


    return (
        <StyledNavItem
            component={RouterLink}
            to={path}
            onClick={handleClick}
            sx={{
                '&.active': {
                    color: 'text.primary',
                    bgcolor: 'action.selected',
                    fontWeight: 'fontWeightBold',
                },
            }}
        >
            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

            <ListItemText disableTypography primary={title } />

            {info && info}

            {/* Show message count next to 'Messages' nav item if more than 0 */}
            {title === 'messages' && messageCount > 0 && <div style={{ color: 'red' }}>({messageCount})</div>}
        </StyledNavItem>
    );
}
