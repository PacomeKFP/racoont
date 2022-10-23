const { UserModel } = require("../models/user.mdl");
const fs = require("fs");
const { promisify } = require("util");
const { uploadErrors } = require("../utils/errors.utils");
const pipeline = promisify(require("stream").pipeline);

module.exports.uploadProfil = (req, res) => {
  try {
    const type = req.file.detectedMimeType;
    if (type !== "image/jpg" && type !== "image/png" && type !== "image/jpeg")
      throw Error("Invalid file format");
    console.log(req.file);
    if (req.file.size > 500000) throw Error("File size not allowed");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(400).json(errors);
  }
  const fileName = res.locals.user.pseudo + ".jpg";

  pipeline(
    req.file.stream,
    fs.createWriteStream(
      __dirname + "/../client/public/uploads/profil/" + fileName,
      req.file.stream
    )
  );

  return res.send("yo");
};

module.exports.dir = (req, res) => res.send(__dirname);
