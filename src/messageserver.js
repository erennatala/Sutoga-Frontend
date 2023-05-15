const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Cryptr=  require('cryptr');
const cors = require('cors');
const cryptr = new Cryptr("myTotallySecretKey");
const { db, Message } = require("./mongo-connection.js");
const bodyParser = require('body-parser');

const app = express();

// CORS middleware kullanımı
app.use(cors());

app.use(bodyParser.json());

// HTTP server oluşturulması
const server = http.createServer(app);

// Socket.IO ile serverı başlatma ve CORS seçeneklerini belirtme
const io = socketIo(server, {
    cors: {
        origin: "*", // Client uygulamanızın URL'ini buraya yazın
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.post("/mediasoup/getMessages", (req, res) => {
    var messages;
    console.log(req.body);
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