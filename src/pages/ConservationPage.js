import { Avatar, Box, Button, Card, List, ListItem, ListItemText, TextField, Typography, Modal } from "@mui/material";
import Iconify from "../components/iconify";
import React, {useState , useEffect,useRef} from "react";
import { socket } from '../socket';
import {v4 as uuidv4} from "uuid";
import socketIoClient from "socket.io-client";




function formatDate(timestamp) {
    const date = new Date(parseInt(timestamp));
    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript'te aylar 0'dan başlar
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day}/${month < 10 ? '0' : ''}${month}/${year} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

export default function ConservationPage({isNewConservation: initialIsNewConservation,sender, receiver, receiverList, setConversations, groupId ,conservationId: initalConservationId}) {
    const [messages, setMessages] = useState([

    ]);
    const [isNewConservation, setIsNewConservation] = useState(initialIsNewConservation);

    const [conservationId, setconservationId] = useState(initalConservationId);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    const socket = socketIoClient("https://sutogachat.site/");

    useEffect(() => {
        // Socket bağlantısı oluşturma


        console.log("conservationId: ",conservationId)

        // Odanın adı belirlenir, eğer groupId varsa onu, yoksa conservationId'yi kullanır
        const roomName = groupId ? groupId: conservationId;


        console.log("roomname:", roomName);
        // Odaya katılma
        socket.emit("join room", roomName);

        // Mesajları dinleme
        socket.on("createMessage", async message => {
            console.log("message received")

            setMessages(prevMessages => [...prevMessages, message]);

        });

        // Component temizlenirken, socket bağlantısını kapatırız
        return () => {
            socket.disconnect();
        };
    }, [receiver,conservationId]);


    const getInitalMessages = () => {




        console.log(isNewConservation)
        console.log(receiverList)
        console.log(receiver)
        fetch("https://sutogachat.site/mediasoup/getMessages", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: groupId ? JSON.stringify({ roomId:groupId }) : JSON.stringify({ sender: sender, receiver: receiver }),
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages(data)
            });



    };

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = async () => {

        console.log(isNewConservation)
        let roomId = groupId ? groupId : conservationId;


        if (newMessage.trim() !== '') {
            socket.emit("message", {
                sender: sender,
                receiver: receiver,
                date: Date.now(),
                message: newMessage,
                roomId: roomId,
                isConservation: "false"
            });
            setNewMessage('');
            let conserId = conservationId
            if (isNewConservation)
                conserId = uuidv4()

            // Mesaj gönderildiğinde conservation güncelleme
            const fetchPromises = [
                fetch(
                    groupId ? "https://sutogachat.site/groupconservation" : "https://sutogachat.site/conservation",
                    {
                        method: isNewConservation ? "POST" : "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: groupId
                            ? JSON.stringify({
                                secondUser: receiver,
                                groupId: groupId,
                                groupMembers: receiverList,
                            })
                            : JSON.stringify({
                                firstUser: sender,
                                secondUser: receiver,
                                conservationId: conserId,
                            }),
                    }
                ).then((response) => response.json()),
            ];

            console.log("gönderilen conserVationId:", conserId)

            if (!groupId) {
                fetchPromises.push(
                    fetch("https://sutogachat.site/conservation", {
                        method: isNewConservation ? 'POST' : 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            firstUser: receiver,
                            secondUser: sender,
                            conservationId: conserId,
                        }),
                    })
                        .then((response) => response.json())
                );
            }

            Promise.all(fetchPromises)
                .catch((error) => {
                    console.error("An error occurred during the conservation update:", error);
                });

            if (isNewConservation)
                setMessages([{
                    sender: sender,
                    receiver: receiver,
                    date: Date.now(),
                    message: newMessage,
                    roomId: roomId,
                    isConservation: "false"
                }])

            setIsNewConservation(false);
            setconservationId(conserId)
        }
    };


    useEffect(() => {
        getInitalMessages();
    }, [receiver]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); // Bu hook, messages listesi her değiştiğinde tetiklenir.



    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleVideoCall = () => {

        console.log("video aa")
        let roomId = groupId ? groupId : conservationId;
        window.electron.ipcRenderer.send('open-url', 'http://localhost:3001/video?username='+sender+'&roomId='+roomId);
    };


    const createNewConversation = () => {
        fetch("https://sutogachat.site/conservation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstUser: sender, secondUser: receiver }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Yeni conservation'ı listeye ekleyip yeniden sıralama
                setConversations(prevConservations => {
                    prevConservations.push(data);
                    prevConservations.sort((a, b) => new Date(b.lastUpdateDate) - new Date(a.lastUpdateDate));
                    return prevConservations;
                });
            });
    };


    return (
        <div>
            <div>
                <Box display="flex" alignItems="center">
                    <Typography variant="h4" component="div" gutterBottom>
                        Messages from {receiver}
                    </Typography>
                    {groupId && <Button onClick={handleOpenModal} variant="contained" color="primary" style={{ marginLeft: "15px" }}>
                        Show Group Members
                    </Button>}
                </Box>
            </div>

            <div style={{marginTop:"20px", display: 'flex', flexDirection: 'column', height: '700px' }}>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, overflowY: 'auto', maxHeight: '100%' }}>

                    <List style={{ display: 'flex', flexDirection: 'column' }}>
                        {messages?.map((message) => (
                            <Card
                                key={message.date}
                                style={{
                                    textAlign: message.sender === sender ? 'right' : 'left',
                                    maxWidth: '50%',
                                    alignSelf: message.sender === sender ? 'flex-end' : 'flex-start',
                                    wordWrap: 'break-word'
                                }}
                            >
                                <ListItem
                                    key={message.date}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: message.sender === sender ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {message.sender !== sender && ( // Check if the sender is not equal to the current user
                                        <Box sx={{ marginRight: '10px', alignSelf: 'center' }}>
                                            <Typography variant="caption" display="block" style={{ opacity: 0.7, fontSize: '0.7em' }}>
                                                {message.sender}
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box sx={{ flexGrow: 0.01, m: 0.5 }} />
                                    <ListItemText primary={`${message.message}`} />
                                    <Box sx={{ flexGrow: 0.01, m: 0.5 }} />
                                    <Typography variant="caption" display="block" style={{ opacity: 0.7, fontSize: '0.7em' }}>
                                        {formatDate(message.date)}
                                    </Typography>
                                </ListItem>
                            </Card>
                        ))}
                        <div ref={messagesEndRef} />
                    </List>

                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Type your message"
                        variant="outlined"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleEnterKey}
                    />
                    <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 1, mt: 2, marginRight: '15px' }}>
                        Send
                    </Button>
                    <Button onClick={handleVideoCall} variant="outlined" color="primary"
                            startIcon={<Iconify icon={"flat-color-icons:video-call"}/>}
                    >
                        Video Call
                    </Button>

                    <Modal
                        open={isModalOpen}
                        onClose={handleCloseModal}
                        aria-labelledby="group-members-modal-title"
                        aria-describedby="group-members-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <Typography id="group-members-modal-title" variant="h6" component="h2">
                                Group Members
                            </Typography>
                            {receiverList?.map((member, index) => (
                                <Typography id={`group-member-${index}`} key={index} variant="body1" component="p">
                                    {member}
                                </Typography>
                            ))}
                        </Box>
                    </Modal>
                </Box>
            </div>


        </div>





    );

}
```

```
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

    useEffect(() => {

    }, [conversations]);

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

        if(username ){

            socket.on('message', (message) => {
                setConversations(conversations => conversations.map(conversation =>
                    conversation.conservationId === message.conservationId ?
                        { ...conversation, messages: [...conversation.messages, message] } :
                        conversation));
            });

            socket.on('conservation', (data) => {

                const { receiverList, conservation } = data;
                console.log(conservation, receiverList, username,conversations)

                if(conservation.groupId){
                    console.log("aa")
                    if (receiverList.includes(username) && !conversations.some(conv => conv.groupId === conservation.groupId)) {
                        setConversations(conversations => [conservation, ...conversations]);
                    }
                }

                if(conservation.conservationId && conversations.length>0){
                    console.log("bbb")
                    if (receiverList.includes(username) && !conversations.some(conv => conv.secondUser === conservation.secondUser) ) {

                        setConversations(conversations => [conservation, ...conversations]);
                    }
                }


            });

            socket.on('online-users', (users) => {
                setOnlineUsers(users);
            });}



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

    const nonConversedFriends = friends?.filter(
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
                        {friends?.map((item) => (
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
                        {nonConversedFriends?.map((item) => (
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