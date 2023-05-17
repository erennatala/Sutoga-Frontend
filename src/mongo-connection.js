const mongoose= require('mongoose');

mongoose
  .connect("mongodb://localhost:27017")
  .then((res) => console.log("mongo connection success"))
  .catch((err) => console.error("mongo connection failed", err));

const db = mongoose.connection;

//Message schema ---   ADD SEND TIME LATER
const Message = db.model("Message", {
  sender: String,
   receiver: String,
  roomId: String,
  message: String,
  date: String,
  isConservation:String
});

const Conservation = db.model("Conservation", {
    firstUser: String,
    secondUser: String,
    lastUpdateDate: String,
    groupId : String
});

module.exports = { db, Message, Conservation };
