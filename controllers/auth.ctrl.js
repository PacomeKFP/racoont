const {UserModel} = require("../models/user.mdl");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/errors.utils");

const maxAge = 3 * 24 * 3600 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signUp = (req, res) => {
  const { pseudo, email, password } = req.body;
  try {
    UserModel.create(req.body)
      .then((user) => {
        return res.status(201).json({ user: user._id });
      })
      .catch((err) => {
        const errors = signUpErrors(err);
        return res.status(403).json(errors);
      });
    //
  } catch (err) {
    const errors = signUpErrors(err);
    return res.status(403).json(errors);
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  UserModel.login(email, password)
    .then((user) => {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge });
      return res.status(200).json({ user : user._id });
    })
    .catch((err) => {
      return res.status(500).json(signInErrors(err));
    });
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
