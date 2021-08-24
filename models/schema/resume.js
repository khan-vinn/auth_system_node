const mongoose = require('mongoose');

const InstitutionLocationSchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
    minLength: 2,
  },
  city: {
    type: String,
    required: true,
    minLength: 4,
  },
  street: {
    type: String,
    required: true,
    minLength: 6,
  },
});

const EducationSchema = mongoose.Schema({
  institutionFullName: {
    type: String,
    required: true,
    minLength: 4,
  },
  location: {
    type: InstitutionLocationSchema,
    required: true,
  },
  year: {
    type: [Number],
    minLength: 2,
    maxLength: 2,
  },
});

const CompanySchema = mongoose.Schema({
  fullName: {
    type: String,
  },
  location: {
    type: InstitutionLocationSchema,
  },
  employeesCount: {
    type: Number,
  },
});

const ExperienceSchema = mongoose.Schema({
  comapany: {
    type: CompanySchema,
  },
  year: {
    type: [Number],
    minLength: 2,
    maxLength: 2,
  },
  responsibilities: {
    type: [String],
    minLength: 4,
  },
  skills: {
    type: [String],
  },
});

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
  },
  birthDate: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required: true,
    minLength: 40,
  },
  education: {
    type: [EducationSchema],
  },
  experiences: {
    type: [ExperienceSchema],
  },
});

const ResumeSchema = mongoose.Schema({
  belengs_to: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  user: {
    type: UserSchema,
  },
  file_location: {
    type: String,
  },
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } });

module.exports = ResumeSchema;
