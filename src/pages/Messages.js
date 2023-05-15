import React, { useState } from 'react';
import {Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, Card, Avatar} from '@mui/material';
import Iconify from "../components/iconify";
import ConservationPage from "./ConservationPage";
const { ipcRenderer } = window.electron;
export default function Messages() {
    const [conversations, setConversations] = useState([
        { id: 1, name: 'emruxx' },
        { id: 2, name: 'keremmican' },
        { id: 3, name: 'erennatala' },
    ]);


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
            <ConservationPage sender="deneme2" receiver  />
        </Box>
    );
};
