import {Avatar, Box, Button, Card, List, ListItem, ListItemText, TextField, Typography} from "@mui/material";
import Iconify from "../components/iconify";
import React, {useState , useEffect,useRef} from "react";
import { socket } from '../socket';


function formatDate(timestamp) {
    const date = new Date(parseInt(timestamp));
    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript'te aylar 0'dan başlar
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day}/${month < 10 ? '0' : ''}${month}/${year} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

export default function ConservationPage({sender, receiver, receiverList }) {
    const [messages, setMessages] = useState([

    ]);



    const getInitalMessages = () => {
        fetch("http://localhost:3002/mediasoup/getMessages", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: sender, receiver: receiver }),
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages(data)
            });
    };

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            console.log(newMessage)
            socket.emit("message", {sender: sender, receiver: receiver, date: Date.now(),   message: newMessage, isConservation: "false"});
            setMessages([...messages, {sender: sender, receiver: receiver, date: Date.now(),   message: newMessage, isConservation: "false"}]);
            setNewMessage('');
        }
    };

    useEffect(() => {
        getInitalMessages();
    }, [receiver]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleVideoCall = () => {
        ipcRenderer.send('open-url', 'http://localhost:3001/video/');
    };

    const messagesEndRef = useRef(null);


    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, overflowY: 'auto', maxHeight: '100%' }}>
                <Typography variant="h4" component="div" gutterBottom>
                    Messages
                </Typography>
                <List style={{ display: 'flex', flexDirection: 'column' }}>
                    {messages.map((message) => (
                        <Card key={message.sender}
                              style={{
                                  textAlign: message.sender === "deneme2" ? 'right' : 'left',
                                  maxWidth: '50%',
                                  alignSelf: message.sender === "deneme2" ? 'flex-end' : 'flex-start',
                                  wordWrap: 'break-word'
                              }}>
                            <ListItem key={message.sender}>
                                <Avatar src="" alt="photoURL"/>
                                <Box sx={{ flexGrow: 0.01, m: 0.5 }}/>
                                <ListItemText primary={`${message.message}`}/>
                                <Box sx={{ flexGrow: 0.01, m: 0.5 }}/>
                                <Typography variant="caption" display="block"
                                            style={{ opacity: 0.7, fontSize: '0.7em' }}>
                                    {formatDate(message.date)}
                                </Typography>
                            </ListItem>
                        </Card>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, p: 2 }}>
                <TextField
                    fullWidth
                    label="Type your message"
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleEnterKey}
                />
                <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 1, mt: '10px' }}>
                    Send
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleVideoCall} variant="outlined" color="primary"
                            startIcon={<Iconify icon={"flat-color-icons:video-call"}/>}
                    >
                        Video Call
                    </Button>
                </Box>
            </Box>
        </div>



    );

}