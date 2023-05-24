const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Cryptr=  require('cryptr');
const cors = require('cors');
const cryptr = new Cryptr("myTotallySecretKey");
const { db, Message, Conservation } = require("./mongo-connection.js");
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
    console.log(req.body);
    console.log(req.body.sender);
    console.log(req.body.receiver);
    let query = {};
    if (req.body.roomId) {
        // If roomId is provided, search only by roomId
        query = { roomId: req.body.roomId };
    } else {
        // If roomId is not provided, search by sender and receiver
        query = { $or: [
                { sender: req.body.sender, receiver: req.body.receiver },
                { sender: req.body.receiver, receiver: req.body.sender }
            ]};
    }

    Message.find(
        query,
        "sender receiver message date",
        (err, messages) => {
            if (err) return handleError(err);

            messages.map(
                (message) => (message.message = cryptr.decrypt(message.message))
            );

            res.send(messages);
        }
    );
});


app.post("/conservation", async (req, res) => {
    const { firstUser, secondUser,conservationId } = req.body;
    console.log(req.body)
    const newConservation = new Conservation({
        firstUser,
        secondUser,
        conservationId,
        lastUpdateDate: new Date().toISOString(),
    });

    try {
        const savedConservation = await newConservation.save();
        // Tüm kullanıcılara yeni conservation'ın oluşturulduğunu bildiriyoruz.

        let data = {
            "conservation": savedConservation,
            "receiverList": [secondUser] // Assuming secondUser is defined somewhere in your code
        }
        io.emit('conservation', data);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.post("/groupconservation", async (req, res) => {
    const {secondUser, groupId, groupMembers } = req.body;
    const newConservation = new Conservation({
        secondUser,
        groupId,
        groupMembers,
        lastUpdateDate: new Date().toISOString(),
    });

    try {
        const savedConservation = await newConservation.save();
        // Tüm kullanıcılara yeni conservation'ın oluşturulduğunu bildiriyoruz.

        let data = {
            "conservation": savedConservation,
            "receiverList": groupMembers // Assuming secondUser is defined somewhere in your code
        }
        io.emit('conservation', data);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.put("/groupconservation", async (req, res) => {
    const { groupId,secondUser, groupMembers } = req.body;
    try {
        const updatedConservation = await Conservation.findOneAndUpdate(
            { groupId },
            { secondUser, groupMembers, lastUpdateDate: new Date().toISOString() },
            { new: true }
        );

        if (updatedConservation) {
            res.json(updatedConservation);
        } else {
            res.status(404).json({ error: "Conservation not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});



// Conservation güncelleme endpoint'i
app.put("/conservation", async (req, res) => {
    const { firstUser, secondUser,conservationId } = req.body;
    try {
        const updatedConservation = await Conservation.findOneAndUpdate(
            { firstUser, secondUser,conservationId },
            { lastUpdateDate: new Date().toISOString() },
            { new: true }
        );

        if (updatedConservation) {
            res.json(updatedConservation);
        } else {
            res.status(404).json({ error: "Conservation not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.get("/conservation/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const conservations = await Conservation.find({
            $or: [
                { firstUser: username },
                { groupMembers: { $in: [username] } }
            ]
        }).sort({ lastUpdateDate: -1 }); // en yenisi en üstte olacak şekilde sıralama

        if (conservations) {
            res.json(conservations);
        } else {
            res.status(404).json({ error: "No conservations found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


// Client tarafından bağlantı yapıldığında çalışacak event
io.on('connection', (socket) => {

    socket.on('join room', (roomId) => {
        socket.join(roomId);
    });


    socket.on("message", (data) => {
        let dbMessage = new Message({
            sender: data.sender,
            receiver: data.receiver,
            date : data.date,
            roomId: data.roomId,
            isConservation: data.isConservation,
            message: cryptr.encrypt(data.message),
        });

        let messageToReturn = new Message({
            sender: data.sender,
            receiver: data.receiver,
            date : data.date,
            roomId: data.roomId,
            isConservation: data.isConservation,
            message: data.message,
        });

        dbMessage
            .save()
            .then((res) => {
                console.log("message saved to mongo", res)
                    io.to(data.roomId).emit('createMessage', messageToReturn);


                }

            )
            .catch((error) => console.error("message not saved to mongo", error));


        // Client bağlantısı kesildiğinde çalışacak event

});



});

server.listen(3002, () => console.log('Listening on port 3002'));
