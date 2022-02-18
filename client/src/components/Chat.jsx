import React, { useState, useEffect } from "react";
import Picker from "emoji-picker-react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, Name, RoomId }) => {
  const [Message, setMessage] = useState("");
  const [Allmsg, setAllmsg] = useState([]);
  const [Hide, setHide] = useState(true);
  const [PickerStyle, setPickerStyle] = useState({
    width: "100%",
    height: "0",
    backgroundColor: "#424955",
    border: "none",
    display: "none",
  });

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
    socket.on("user_joined", (data) => {
      setAllmsg((prev) => [...prev, data]);
      // console.log(`user joined ${data.time}`);
    });

    socket.on("left", (data) => {
      setAllmsg((prev) => [...prev, data]);
    });
  }, [socket]);

  const onEmojiClick = (event, emojiobject) => {
    setMessage((prev) => prev + emojiobject.emoji);
  };

  useEffect(() => {
    if (Hide === true)
      setPickerStyle({
        width: "100%",
        height: "0",
        backgroundColor: "#424955",
        border: "none",
        transition: "all 0.2s ease-in-out",
      });
    else
      setPickerStyle({
        width: "100%",
        height: "185px",
        backgroundColor: "#424955",
        border: "none",
        display: "flex",
        transition: "all 0.2s ease-in-out",
      });
  }, [Hide]);

  return (
    <>
      <div className="chatcontainer">
        <nav className="chatnav">
          <i className="fas fa-user-friends fa-2x"></i>
        </nav>

        <section className="chatsection">
          <ScrollToBottom className="chatsection">
            {Allmsg.map((msg, index) => {
              const user = msg.name === Name ? "you" : "others";
              const joinedornot = msg.joined === true ? "joined" : "";
              const nodandt = msg.joined === true ? "notimeanddate" : "";
              return (
                <div key={index} className={`${user} ${joinedornot}`}>
                  <div className="msg">{msg.message}</div>
                  <div className={`details ${nodandt}`}>
                    <small className="sender">
                      {msg.name === Name ? "you" : msg.name}
                    </small>
                    <small className="time">{msg.time}</small>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </section>

        <footer className="chatinput">
          <i
            className="fas fa-grin-beam"
            onClick={(e) => {
              setHide((prev) => !prev);
            }}
          ></i>
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
        <div
          className="picker"
          onBlur={(e) => {
            setHide((prev) => !prev);
          }}
          tabIndex="1"
        >
          <Picker pickerStyle={PickerStyle} onEmojiClick={onEmojiClick} />
        </div>
      </div>
    </>
  );
};

export default Chat;
