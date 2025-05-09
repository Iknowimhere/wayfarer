import User from "../models/user.model.js";

class UserService {
  async create(req) {
    let newUser = await User.create(req.body);
    if (!newUser) {
      let err = new Error("User is not registered!!");
      err.statusCode = 400;
      throw err;
    }
    return newUser;
  }

  async findUserById(id) {
    let existingUser = await User.findById(id);
    if (!existingUser) {
      let err = new Error("User is not found!!");
      err.statusCode = 400;
      throw err;
    }
    return existingUser;
  }

  async findUserByEmail(req) {
    let { email } = req.body;
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      let err = new Error("User is not found!!");
      err.statusCode = 400;
      throw err;
    }
    return existingUser;
  }

  async findAllUsers() {
    let users = await User.find();
    if (!users) {
      let err = new Error("Users not found");
      err.statusCode = 404;
      throw err;
    }
    return users;
  }

  async updateUser(id, req) {
    let updatedUser=await User.findByIdAndUpdate(id,{displayPicture:req.file.path},{new:true})
    return updatedUser
  }
}

let userInstance = new UserService();

export default userInstance;