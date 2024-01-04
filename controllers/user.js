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
  console.log(req.body);
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
  const { userId, P8ProfilePicture, OtherData } = req.body;
  const data = JSON.parse(OtherData);
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
    P8ProfileDescription,
  } = data;

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
  const { userId } = req.body;
  await User.find({ _id: userId })
    .then(async (response) => {
      console.log(response[0]);

      // const pipeline = [
      //   {
      //     $match: {
      //       $or: [
      //         {
                
      //             $eq: [response[0].age, response[0].partnerPreference.ageRange]
                
      //         },
      //         {
                
      //             $eq: [response[0].maritialStatus, response[0].partnerPreference.maritialPreference]
                
      //         },
      //         {
                
      //             $eq: [response[0].diet, response[0].partnerPreference.partnerDiet]
                
      //         },
      //         {
                
      //             $eq: [response[0].city, response[0].partnerPreference.partnerCity]
                
      //         },
      //         {
                
      //             $eq: [response[0].state, response[0].partnerPreference.partnerState]
                
      //         },
      //         {
                
      //             $eq: [response[0].religion, response[0].partnerPreference.partnerReligion]
                
      //         },
      //         {
                
      //             $eq: [response[0].community, response[0].partnerPreference.partnerCommunity]
                
      //         },
      //         {
                
      //             $eq: [response[0].familyType, response[0].partnerPreference.partnerFamilyType]
                
      //         },
      //         {
                
      //             $eq: [response[0].qualification, response[0].partnerPreference.partnerQualification]
                
      //         },
      //         {
                
      //             $eq: [response[0].profession, response[0].partnerPreference.partnerProfession]
                
      //         },
      //         {
                
      //             $eq: [response[0].annualIncome, response[0].partnerPreference.partnerAnnualIncome]
                
      //         },
      //       ],
      //       // $in: [response[0].hobby, ["Biking", "Dancing"]] ,
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 1, // Include the partner's ID in the result
      //       score: {
      //         $add: [
      //           // Calculate scores for the 11 parameters
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].age, response[0].partnerPreference.ageRange],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].maritialStatus, response[0].partnerPreference.maritialPreference],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].diet, response[0].partnerPreference.partnerDiet],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].city, response[0].partnerPreference.partnerCity],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].state, response[0].partnerPreference.partnerState],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].religion, response[0].partnerPreference.partnerReligion],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].community, response[0].partnerPreference.partnerCommunity],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].familyType, response[0].partnerPreference.partnerFamilyType],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].qualification, response[0].partnerPreference.partnerQualification],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].profession, response[0].partnerPreference.partnerProfession],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           {
      //             $cond: [
      //               {
                       
      //                   $:[response[0].annualIncome, response[0].partnerPreference.partnerAnnualIncome],
                      
      //               },
      //               10,
      //               0,
      //             ],
      //           },
      //           // { $cond: [{ $eq: ['$partnerPreference.param1', userPreferences.param1] }, 10, 0] },
      //           // { $cond: [{ $eq: ['$partnerPreference.param2', userPreferences.param2] }, 10, 0] },
      //           // ... (other 9 parameters)
      //           // Calculate score for the hobby parameter (up to 10 points)
      //           // {
      //           //   $cond: [
      //           //     {
      //           //       "partnerPreference.hobby": {
      //           //         $in: response[0].hobby,
      //           //       },
      //           //     },
      //           //     10,
      //           //     0,
      //           //   ],
      //           // },
      //         ],
      //       },
      //     },
      //   },
      //   {
      //     $sort: { score: -1 }, // Sort by score in descending order
      //   },
      // ];

      // 

      // await User.find(
      //   {
      //     $or: [
      //       {
      //         "partnerPreference.ageRange": {
      //           $in: response[0].partnerPreference.ageRange,
      //         },
      //       },
      //       {
      //         "partnerPreference.maritialPreference": {
      //           $in: response[0].partnerPreference.maritialPreference,
      //         },
      //       },
      //       {
      //         "partnerPreference.partnerDiet": {
      //           $in: response[0].partnerPreference.partnerDiet,
      //         },
      //       },
      //       {
      //         "partnerPreference.partnerCity": {
      //           $in: response[0].partnerPreference.partnerCity,
      //         },
      //       },
      //       {
      //         "partnerPreference.partnerState": {
      //           $in: response[0].partnerPreference.partnerState,
      //         },
      //       },
      //       {
      //         "partnerPreference.partnerReligion": {
      //           $in: response[0].partnerPreference.partnerReligion,
      //         },
      //       },
      //       {
      //         "partnerPreference.partnerCommunity": {
      //           $in: response[0].partnerPreference.partnerCommunity,
      //         },
      //       },
      //       {
      //         "partnerPreference.partnerFamilyType": {
      //           $in: response[0].partnerPreference.partnerFamilyType,
      //         },
      //       },
      //       {
      //         "partnerPreference.partnerQualification": {
      //           $in: response[0].partnerPreference.partnerQualification,
      //         },
      //       },
      //       {
      //         "partnerPreference.partnerProfession": {
      //           $in: response[0].partnerPreference.partnerProfession,
      //         },
      //       },
      //       {
      //         "partnerPreference.partnerAnnualIncome": {
      //           $in: response[0].partnerPreference.partnerAnnualIncome,
      //         },
      //       },
      //     ],
      //     'hobby': { $in: ["Biking","Dancing"] }
      //   },
      // )

      // await User.aggregate(pipeline)
      User.aggregate([
        {
          $match: {
            $or: [
              { age: { $in: response[0].partnerPreference.ageRange } },
              { maritialStatus: { $in: response[0].partnerPreference.maritialPreference } },
              { diet: { $in: response[0].partnerPreference.partnerDiet } },
              { city: { $in: response[0].partnerPreference.partnerCity } },
              { religion: { $in: response[0].partnerPreference.partnerReligion } },
              { community: { $in: response[0].partnerPreference.partnerCommunity } },
              { familyType: { $in: response[0].partnerPreference.partnerFamilyType } },
              { qualification: { $in: response[0].partnerPreference.partnerQualification } },
              { profession: { $in: response[0].partnerPreference.partnerProfession } },
              { annualIncome: { $in: response[0].partnerPreference.partnerAnnualIncome } },
              { hobby: { $in: response[0].hobby } }
            ]
          }
        },
        {
          $addFields: {
            partnerAge: { $cond: [{ $in: ['$age', response[0].partnerPreference.ageRange]}, 10, 0] },
            partnerMaritialStatus: { $cond:[{ $in: ['$maritialStatus', response[0].partnerPreference.maritialPreference ]}, 10,0] },
            partnerDiet: { $cond:[{ $in: ['$diet', response[0].partnerPreference.partnerDiet ]}, 10,0] },
            partnerCity: { $cond:[{ $in: ['$city', response[0].partnerPreference.partnerCity ]}, 10,0] },
            partnerReligion: { $cond:[{ $in: ['$religion', response[0].partnerPreference.partnerReligion ]}, 10,0] },
            partnerCommunity: { $cond:[{ $in: ['$community', response[0].partnerPreference.partnerCommunity ]}, 10,0] },
            partnerFamilyType: { $cond:[{ $in: ['$familyType', response[0].partnerPreference.partnerFamilyType ]}, 10,0] },
            partnerQualification: { $cond:[{ $in: ['$qualification', response[0].partnerPreference.partnerQualification ]}, 10,0] },
            partnerProfession: { $cond:[{ $in: ['$profession', response[0].partnerPreference.partnerProfession ]}, 10,0] },
            partnerAnnualIncome: { $cond:[{ $in: ['$annualIncome', response[0].partnerPreference.partnerAnnualIncome ]}, 10,0] },
            partnerHobby:{
              $sum:{
                $map:{
                  input:"$hobby",
                  as:'hobby',
                  in:{ $cond: [{ $in: ['$$hobby', response[0].hobby] }, 10, 0] },
                }
              }
            },
            totalScore: {
              $add: [
                { $cond:[{ $in: ['$age', response[0].partnerPreference.ageRange] }, 10, 0] },
                { $cond:[{ $in: ['$maritialStatus', response[0].partnerPreference.maritialPreference ]}, 10,0] },
                { $cond:[{ $in: ['$diet', response[0].partnerPreference.partnerDiet ]}, 10,0] },
                { $cond:[{ $in: ['$city', response[0].partnerPreference.partnerCity ]}, 10,0] },
                { $cond:[{ $in: ['$religion', response[0].partnerPreference.partnerReligion ]}, 10,0] },
                { $cond:[{ $in: ['$community', response[0].partnerPreference.partnerCommunity ]}, 10,0] },
                { $cond:[{ $in: ['$familyType', response[0].partnerPreference.partnerFamilyType ]}, 10,0] },
                { $cond:[{ $in: ['$qualification', response[0].partnerPreference.partnerQualification ]}, 10,0] },
                { $cond:[{ $in: ['$profession', response[0].partnerPreference.partnerProfession ]}, 10,0] },
                { $cond:[{ $in: ['$annualIncome', response[0].partnerPreference.partnerAnnualIncome ]}, 10,0] },
                {
                  $sum:{
                    $map:{
                      input:"$hobby",
                      as:'hobby',
                      in:{ $cond: [{ $in: ['$$hobby', response[0].hobby] }, 10, 0]},
                    }
                  }
                }
              ]
            }
          }
        },
        {
          $match: {
            totalScore: { $gte: 10 }
          }
        },
        {$project:{password:0,phone:0,partnerPreference:0,createdAt:0, updatedAt:0,__v:0}}
      ])

        .then((result) => {
          // console.log(result);
          // Add filtering to the result data for Match-Meter
          res.send({ message: result, error: false });
        })
        .catch((error) => res.send({ message: error, error: true }));
    })
    .catch((error) => res.send({ message: error, error: true }));
};

// === FAVOURITES ===
exports.setFavourites = (req, res) => {
  const { userId, favourites} = req.body;
  const data = JSON.parse(favourites);
  console.log("fav "+data)

  Favourite.create({
    userId: userId,
    favouriteUserId: data.favouriteUserId,
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
