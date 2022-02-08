const mongoose = require("mongoose");

require("dotenv").config();

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, connectOptions);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});