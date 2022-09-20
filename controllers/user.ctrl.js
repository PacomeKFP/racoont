const { UserModel } = require("../models/user.mdl");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This user Id is not valid : " + req.params.id);

  try {
    UserModel.findById(req.params.id, (err, docs) => {
      !err ? res.status(200).send(docs) : console.log(err);
    }).select("-password");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

module.exports.updateUser = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This user Id is not valid : " + req.params.id);

  try {
    UserModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { bio: req.body.bio } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        return !err
          ? res.status(201).send(docs)
          : res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

module.exports.deleteUser = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("This user Id is not valid : " + req.params.id);

  try {
    UserModel.remove({ _id: req.params.id }).exec();
    return res.status(201).send("Yo good deletion");
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

module.exports.follow = (req, res) => {
  console.log(req.body);
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToFollow)
  )
    return res.status(400).send("This user Id is not valid : ");
  try {
    //add to the follower list
    UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $addToSet: { following: req.body.idToFollow },
      },
      { new: true, upsert: true },
      (err, docs) => {
        console.log(docs);
        if (!err) res.status(201).json(docs);
        else return res.status(400).jsos(err);
      }
    );

    //add to the following list
    UserModel.findOneAndUpdate(
      { _id: req.body.idToFollow },
      {
        $addToSet: { followers: req.params.id },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(500).json(err);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

module.exports.unFollow = (req, res) => {
  console.log(req.body);
  if (
    !ObjectId.isValid(req.params.id) ||
    !ObjectId.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("This user Id is not valid : ");
  try {
    //add to the follower list
    UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { following: req.body.idToUnfollow },
      },
      { new: true, upsert: true },
      (err, docs) => {
        console.log(docs);
        if (!err) res.status(201).json(docs);
        else return res.status(400).jsos(err);
      }
    );

    //add to the following list
    UserModel.findOneAndUpdate(
      { _id: req.body.idToUnfollow },
      {
        $pull: { followers: req.params.id },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(500).json(err);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};
