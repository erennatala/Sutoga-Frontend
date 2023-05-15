const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
import Cryptr from "cryptr";
const cryptr = new Cryptr("myTotallySecretKey");
import { db, Message } from "./mongo-connection.js";

const app = express();

// HTTP server oluşturulması
const server = http.createServer(app);

// Socket.IO ile serverı başlatma
const io = socketIo(server);

app.post("/mediasoup/getMessages", (req, res) => {
    var messages;
    console.log("dsfsdfdsf");
    console.log(req.body.sender);
    console.log(req.body.receiver);
    Message.find(
        { sender: req.body.sender, receiver: req.body.receiver },
        "sender receiver message date",
        (err, athletes) => {
            if (err) return handleError(err);

            messages = athletes;
            messages.map(
                (message) => (message.message = cryptr.decrypt(message.message))
            );

            res.send(messages);
        }
    );
});



// Client tarafından bağlantı yapıldığında çalışacak event
io.on('connection', (socket) => {
    socket.on("message", (data) => {
        socket.join(data.roomName);
        let dbMessage = new Message({
            sender: data.sender,
            receiver: data.receiver,
            date : data.date,
            roomId: "",
            isConservation: data.isConservation,
            message: cryptr.encrypt(data.message),
        });

        dbMessage
            .save()
            .then((res) => console.log("message saved to mongo", res))
            .catch((err) => console.error("message not saved to mongo", error));


        // Client bağlantısı kesildiğinde çalışacak event
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});});

server.listen(3002, () => console.log('Listening on port 3002'));
