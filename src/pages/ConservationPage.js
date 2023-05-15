import {Avatar, Box, Button, Card, List, ListItem, ListItemText, TextField, Typography} from "@mui/material";
import Iconify from "../components/iconify";
import React, {useState , useEffect} from "react";
import { socket } from '../socket';


export default function ConservationPage({sender, receiver }) {
    const [messages, setMessages] = useState([

    ]);



    const getInitalMessages = () => {
        fetch("https://localhost:3001/mediasoup/getMessages", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: 'deneme2', receiver: receiver }),
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages(data)
            });
    };

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            socket.emit("message", {sender: "deneme2", receiver: receiver, date: Date.now(),   message: newMessage.value, isConservation: "false"});
            setMessages([...messages, {id: Date.now(), user: 'You', content: newMessage}]);
            setNewMessage('');
        }
    };

    useEffect(() => {
        getInitalMessages();
    }, []);

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleVideoCall = () => {
        ipcRenderer.send('open-url', 'http://localhost:3001/video/');
    };


    return (
        <div>
            <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h4" component="div" gutterBottom>
                    Messages
                </Typography>
                <Box sx={{flexGrow: 1, overflowY: 'auto', mb: 2}}>
                    <List>
                        {messages.map((message) => (
                            <Card key={message.sender}>
                                <ListItem key={message.sender}>
                                    <Avatar src="" alt="photoURL"/>
                                    <Box sx={{flexGrow: 0.01}}/>
                                    <ListItemText primary={`${message.sender}: ${message.message}`}/>
                                </ListItem>
                            </Card>
                        ))}
                    </List>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField
                        fullWidth
                        label="Type your message"
                        variant="outlined"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleEnterKey}
                    />
                    <Button variant="contained" onClick={handleSendMessage} sx={{ml: 1}}>
                        Send
                    </Button>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
                    <Button onClick={handleVideoCall} variant="outlined" color="primary"
                            startIcon={<Iconify icon={"flat-color-icons:video-call"}/>}>
                        Video Call
                    </Button>
                </Box>
            </Box>
        </div>

    );

}