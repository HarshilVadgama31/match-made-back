const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Favourite = require("../models/favourites.model");
const bcrypt = require("bcrypt");

const findUsers = async (id) => {
  let result = {};
  // console.log(id);

  await User.findById(id)
    .then((response) => (result = response.toJSON()))
    .catch((error) => error);

  // console.log(result);
  return result;
};

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
};

exports.createUser = async (req, res, next) => {
  // console.log("Response from the FE: " + req.body.P1Dob);
  console.log(req.body)
  const { phone, gender, email, password } = req.body;

	const user = await User.findOne({ phone });
	if (user) return res.json({ message: "User already exists", error: false });

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

  await User.create({
    phone: phone,
    gender: gender,
    email: email,
    password: hashedPassword,
  })
  .then((response) => {
    const token = generateToken(response._id);
    console.log(token);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    response.password = null;
    response.partnerPreference = null;
    response._id = null;

    res.status(200).json({
      message: response,
      error: false,
    });
    next();
  })
  .catch((error) => {
    res.send({ message: error, error: true });
  });
};

exports.loginUser = async (req, res, next) => {
	const { phone, password } = req.body;

	if (!phone || !password) {
		return res.json({ message: "All fields are required" });
	}
	await User.findOne({ phone }).then(async (response) => {
		if (!response) {
			return res.json({
				message: "Incorrect password or phone number",
				error: false,
			});
		}

		const auth = await bcrypt.compare(password, response.password);
		if (!auth) {
			return res.json({
				message: "Access Denied. Incorrect password or phone number",
				error: false,
			});
		}

		const token = generateToken(response);
		res.cookie("token", token, {
			withCredentials: true,
			httpOnly: false,
		});

		response.password = null;
		response.partnerPreference = null;
		response._id = null;

		res.status(200).json({
			message: response,
			error: false,
		});

		next();
	});
	// const auth = await bcrypt.compare(password, user.password);
	// if (!auth) {
	// 	res.json({ message: "Incorrect password or email" });
	// }
};

exports.updateUser = async (req, res) => {
  const {userId,P8ProfilePicture,OtherData} = req.body;
  console.log(req.body);
  const {
    P1FirstName,
    P1LastName,
    P1Age,
    P1Height,
    P1Weight,
    P1Dob,
    P1Pob,
    P1City,
    P1State,
    P2Religion,
    P2Community,
    P2MotherTongue,
    P2FamilyType,
    P2FamilyCity,
    P3Qualification,
    P3University,
    P3Profession,
    P3Organization,
    P3AnnualIncome,
    P4MaritialStatus,
    P4Diet,
    P4Hobby,
    P5AgeRange,
    P5MaritialPreference,
    P5PartnerDiet,
    P5PartnerCity,
    P5PartnerState,
    P6PartnerReligion,
    P6PartnerCommunity,
    P6PartnerFamilyType,
    P7PartnerQualification,
    P7PartnerProfession,
    P7PartnerAnnualIncome,
    P8ProfileEmail,
    P8ProfileDescription
  } = OtherData;

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        firstName: P1FirstName,
        lastName: P1LastName,
        age: P1Age,
        height: P1Height,
        weight: P1Weight,
        dob: P1Dob,
        pob: P1Pob,
        city: P1City,
        state: P1State,
        religion: P2Religion,
        community: P2Community,
        motherTongue: P2MotherTongue,
        familyType: P2FamilyType,
        familyCity: P2FamilyCity,
        qualification: P3Qualification,
        university: P3University,
        profession: P3Profession,
        organization: P3Organization,
        annualIncome: P3AnnualIncome,
        maritialStatus: P4MaritialStatus,
        diet: P4Diet,
        hobby: P4Hobby,
        partnerPreference: {
          ageRange: P5AgeRange,
          maritialPreference: P5MaritialPreference,
          partnerDiet: P5PartnerDiet,
          partnerCity: P5PartnerCity,
          partnerState: P5PartnerState,
          partnerReligion: P6PartnerReligion,
          partnerCommunity: P6PartnerCommunity,
          partnerFamilyType: P6PartnerFamilyType,
          partnerQualification: P7PartnerQualification,
          partnerProfession: P7PartnerProfession,
          partnerAnnualIncome: P7PartnerAnnualIncome,
        },
        profilePicture: P8ProfilePicture,
        profileEmail: P8ProfileEmail,
        profileDescription: P8ProfileDescription,
      },
    }
  )
    .then((response) => {
      res.send(JSON.stringify({ message: response, error: false }));
    })
    .catch((error) => {
      res.send(JSON.stringify({ message: error, error: true }));
    });
};

exports.updateUser2 = async (req, res) => {
  const { userId, P1FirstName, P1LastName } = req.body;

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        firstName: P1FirstName,
        lastName: P1LastName,
      },
    }
  )
    .then((response) => {
      res.send({ data: response, error: false });
    })
    .catch((error) => {
      res.send({ data: error, error: true });
    });
};


// === MATCH-FEED ===
exports.findMatch = async (req, res) => {
  const {id} = req.body;

  await User.find({_id:id})
    .then((response) => res.send({ message: response, error: false }))
    .catch((error) => res.send({ message: error, error: true }));
};

// === FAVOURITES ===
exports.setFavourites = (req, res) => {
  const { userId, favouriteUserId } = req.body;

  Favourite.create({
    userId: userId,
    favouriteUserId: favouriteUserId,
  })
    .then((response) => {
      res.send({ message: response, error: false });
    })
    .catch((error) => {
      res.send({ message: error, error: true });
    });
};

exports.favourites = (req, res) => {
  const { userId } = req.body;

  Favourite.find({
    userId: userId,
  })
    .then(async (response) => {
      const usersData = await Promise.all(
        response.map(async (request) => {
          const receiverUserData = await findUsers(request.favouriteUserId);

          return receiverUserData;
        })
      );
      res.send({ message: usersData, error: false });
    })
    .catch((error) => {
      res.send({ message: error, error: true });
    });
};
