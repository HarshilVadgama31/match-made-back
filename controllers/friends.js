const Friends = require("../models/friends.model");
const User = require("../models/user.model");

const findUsers = async (id) => {
 
  let result = {};
  // console.log(id);

  await User.findById(id)
    .then((response) => (result = response.toJSON()))
    .catch((error) => error);

  // console.log(result);
  return result;
};

exports.sentRequests = async (req, res) => {
  const { userId } = req.body;

  await Friends.find({
    senderId: userId,
  })
    .then(async (response) => {
      // let newResponse = response.map(findUsers);
      const usersData = await Promise.all(
        response.map(async (request) => {
          const receiverUserData = await findUsers(request.receiverId);
          // receiverUserData = {...receiverUserData, status:response.status}
          receiverUserData["status"] = request.status;

          return receiverUserData;
        })
      );
      res.status(200).send({ message: usersData, error: false });
    })
    .catch((error) => res.status(500).send({ message: error, error: true }));
};

exports.sendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  await Friends.create({
    senderId: senderId,
    receiverId: receiverId,
    status: "Pending",
  })
    .then((response) =>
      res.status(200).send({ message: response, error: false })
    )
    .catch((error) => res.status(500).send({ message: error, error: true }));
};

exports.receivedRequests = async (req, res) => {
  const { receiverId } = req.body;
  await Friends.find({
    receiverId: receiverId,
    status: "Pending",
  })
    .then(async (response) => {
      const usersData = await Promise.all(
        response.map(async (request) => {
          const receiverUserData = await findUsers(request.senderId);
          // receiverUserData = {...receiverUserData, status:response.status}
          receiverUserData["status"] = request.status;

          return receiverUserData;
        })
      );
      res.status(200).send({ message: usersData, error: false });
    })
    .catch((error) => res.status(500).send({ message: error, error: true }));
};

exports.updateRequest = async (req, res) => {
  const { requestId, status } = req.body;
  await Friends.updateOne(
    { _id: requestId },
    {
      status: status,
    }
  )
    .then((response) =>
      res.status(200).send({ message: response, error: false })
    )
    .catch((error) => res.status(500).send({ message: error, error: true }));
};
