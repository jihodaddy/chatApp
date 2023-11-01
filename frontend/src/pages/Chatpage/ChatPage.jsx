import React, { useEffect, useState } from 'react';
import InputField from "../../components/InputField/InputField";
import MessageContainer from "../../components/MessageContainer/MessageContainer";
import socket from "../../server";
import './chatPageStyle.css';
import { Button } from "@mui/base/Button"
import { useParams, useNavigate } from 'react-router-dom';

const ChatPage = ({user}) => {
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const {id} = useParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    socket.on("message", (res) => {
      console.log("message",res)
      setMessageList((prevState) => prevState.concat(res));
    });

    socket.emit("joinRoom", id, (res)=>{
      if(res && res.ok) {
        console.log("successfully join", res);
      }else {
        console.log("fail to join", res);
      }
    })

  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    socket.emit("sendMessage", message, (res) => {
      if (!res.ok) {
        console.log("error message", res.error);
      }
      setMessage("");
    });
  };

  const leaveRoom =()=>{
    socket.emit("leaveRoom", user, (res)=>{
      if (res.ok) navigate("/")
    })
  }

  return (
    <div>
      <div className="App">
        <nav>
              <Button onClick={leaveRoom}className='back-button'>←</Button>
              <div className='nav-user'>{user.name}</div>
            </nav>
        <div>
          {messageList.length > 0 ? (
            <MessageContainer messageList={messageList} user={user} />
          ) : null}
        </div>
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default ChatPage