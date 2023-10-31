import "./App.css";
import InputField from "./components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";
import socket from "./server";
import {useEffect, useState} from  "react"

function App() {
  const [user, setUser] = useState(null)
  const [message, setMessage] =  useState('')
  const [messageList, setMessageList] = useState([]);

  console.log(messageList)
  useEffect(() => {
    socket.on('message', (message)=>{
      setMessageList((prevState) => prevState.concat(message))
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

  const sendMessage = (event) => {
    event.preventDefault()
    setMessage('')
    socket.emit("sendMessage", message, (res)=>{
      console.log("sendMessage res", res);
    })
  }
  return (
    <div>
      <div className="App">
        <MessageContainer messageList={messageList} user={user}/>
        <InputField message={message} setMessage={setMessage} sendMessage={sendMessage}/>
      </div>
    </div>
  );
}

export default App;
