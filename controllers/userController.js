const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//  @desc get allUsers
// @route GET /users
// @access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No User Found" });
  }
  return res.json(users);
});

//  @desc get allUsers
// @route POST /users
// @access private
const createNewUser = asyncHandler(async (req, res) => {
  const { userName, password, roles } = req.body;
  //confirm data
  if (!userName || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check for duplidate
  const duplicate = await User.findOne({ userName }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Record found" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const userObj = {
    userName: userName,
    password: hashedPwd,
    roles: roles,
  };

  const user = await User.create(userObj);

  if (user) {
    return res.status(201).json({ message: `User ${user.userName} Created` });
  } else {
    return res.status(400).json({ message: "Invalid Data Received" });
  }
});
//  @desc get allUsers
// @route PUT /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
  const { id, userName, password, roles, isActive } = req.body;
  if (
    !id ||
    !userName ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof isActive !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const duplicate = await User.findOne({ userName }).lean().exec();

  if (duplicate && duplicate?._id !== id) {
    return res.status(409).json({ message: "Duplicate UserName" });
  }

  user.userName = userName;
  user.roles = roles;
  user.isActive = isActive;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  return res.json({ message: `user updated ${user.userName}` });
});
//  @desc get allUsers
// @route DELETE /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const result = await User.deleteOne();

  const reply = `Username ${user.userName} with ID ${id} deleted`;
  return res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
