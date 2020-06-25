const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const users = {};

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  if (!users[socket.id]) {
    // users[socket.id] = socket.id;
    users[socket.id] = { socketID: socket.id, userName: "" };

    console.log("User connected on port 8000", { users });
  }

  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);

  socket.on("disconnect", () => {
    delete users[socket.id];
    console.log("disconnected", { users });
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("endTheCall", (data) => {
    io.to(data.from).emit("endCall");
    // console.log("data.from: ", data.from, "data.to: ", data.to);
    io.to(data.to).emit("endCall");
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("declineCall", (data) => {
    // console.log({ data });
    io.to(data.from).emit("callDeclined", { callDeclined: true });
  });

  socket.on("changeUsername", (data) => {
    // console.log({ data });
    users[socket.id].userName = data.updatedUsername;
    io.sockets.emit("allUsers", users);
    io.to(socket.id).emit("updatedUsername", {
      updatedUsername: data.updatedUsername,
    });
  });
});

server.listen(port, () => console.log("server is running on port 8000"));
