const jwt = require("jsonwebtoken");
const {UserModel} = require("../models/user.mdl");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        return res.status(500).send("An erro occured");
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        // console.log(user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.redirect("/unAuth");
  }
};
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        // console.log(decodedToken.id);
        console.log('logged In');
        next();
      }
    });
  } else {
    console.log("no token");
    res.locals.user = null;
    // res.redirect("/");
    next();
  }
};
