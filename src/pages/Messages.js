import React, { useState } from 'react';
import {Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, Card, Avatar} from '@mui/material';
import Iconify from "../components/iconify";

export default function Messages() {
    const [conversations, setConversations] = useState([
        { id: 1, name: 'emruxx' },
        { id: 2, name: 'keremmican' },
        { id: 3, name: 'erennatala' },
    ]);

    const [messages, setMessages] = useState([
        { id: 1, user: 'Emrullah', content: 'Selam' },
        { id: 2, user: 'Kerem', content: 'Naber' },
        { id: 3, user: 'Eren', content: 'Merhaba' },
    ]);

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, { id: Date.now(), user: 'You', content: newMessage }]);
            setNewMessage('');
        }
    };

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', p: 2 }}>
            <Box sx={{ flexGrow: 0, width: '25%', borderRight: '1px solid #ccc', mr: 2 }}>
                <Typography variant="h6" component="div" gutterBottom>
                    Conversations
                </Typography>
                <List>
                    {conversations.map((conversation) => (
                        <React.Fragment key={conversation.id}>
                            <Card>
                                <ListItem button>
                                    <Avatar src="" alt="photoURL" />
                                    <Box sx={{flexGrow: 0.03}} />
                                    <ListItemText primary={conversation.name} />
                                </ListItem>
                            </Card>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" component="div" gutterBottom>
                    Messages
                </Typography>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                    <List>
                        {messages.map((message) => (
                            <Card key={message.id}>
                                <ListItem key={message.id}>
                                    <Avatar src="" alt="photoURL"/>
                                    <Box sx={{flexGrow: 0.01}} />
                                    <ListItemText primary={`${message.user}: ${message.content}`} />
                                </ListItem>
                            </Card>
                        ))}
                    </List>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <TextField
                        fullWidth
                        label="Type your message"
                        variant="outlined"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleEnterKey}
                    />
                    <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 1 }}>
                        Send
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button variant="outlined" color="primary" startIcon={<Iconify icon={"flat-color-icons:video-call"} />}>
                        Video Call
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
