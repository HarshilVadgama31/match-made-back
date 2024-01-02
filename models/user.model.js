const mongoose = require("mongoose");

const user = mongoose.Schema(
	{
		phone: Number,
		gender: String,
		email: String,
		password:String,
		firstName: String,
		lastName: String,
		age: String,
		height: String,
		weight: String,
		dob: Date,
		pob: String,
		city: String,
		state: String,
		religion: String,
		community: String,
		motherTongue: String,
		familyType: String,
		familyCity: String,
		qualification: String,
		university: String,
		profession: String,
		organization: String,
		annualIncome: String,
		maritialStatus: String,
		diet: String,
		hobby: Array,
		partnerPreference: {
			ageRange: Array,
			maritialPreference: Array,
			partnerDiet: Array,
			partnerCity: Array,
			partnerState: Array,
			partnerReligion: Array,
			partnerCommunity: Array,
			partnerFamilyType: Array,
			partnerQualification: Array,
			partnerProfession: Array,
			partnerAnnualIncome: Array,
		},
    profilePicture: String,
    profileEmail: String,
    profileDescription: String,
	},
	{
		timestamps: true,
	}
);

// const user = new Schema({
// 	P1FirstName: String,
// 	P1LastName: String,
// 	P1Age: Number,
// 	P1Height: Number,
// 	P1Weight: Number,
// 	P1Dob: Date,
// 	P1Pob: String,
// 	P1City: String,
// 	P1State: String,
// 	P2Religion: String,
// 	P2Community: String,
// 	P2MotherTongue: String,
// 	P2FamilyType: String,
// 	P2FamilyCity: String,
// 	P3Qualification: String,
// 	P3University: String,
// 	P3Profession: String,
// 	P3Organization: String,
// 	P3AnnualIncome: String,
// 	P4MaritialStatus: String,
// 	P4Diet: String,
// 	P4Hobby: Array,
// 	P5AgeRange: [],
// 	P5MaritialPreference: [],
// 	P5PartnerDiet: [],
// 	P5PartnerCity: [],
// 	P5PartnerState: [],
// 	P6PartnerReligion: [],
// 	P6PartnerCommunity: [],
// 	P6PartnerFamilyType: [],
// 	P7PartnerQualification: [],
// 	P7PartnerProfession: [],
// 	P7PartnerAnnualIncome: [],
// });

// user.pre("save", async () => {
// 	console.log(this.password);
// 	this.password = await bcrypt.hash(this.password, 12);
// });

module.exports = mongoose.model("User", user);
