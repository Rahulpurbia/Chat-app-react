import "./App.css";
import JoinRoom from "./components/JoinRoom";
import Chat from "./components/Chat";
import { useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

function App() {
  const [Name, setName] = useState("");
  const [RoomId, setRoomId] = useState("");
  const [Joined, setJoined] = useState(false);

  return (
    <>
      <div className="ui">
        {!Joined ? (
          <JoinRoom
            socket={socket}
            Name={Name}
            setName={setName}
            RoomId={RoomId}
            setRoomId={setRoomId}
            joined={Joined}
            setjoined={setJoined}
          />
        ) : (
          <Chat socket={socket} Name={Name} RoomId={RoomId} />
        )}
      </div>
    </>
  );
}

export default App;
