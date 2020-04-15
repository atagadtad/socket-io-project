const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.post("/api/private-chat-request", (req, res) => {
  let userID = req.body.user_id;
  let chatWithUserID = req.body.chat_with;
  res.json([{ channelName: `${userID}_to_${chatWithUserID}` }]);
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

module.exports = app;
