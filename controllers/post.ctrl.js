const { PostModel } = require("../models/post.mdl");
const { UserModel } = require("../models/user.mdl");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    return !err
      ? res.send(docs)
      : console.log(`Error occured when getting posts : ${err}`);
  }).sort({ createdAt: -1, updatedAt: -1 });
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
  ).catch((err) => res.status(400).send(`delete error :==> ${err}`));

  UserModel.findByIdAndUpdate(
    res.locals.user._id,
    {
      $addToSet: { likes: req.params.id },
    },
    { new: true }
  )
    .then((doc) => res.status(203).json(doc))
    .catch((err) => res.status(400).send(`delete error :==> ${err}`));
};

module.exports.unLikePost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This post Id is not valid : " + req.params.id);

  PostModel.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likers: res.locals.user._id },
    },
    { new: true }
  ).catch((err) => res.status(400).send(`delete error :==> ${err}`));

  UserModel.findByIdAndUpdate(
    res.locals.user._id,
    {
      $pull: { likes: req.params.id },
    },
    { new: true }
  )
    .then((doc) => res.status(203).json(doc))
    .catch((err) => res.status(400).send(`delete error :==> ${err}`));
};

module.exports.commentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This post Id is not valid : " + req.params.id);

  PostModel.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          commenterId: res.locals.user._id,
          commenterPseudo: res.locals.user.pseudo,
          text: req.body.text,
          timestamp: new Date().getTime(),
        },
      },
    },
    { new: true }
  )
    .then((doc) => res.status(201).json(doc))
    .catch((err) => res.status(400).send(`comment error :==> ${err}`));
};
module.exports.editCommentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This post Id is not valid : " + req.params.id);

  PostModel.findById(req.params.id)
    .then((docs) => {
      console.log(docs);
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );

      /// if the comment does bnot exist
      if (!theComment) return res.status(404).send("Comment not found");

      //else
      theComment.text = req.body.text;
      // PostModel(docs)
      docs
        .save()
        .then((docs) => res.status(201).json(docs))
        .catch((err) =>
          res
            .status(400)
            .send(`error occured when re-editing comment :==> ${err}`)
        );
    })
    .catch((err) =>
      res.status(400).send(`error occured when re-editing comment :==> ${err}`)
    );
};
module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This post Id is not valid : " + req.params.id);

  PostModel.findByIdAndUpdate(req.params.id, {
    $pull: { comments: { _id: req.body.commentId } },
  })
    .select(-{ comments: { _id: req.body.commentId } })
    .then((docs) => res.status(203).send(docs))
    .catch((err) =>
      res.status(400).send(`error occured when deleting comment :==> ${err}`)
    );
};
