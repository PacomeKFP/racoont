var mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_PASS}@racoontcluster.owpcevc.mongodb.net/racoont`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB\n", err));


