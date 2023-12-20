const express = require("express");
const dbConnect = require("./config/db");
const app = express();
const usersRouter = require("./routes/user.route");
const chatsRouter = require("./routes/chat.route");
const messagesRouter = require("./routes/message.route");
const friendsRouter = require("./routes/friends.route");
const cors = require("cors");

require("dotenv").config();
app.use(cors());
app.use(express.json());

dbConnect();

app.get("/*", (req, res) => {
  res.send("Error 404. Page Not Found");
});

app.use("/user", usersRouter);
app.use("/chat", chatsRouter);
app.use("/message", messagesRouter);
app.use("/friends", friendsRouter);

app.listen(3000, () => console.log("Listening on port 3000..."));
