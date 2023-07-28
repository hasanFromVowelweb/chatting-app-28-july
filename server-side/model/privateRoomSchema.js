import mongoose from "mongoose";

const privateRoomSchema = new mongoose.Schema({
  roomID: {
    type: String,
    unique: true,
    required: true,
  },
  userName1: {
    type: String,
    required: true,
  },
  userName2: {
    type: String,
    required: true,
  },
  lastMsg: {
      type: String,
      required: true,
    }
});


export default mongoose.model('PrivateRoom', privateRoomSchema);