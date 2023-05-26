import React, { useState, useEffect } from 'react';
import {Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, Card, Avatar, Checkbox, Modal} from '@mui/material';
import Iconify from "../components/iconify";
import { v4 as uuidv4 } from 'uuid';
import ConservationPage from "./ConservationPage";
import socketIoClient from "socket.io-client";


export default function Messages() {
    const [conversations, setConversations] = useState([]);

    const [friends, setFriends] = useState();

    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');

    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showFriends, setShowFriends] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openNewConversationModal, setOpenNewConversationModal] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [onlineStatus, setOnlineStatus] = useState(false);

    const socket = socketIoClient("https://sutogachat.site/");


// Separate useEffect for 'online' event
    useEffect(() => {
        if (username) {
            socket.emit('online', username);
            console.log(username);
            setOnlineStatus(true);
        }
    }, [username]);

// Separate useEffect for 'offline' event (cleanup function)
    useEffect(() => {
        return () => {
            // Kullanıcının offline olduğunu belirtme
            socket.emit('offline', username);
            setOnlineStatus(false);

            socket.disconnect();
        };
    }, []);

// Main useEffect for socket events
    useEffect(() => {

        socket.on('message', (message) => {
            setConversations(conversations => conversations.map(conversation =>
                conversation.conservationId === message.conservationId ?
                    { ...conversation, messages: [...conversation.messages, message] } :
                    conversation));
        });

        socket.on('conservation', (data) => {
            const { receiverList, conservation } = data;

            console.log(conservation, receiverList, username)
            if (receiverList.includes(username) && !conversations.some(conv => conv.groupId === conservation.groupId)) {
                setConversations(conversations => [conservation, ...conversations]);
            }
        });

        socket.on('online-users', (users) => {
            setOnlineUsers(users);
        });



    }, [username]);





    useEffect(() => {
        (async () => {
            try {
                const credentials = await window.electron.ipcRenderer.invoke('getCredentials');

                setUsername(credentials.userName);
                setToken(credentials.token);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    useEffect(() => {
        if (username) {
            console.log(username)
            fetch(`https://sutogachat.site/conservation/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    // En yenisi en üstte olacak şekilde conservation'ları sıralama
                    data.sort((a, b) => new Date(b.lastUpdateDate) - new Date(a.lastUpdateDate));
                    setConversations(data);
                    console.log(data)
                });

            fetch(`http://localhost:8080/users/getFriendsByUsernameForChat?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
                .then((response) => response.json())
                .then((data) => {

                    console.log(data)
                    setFriends(data)
                });

        }

    }, [username]);  // username değiştiğinde bu useEffect çalışacak


    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
    };

    const [newConversation, setNewConversation] = useState(false);

    const handleNewConversation = () => {
        setOpenNewConversationModal(true);
    };

    const handleSelectFriend = (friend) => {
        setConversations([ {id: friend.id, secondUser: friend.secondUser, isNewConservation : true},...conversations]);
        setShowFriends(false);
    };

    const nonConversedFriends = friends.filter(
        friend => !conversations.some(conversation => conversation.secondUser === friend.secondUser)
    );

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSelectGroupFriend = (friend) => {
        if (selectedFriends.some(secondUser => secondUser === friend.secondUser)) {
            setSelectedFriends(selectedFriends.filter(secondUser => secondUser !== friend.secondUser));
        } else {
            setSelectedFriends([...selectedFriends, friend.secondUser]);
        }
    };

    const handleGroupNameChange = (event) => {
        setGroupName(event.target.value);
    };

    const finishGroupSelection = () => {
        if (!groupName) {
            alert('Please enter a group name');
            return;
        }
        if (selectedFriends.length === 0) {
            alert('Please select at least one friend');
            return;
        }

        console.log(selectedFriends)

        selectedFriends.push(username);

        console.log(selectedFriends)

        let members = selectedFriends;

        const groupId = uuidv4(); // UUID oluşturma
        fetch("https://sutogachat.site/groupconservation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secondUser: groupName, groupId: groupId, groupMembers: selectedFriends }),
        })
            .then((response) => {
                if (!response.ok) {
                    // Yanıt başarısız olduğunda hata mesajını al
                    return response.json().then((error) => {
                        throw new Error(error.error);
                    });
                }
                return response.json();
            })
            .then((data) => {
                // Güncellenmiş conservation'ı listeye ekleyip yeniden sıralama
                console.log("ok", data)

            })
            .catch((error) => {
                console.error("Error:", error);
            });

        setSelectedFriends([]);
        setGroupName('');
        setOpenModal(false);
    };


    function isUserOnline(username) {
        return onlineUsers.includes(username);
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', p: 2 }}>
            <Box sx={{ flexGrow: 0, width: '25%', borderRight: '1px solid #ccc', mr: 2 }}>
                <Typography variant="h6" component="div" gutterBottom>
                    Conversations
                </Typography>
                <Button

                    onClick={handleNewConversation}
                    variant="outlined"
                    style={{backgroundColor: newConversation ? '#cfe8fc' : 'white'}}
                >
                    Start a new conversation
                </Button>
                <Button
                    onClick={handleOpenModal}
                    variant="outlined"
                >
                    Start a new group conversation
                </Button>
                <List>
                    {conversations.map((item) => (
                        <React.Fragment key={item.secondUser}>
                            <ListItem button onClick={() => {handleSelectConversation(item)
                                item.unreadMessageCount= null
                            }}>
                                <Avatar src="" alt="photoURL" />
                                <Box sx={{flexGrow: 0.03}} />
                                <ListItemText primary={item.secondUser} />
                                {isUserOnline(item.secondUser) && (
                                    <ListItemText secondary="Online" style={{ color: "green", fontSize: "small" }} />
                                )}
                                {item.unreadMessageCount && (
                                    <ListItemText primary={item.unreadMessageCount} />
                                )}
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>

            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {selectedConversation ? (
                    <ConservationPage
                        isNewConservation={selectedConversation.isNewConservation}
                        sender={username}
                        receiver={selectedConversation.secondUser}
                            receiverList={selectedConversation.groupMembers}
                        setConversations={setConversations}
                        groupId= {selectedConversation.groupId}// isGroup prop'unu burada belirliyoruz
                        conservationId={selectedConversation.conservationId}

                    />
                ) : (
                    <Typography variant="h4" component="div" gutterBottom>
                        Select a conversation to chat.
                    </Typography>
                )}
            </Box>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Box sx={{ width: '50%', bgcolor: 'background.paper', p: 2, mx: 'auto', my: '20%', outline: 'none' }}>
                    <Typography variant="h6" id="modal-title" sx={{my:1}}>
                        Start a new group conversation
                    </Typography>
                    <TextField
                        sx={{my:1}}
                        variant="outlined"
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={handleGroupNameChange}
                    />
                    <List>
                        {friends.map((item) => (
                            <React.Fragment key={item.secondUser}>
                                <ListItem onClick={() => handleSelectGroupFriend(item)}>
                                    <Checkbox checked={selectedFriends.includes(item.secondUser)} />
                                    <Avatar src="" alt="photoURL" />
                                    <Box sx={{flexGrow: 0.03}} />
                                    <ListItemText primary={item.secondUser} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>

                        <Button
                            onClick={finishGroupSelection}
                            variant="contained"
                            style={{backgroundColor: '#17446A'}}
                        >
                            Finish Selection
                        </Button> </Box>
                </Box>
            </Modal>
            <Modal
                open={openNewConversationModal}
                onClose={() => setOpenNewConversationModal(false)}
                aria-labelledby="new-conversation-modal-title"
                aria-describedby="new-conversation-modal-description"
            >
                <Box sx={{ width: '50%', bgcolor: 'background.paper', p: 2, mx: 'auto', my: '20%', outline: 'none' }}>
                    <Typography variant="h6" id="new-conversation-modal-title" sx={{my:1}}>
                        Start a new conversation
                    </Typography>
                    <List>
                        {nonConversedFriends.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListItem onClick={() => { handleSelectFriend(item); setOpenNewConversationModal(false) }}>
                                    <Avatar src="" alt="photoURL" />
                                    <Box sx={{flexGrow: 0.03}} />
                                    <ListItemText primary={item.secondUser} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>

                        <Button
                            onClick={() => setOpenNewConversationModal(false)}
                            variant="contained"
                            style={{backgroundColor: '#17446A'}}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>


        </Box>
    );
};