const Room = require("../schemas/room");
const User = require("../schemas/user");
const Message = require("../schemas/message");

const io = require("../index").io;

const chatRooms = {};

Room.find().then((rooms) => {
  console.log(rooms);
  rooms.forEach((room) => {
    chatRooms[room.id] = {
      name: room.name,
      totalUser: 0,
      users: {},
    };
  });
});

exports.Index = async (req, res) => {
  try {
    const rooms = await Room.find();

    const username = req.session.username;
    const user = await User.findOne({ username });

    res.render("home", { rooms, user });
  } catch (error) {
    res.render("home", { error: error.message });
  }
  return;
};

exports.JoinRoom = async (req, res) => {
  if (chatRooms[req.params.id] == null) {
    return res.redirect("/home");
  }

  try {
    const username = req.session.username;
    const user = await User.findOne({ username });
    console.log(user);
    res.render("room", { roomId: req.params.id, user: user });
  } catch (error) {
    return res.redirect("/");
  }
};

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    const { roomId, user } = data;

    if (user._id in chatRooms[roomId].users) {
      socket.join(roomId);
      io.to(roomId).emit("room-user", {
        totalUser: chatRooms[roomId].totalUser,
      });
      socket.broadcast.to(roomId).emit("user-connected", {
        name: user.name,
      });
      return;
    }

    if (chatRooms[roomId].totalUser === 2) {
      console.log("Room is full");
      io.emit("room-full", "/home");
      return;
    }

    socket.join(roomId);
    chatRooms[roomId].users[user._id] = user.name;
    chatRooms[roomId].totalUser += 1;
    io.to(roomId).emit("room-user", {
      totalUser: chatRooms[roomId].totalUser,
    });
    socket.broadcast.to(roomId).emit("user-connected", {
      name: user.name,
    });
    console.log(chatRooms);
  });

  socket.on("send-chat-message", async (data) => {
    const { roomId, message, user } = data;
    try {
      const { fromUser, toUser } = await getUserPair(
        chatRooms[roomId].users,
        user
      );

      const chatMessage = new Message({
        fromUserId: fromUser._id,
        toUserId: toUser._id,
        roomId: roomId,
        message,
        dateSent: Date.now(),
      });

      await chatMessage.save();

      socket.broadcast.to(roomId).emit("chat-message", {
        message,
        user,
      });
    } catch (error) {
      console.log("Something wrong happen when storing chat data");
    }
  });

  socket.on("user-is-typing", (data) => {
    const { roomId, user } = data;
    socket.broadcast.to(roomId).emit("user-is-typing", { user });
  });

  socket.on("disconnect-room", (data) => {
    const { roomId, user } = data;

    if (user._id in chatRooms[roomId].users) {
      delete chatRooms[roomId].users[user._id];
      chatRooms[roomId].totalUser -= 1;
      io.to(roomId).emit("room-user", {
        totalUser: chatRooms[roomId].totalUser,
      });
      socket.broadcast.to(roomId).emit("user-disconnected", {
        name: user.name,
      });
    }
    console.log(chatRooms);
  });
});

const getUserPair = async (user, fromUser) => {
  const userId = Object.keys(user);

  const fromUserId = fromUser._id;
  const toUserId = userId[0] === fromUserId ? userId[1] : userId[0];

  return {
    fromUser: await User.findOne({ _id: fromUserId }),
    toUser: await User.findOne({ _id: toUserId }),
  };
};
