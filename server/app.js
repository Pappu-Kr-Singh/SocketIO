import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world");
});

io.on("connection", (socket) => {
  console.log("User Connected!");
  console.log("id", socket.id);
  // socket.emit("welcome", `welcome to the server ${socket.id}`);
  // socket.broadcast.emit("welcome", `broadcast to the server`);

  socket.on("message", ({ room, message }) => {
    console.log(room, message);
    // io.emit("received-message", data);
    // socket.broadcast.emit("received-message", data);
    io.to(room).emit("received-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
