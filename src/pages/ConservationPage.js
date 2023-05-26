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

        if(groupId || isNewConservation){
            return;

        }


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