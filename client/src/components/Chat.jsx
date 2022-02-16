import React, { useState, useEffect } from "react";

const Chat = ({ socket, Name, RoomId }) => {
  const [Message, setMessage] = useState("");
  const [Allmsg, setAllmsg] = useState([]);

  const Sendmsg = () => {
    if (Message !== "") {
      const data = {
        name: Name,
        message: Message,
        roomid: RoomId,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      setAllmsg((prev) => [...prev, data]);
      socket.emit("send_msg", data);
    }
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_msg", (data) => {
      setAllmsg((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <>
      <div className="chatcontainer">
        <nav className="chatnav">
          <i className="fas fa-user-friends fa-2x"></i>
        </nav>
        <section className="chatsection">
          {Allmsg.map((msg, index) => {
            return (
              <>
                <div
                  key={index}
                  className={msg.name === Name ? "you" : "others"}
                >
                  <div className="msg">{msg.message}</div>
                  <div className="details">
                    <small className="sender">
                      {msg.name === Name ? "you" : msg.name}
                    </small>
                    <small className="time">{msg.time}</small>
                  </div>
                </div>
              </>
            );
          })}
        </section>
        <footer className="chatinput">
          <input
            autoFocus
            type="text"
            autoComplete="off"
            placeholder="Message..."
            value={Message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyPress={(e) => e.key === "Enter" && Sendmsg()}
          />
          <button onClick={Sendmsg}> &#8594;</button>
        </footer>
      </div>
    </>
  );
};

export default Chat;
