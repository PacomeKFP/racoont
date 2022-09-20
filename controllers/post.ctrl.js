const { PostModel } = require("../models/post.mdl");
const { UserModel } = require("../models/user.mdl");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    return !err
      ? res.send(docs)
      : console.log(`Error occured when getting posts : ${err}`);
  });
};

module.exports.getPost = (req, res) => {
  PostModel.findById(req.params.id, (err, docs) => {
    return !err
      ? res.send(docs)
      : console.log(`Error occured when getting posts : ${err}`);
  });
};
module.exports.createPost = (req, res) => {
  console.log(` local user :${res.locals.user}`);
  PostModel({
    /// posterId: req.body.posterId, // ce dernier n'est pas pris en compte
    //prendre le posterId directement dans le http.cookies
    posterId: res.locals.user._id,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  })
    .save()
    .then((post) => res.status(201).json(post))
    .catch((err) => res.status(400).json(err));
};
module.exports.updatePost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This user Id is not valid : " + req.params.id);

  PostModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        message: req.body.message,
      },
    },
    { new: true }
  )
    .then((doc) => res.status(201).json(doc))
    .catch((err) => console.log(`Update error :==> ${err}`));
};
module.exports.deletePost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This user Id is not valid : " + req.params.id);

  PostModel.findByIdAndRemove(req.params.id)
    .then((doc) => res.status(203).json(doc))
    .catch((err) => console.log(`delete error :==> ${err}`));
};

module.exports.likePost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This Post Id is not valid : " + req.params.id);

  PostModel.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likers: res.locals.user._id },
    },
    { new: true }
  )
    // .then((doc) => res.status(203).json(doc))
    .catch((err) => res.status(400).send(`delete error :==> ${err}`));

  UserModel.findByIdAndUpdate(
    res.locals.user._id,
    {
      $addToSet: { likers: req.params._id },
    },
    { new: true }
  )
    .then((doc) => res.status(203).json(doc))
    .catch((err) => res.status(400).send(`delete error :==> ${err}`));
};

module.exports.unLikePost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This user Id is not valid : " + req.params.id);
};
