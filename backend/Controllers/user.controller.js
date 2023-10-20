const User = require("../Models/user")
const userController = {}

userController.saveUser=async(userName, sid)=>{
  // 유저 확인
  let user = await User.findOne({name: userName})
  // 신규 등록
  if (!user) {
    user = new User({
      name: userName,
      token: sid,
      online: true
    })
  }
  // 이미 있는 유저는 token 값 변경
  user.token = sid;
  user.online = true;

  await user.save()
  return user;
}

module.exports = userController