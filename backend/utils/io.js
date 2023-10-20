const userController = require("../Controllers/user.controller")

module.exports = function(io){
  //sorket은 emit 말하는거, on 듣는거
  io.on("connection", async(socket)=>{
    console.log("client is connected", socket.id);

    socket.on("login", async(userName, cb)=>{
      // 유저 정보 저장
      try {
        const user = await userController.saveUser(userName, socket.id);
        cb({ok:true, data:user})
      } catch (error) {
        cb({ok:false, data: error.message})
      }
    })

    socket.on("disconnect", ()=>{
      console.log("user is disconnected")
    })
  });
}