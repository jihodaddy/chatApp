const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller")
const roomController = require("../Controllers/room.controller")

module.exports = function(io){
  //sorket은 emit 말하는거, on 듣는거
  io.on("connection", async(socket)=>{
    console.log("client is connected", socket.id);
    socket.emit("rooms", await roomController.getAllRooms());

    socket.on("login", async(userName, cb)=>{
      // 유저 정보 저장
      try {
        const user = await userController.saveUser(userName, socket.id);
        // const welcomMessage = {
        //   chat: `${user.name} is joined to this room`,
        //   user: { id: null, name: 'system'}
        // }
        // io.emit("message", welcomMessage)
        cb({ok:true, data:user})
      } catch (error) {
        cb({ok:false, data: error.message})
      }
    })

    socket.on("sendMessage", async(receivedMessage, cb)=>{
      try {
        const user = await userController.checkUser(socket.id);
        if (user) {
          const message = await chatController.saveChat(receivedMessage, user);
          io.to(user.room.toString()).emit("message", message);
          return cb({ok:true, data:newMessage})
        }
      } catch (error) {
        cb({ok:false, data: error.message})
      }
    })

    socket.on("joinRoom", async(rid, cb)=>{
      try {
        const user = await userController.checkUser(socket.id);
        await roomController.joinRoom(rid, user);
        socket.join(user.room.toString())
        const welcomMessage = {
          chat: `${user.name} is joined to this room`,
          user: { id: null, name: "system" },
        }
        io.to(user.room.toString()).emit("message", welcomMessage);
        io.emit("rooms", await roomController.getAllRooms())
        cb({ok:true})
      } catch (error) {
        cb({ok:false, error:error.message})
      }
    })

    socket.on("leaveRoom", async(_, cb) => {
      try {
        const user = await checkUser(socket.id);
        await roomController.leaveRoom(user);
        const leaveMessage = {
          chat: `${user.name} left this room`,
          user: { id: null, name: "system" },
        };
        socket.broadcast.to(user.room.toString()).emit("message", leaveMessage); 
        io.emit("rooms", await roomController.getAllRooms());
        socket.leave(user.room.toString()); 
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, message: error.message });
      }
    })

    socket.on("disconnect", ()=>{
      console.log("user is disconnected")
    })
  });
}