const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
};

exports.createUser = async (req, res, next) => {
  console.log("Response from the FE: " + req.body.P1Dob);
  res.send({});
  const { phone, gender, email, password } = req.body;

  await User.create({
    phone: phone,
    gender: gender,
    email: email,
    password: password,
  })
    .then((response) => {
      const token = generateToken(response);
      console.log(token);
      res.send({ message: response, token: token, error: false });
    })
    .catch((error) => {
      res.send({ message: error, error: true });
    });
};

exports.updateUser = async (req, res) => {
  const {
    userId,
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
  } = req.body;

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
