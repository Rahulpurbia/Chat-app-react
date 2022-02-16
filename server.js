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

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", (data) => {
    console.log(data.Name, data.RoomId);
    socket.join(data.RoomId);
  });

  socket.on("send_msg", (data) => {
    console.log(data);
    socket.to(data.roomid).emit("receive_msg", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
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
