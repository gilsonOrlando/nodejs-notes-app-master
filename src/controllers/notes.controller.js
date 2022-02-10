import Note from "../models/Note";
const accountSid = 'AC5fa50f01eefb741eb80eb94292239afe';
const authToken = '7e11b89c0f0eecf1bb322a230ba7978d'; 
const client = require('twilio')(accountSid, authToken); 

const cloudinary  = require("cloudinary");
cloudinary.config({
  cloud_name: "cuarteto-dinamico",
  api_key: "912639123142587",
  api_secret: "X8dFJvvbfP2vaYxJBU9Kr-Fswqo"
});
const fs = require("fs-extra");
export const renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};

export const createNewNote = async (req, res) => {
  const { title, description ,number} = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Please Write a Title." });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      description,
    });
  } else {
    ///aqi
      try {
  const auxi=number.substring(1, number.length)
  console.log(auxi);
        const response = await client.messages.create({
            body: description, 
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:'+"593"+auxi 
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }

    //
    const subirImagen= await cloudinary.v2.uploader.upload(req.file.path);

    const newNote = new Note({ title, description,image: subirImagen.url, public_id:subirImagen.public_id});
    newNote.user = req.user.id;
    
    await newNote.save();
    await fs.unlink(req.file.path);
    req.flash("success_msg", "Note Added Successfully");
    res.redirect("/notes");
  }
};

export const renderNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.render("notes/all-notes", { notes });
};

export const renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  if (note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
};

export const updateNote = async (req, res) => {
  const imagenEdit= await cloudinary.v2.uploader.upload(req.file.path);

  const { title, description } = req.body;
  
  await Note.findByIdAndUpdate(req.params.id, { title, description, image: imagenEdit.url, public_id:imagenEdit.public_id});

  await cloudinary.v2.uploader.destroy(req.params.public_id);

  req.flash("success_msg", "Note Updated Successfully");
  res.redirect("/notes");
};

export const deleteNote = async (req, res) => {
 const as= await Note.findByIdAndDelete(req.params.id);
  
  await cloudinary.v2.uploader.destroy(as.public_id);

  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/notes");
};
