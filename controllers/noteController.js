const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

//  @desc get allNotes
// @route GET /notes
// @access private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({});

  if (!notes?.length) {
    return res.status(400).json({ message: "No Note Found" });
  }
  return res.json(notes);
});

//  @desc POST note
// @route POST /notes
// @access private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text, completed } = req.body;
  //confirm data
  if (!user || !title || text|| typeof completed !=="boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  //check for duplidate
  const duplicate = await User.findOne({ title }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Record found" });
  }

  const noteObj = {
    user: user.id,
    title: title,
    text: text,
    completed: completed
  };

  const note = await Note.create(noteObj);

  if (note) {
    return res.status(201).json({ message: `User ${note.title} Created` });
  } else {
    return res.status(400).json({ message: "Invalid Data Received" });
  }
});
//  @desc get allUsers
// @route PUT /users
// @access private
const updateNote = asyncHandler(async (req, res) => {
    const { user, title, text, completed } = req.body;
    if (!id||!user || !title || text|| typeof completed !=="boolean") {
        return res.status(400).json({ message: "All fields are required" });
      }

  const note = await User.findById(id).exec();

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  const duplicate = await User.findOne({ title }).lean().exec();

  if (duplicate && duplicate?._id !== id) {
    return res.status(409).json({ message: "Duplicate Note" });
  }
  user = user.id,
  title = title,
  text = text,
  completed= completed
  
  const updatedNote = await note.save();
  return res.json({ message: `Note updated ${note.title}` });
});
//  @desc get allUsers
// @route DELETE /users
// @access private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Note ID Required" });
  }

  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const checkNote = await Note.findById(id).exec();

  if (!checkNote) {
    return res.status(404).json({ message: "Note not found" });
  }
  const result = await Note.deleteOne();

  const reply = `Username ${Note.title} with ID ${id} deleted`;
  return res.json(reply);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
