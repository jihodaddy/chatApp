import { useState,useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import RoomListPage from "./pages/RoomListPage/RoomListPage";
import ChatPage from "./pages/Chatpage/ChatPage";
import socket from "./server"


function App() {
  const [user, setUser] = useState(null)
  // const [message, setMessage] =  useState('')
  const [messageList, setMessageList] = useState([]);
  const [rooms, setRooms] = useState([]);

  // console.log(messageList)
  useEffect(() => {
    socket.on('message', (message)=>{
      setMessageList((prevState) => prevState.concat(message))
    })
    socket.on("rooms", (res)=>{
      setRooms(res);
    })
    askUserName()
  },[])

  const askUserName = () => {
    const userName = prompt("당신의 이름을 입력하세요.")
    console.log("이름", userName);

    socket.emit("login", userName, (res)=>{
      if (res?.ok) {
        console.log("login cb", res)
        setUser(res.data);
      }
    });
  }

  // const sendMessage = (event) => {
  //   event.preventDefault()
  //   setMessage('')
  //   socket.emit("sendMessage", message, (res)=>{
  //     console.log("sendMessage res", res);
  //   })
  // }
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<RoomListPage rooms={rooms} />} />
        <Route exact path="/room/:id" element={<ChatPage user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
