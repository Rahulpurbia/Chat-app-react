import React, { useState, useEffect } from "react";

const JoinRoom = ({
  socket,
  Name,
  setName,
  RoomId,
  setRoomId,
  joined,
  setjoined,
}) => {
  const joinRoom = () => {
    if (Name !== "" && RoomId !== "") {
      setjoined(true);
      const data = {
        Name,
        RoomId,
      };
      socket.emit("join_room", data);
    }
  };

  return (
    <>
      <div className="joincontainer">
        <h1 className="chatappname">Join a Chat</h1>
        <div className="name">
          <label htmlFor="username">Username</label>
          <div className="input">
            <input
              autoFocus
              placeholder="Eg:- Rahul"
              name="user-name"
              autoComplete="off"
              type="text"
              id="username"
              value={Name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="roomid">
          <label htmlFor="roomid">Room ID</label>
          <div className="input">
            <input
              placeholder="Enter unique Id"
              type="text"
              autoComplete="off"
              id="roomid"
              value={RoomId}
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
              onKeyPress={(e) => e.key === "Enter" && joinRoom()}
            />
          </div>
        </div>
        <button className="joinroom" onClick={joinRoom}>
          Join Chat
        </button>
      </div>
    </>
  );
};

export default JoinRoom;
