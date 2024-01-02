const Chat = require("../models/chat.model");

exports.createChat = async (req, res) => {
  const { senderId, receiverId } = req.body;

  await Chat.create({
    users: [senderId, receiverId],
  })
    .then((response) =>
      res.status(200).send({ message: response, error: false })
    )
    .catch((error) => res.status(400).send({ message: error, error: true }));
};

exports.getChat = async (req, res) => {
  const { senderId, receiverId } = req.body;
  await Chat.find({
    senderId: senderId,
    receiverId: receiverId,
  }).then((response) => {
    res
      .status(200)
      .send({ message: response, error: false })
      .catch((error) => {
        res.status(400).send({ message: error, error: true });
      });
  });
};
