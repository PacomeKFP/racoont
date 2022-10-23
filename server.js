const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const { userRoutes } = require("./routes/user.routes");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const { postRoutes } = require("./routes/post.routes");
const app = express();
const { PORT } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.get("/", (req, res) => res.send("Home route"));
app.get("/unAuth", (req, res) => res.send("not authenticated user"));
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});
app.use("/api/user", userRoutes);

app.use("/api/post", checkUser);
app.use("/api/post", postRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
