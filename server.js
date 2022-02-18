const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const Name = {};
const Roomid = {};

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    Name[socket.id] = data.name;
    Roomid[socket.id] = data.roomid;
    socket.to(data.roomid).emit("user_joined", data);
    socket.join(data.roomid);
  });

  socket.on("send_msg", (data) => {
    socket.to(data.roomid).emit("receive_msg", data);
  });

  socket.on("disconnect", () => {
    data = {
      name: Name[socket.id],
      roomid: Roomid[socket.id],
      message: `${Name[socket.id]} left the chat`,
      joined: true,
      time: "",
    };
    socket.to(Roomid[socket.id]).emit("left", data);
  });
  delete Name[socket.id];
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("/", (req, res) => {
    res.render(path.resolve(__dirname, "client/build", "index.html"));
  });
}
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("SERVER RUNNING");
});
