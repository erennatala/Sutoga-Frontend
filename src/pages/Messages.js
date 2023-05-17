import React, { useState, useEffect } from 'react';
import {Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, Card, Avatar, Checkbox, Modal} from '@mui/material';
import Iconify from "../components/iconify";
import ConservationPage from "./ConservationPage";

export default function Messages() {
    const [conversations, setConversations] = useState([]);


    const [friends, setFriends] = useState([
        { id: 1, secondUser: 'emruxx' },
        { id: 2, secondUser: 'friend1' },
        { id: 3, secondUser: 'friend2' },
    ]);

    const [username, setUsername] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showFriends, setShowFriends] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openNewConversationModal, setOpenNewConversationModal] = useState(false);


    useEffect(() => {
        (async () => {
            try {
                const username = await window.electron.ipcRenderer.invoke('getUsername');
                setUsername(username);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    useEffect(() => {
        if (username) {
            console.log(username)
            fetch(`http://localhost:3002/conservation/${username}`, {
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
        setConversations([...conversations, {id: friend.id, secondUser: friend.secondUser, isNewConservation : true}]);
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
        if (selectedFriends.some(id => id === friend.id)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friend.id));
        } else {
            setSelectedFriends([...selectedFriends, friend.id]);
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
        const selectedFriendObjects = friends.filter(friend => selectedFriends.includes(friend.id));
        setConversations([...conversations, {id: Date.now(), secondUser: groupName, members: selectedFriendObjects}]);
        setSelectedFriends([]);
        setGroupName('');
        setOpenModal(false);
    };




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
                            <ListItem button onClick={() => handleSelectConversation(item)}>
                                <Avatar src="" alt="photoURL" />
                                <Box sx={{flexGrow: 0.03}} />
                                <ListItemText primary={item.secondUser} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>

            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {selectedConversation ? (
                    <ConservationPage isNewConservation={selectedConversation.isNewConservation} sender={username} receiver={selectedConversation.secondUser} receiverList={selectedConversation.members} setConversations={setConversations}/>
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
                            <React.Fragment key={item.id}>
                                <ListItem onClick={() => handleSelectGroupFriend(item)}>
                                    <Checkbox checked={selectedFriends.includes(item.id)} />
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