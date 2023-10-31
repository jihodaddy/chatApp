const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller")

module.exports = function(io){
  //sorket은 emit 말하는거, on 듣는거
  io.on("connection", async(socket)=>{
    console.log("client is connected", socket.id);

    socket.on("login", async(userName, cb)=>{
      // 유저 정보 저장
      try {
        const user = await userController.saveUser(userName, socket.id);
        const welcomMessage = {
          chat: `${user.name} is joined to this room`,
          user: { id: null, name: 'system'}
        }
        io.emit("message", welcomMessage)
        cb({ok:true, data:user})
      } catch (error) {
        cb({ok:false, data: error.message})
      }
    })

    socket.on("sendMessage", async(message, cb)=>{
      try {
        //  socket id로 유저 찾기
        const user = await userController.checkUser(socket.id);
        // 메세지 저장
        const newMessage = await chatController.saveChat(message, user);
        io.emit("message", newMessage);
        cb({ok:true, data:newMessage})
      } catch (error) {
        cb({ok:false, data: error.message})
      }
    })

    socket.on("disconnect", ()=>{
      console.log("user is disconnected")
    })
  });
}