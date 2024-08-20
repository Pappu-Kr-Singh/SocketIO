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

  // console.log(message);

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

  const handleDirectMessage = (e) => {
    e.preventDefault();
    socket.emit("directMessage", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <div className="container">
      {/* <div className=" direct_msg border rounded w-auto p-10 mt-10 ">
        <Typography
          variant="h8"
          component="div"
          className="socket__id"
          gutterBottom
        >
          ID - {socketId}
        </Typography>
        <h5 className=" text-xl mb-4 font-bold">Send Direct Message</h5>
        <form onSubmit={handleDirectMessage} className="flex flex-col gap-4">
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            id="standard-basic"
            label="Enter Socket Id"
            variant="standard"
          />
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="standard-basic"
            label="Enter your message"
            variant="standard"
          />
          <Button type="submit" variant="outlined">
            Send
          </Button>
        </form>
       
      </div> */}

      <div>
        <Container maxWidth="sm" className="main">
          <Box sx={{ height: 50 }} />
          <Typography
            variant="h8"
            component="div"
            className="socket__id"
            gutterBottom
          >
            ID - {socketId}
          </Typography>

          <div className=" border rounded p-3 ">
            <h5 className="text-center text-2xl mb-4 font-bold">Join Room</h5>
            <form onSubmit={joinRoomHandler}>
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
              <div className="flex gap-2">
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
                  label="Room/SocketID "
                  variant="standard"
                />
                <Button type="submit" variant="outlined">
                  Send
                </Button>
              </div>
            </form>
          </div>
          <Stack>
            {messages.map((m, i) => (
              <Typography key={i} variant="h6" component="div" gutterBottom>
                {m}
              </Typography>
            ))}
          </Stack>
        </Container>
      </div>
    </div>
  );
};

export default App;
