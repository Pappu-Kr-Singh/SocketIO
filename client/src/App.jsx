import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000/"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  // console.log(messages);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    socket.on("received-message", (data) => {
      // console.log("recieved Message:", data);
      // console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("clicked");
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 200 }} />
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="standard-basic"
          label="Room Name"
          variant="standard"
        />
        <Button type="submit" variant="outlined">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="standard-basic"
          label="Enter your message"
          variant="standard"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="standard-basic"
          label="Room "
          variant="standard"
        />
        <Button type="submit" variant="outlined">
          Send
        </Button>
      </form>

      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
