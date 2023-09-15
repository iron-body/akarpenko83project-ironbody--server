const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

// eslint-disable-next-line no-useless-escape
const emailRegex =  /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/;
const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;
const bloodList = [1, 2, 3, 4];
const sexList = ["male", "female"];
const levelActivityList = [1, 2, 3, 4, 5]

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'John Doe'],
    },
    email: {
      type: String,
      matchMedia: emailRegex,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      // ? перевіріті паттерн для пассв
      matchMedia: passwordRegex,
      minlength: 6,
      required: true,
    },
    // subscription: {
    //   type: String,
    //   enum: ['starter', 'pro', 'business'],
    //   default: 'starter',
    // },
    token: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      min: 150,
      required:true,
    },
    currentWeight: {
      type: Number,
      min: 35,
      required:true,
    },
    desiredWeight: {
      type: Number,
      min: 35,
      required:true,
    },
    birthday: {
        type: String,
      match: dateRegexp,
      // ! add checking - older 18 years
      requered: true,
    },
    
    blood: {
      type: Number,
      enum: bloodList,
      requered: true,
    },
    sex: {
      type: String,
      enum: sexList,
      requered: true,
    },
    levelActivity: {
      type: Number,
      enum: levelActivityList,
      requered: true,
    },


  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handleMongooseError);
const User = model('user', userSchema);

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().pattern(passwordRegex).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().pattern(passwordRegex).required(),
});
const userDataSchema = Joi.object({
  height: Joi.number().min(150).required(),
  
    currentWeight: Joi.number().min(30).required(),
    desiredWeight: Joi.number().min(30).required(),

   // ! add checking - older 18 years

  birthday: Joi.string().pattern(dateRegexp).required(),
    blood: Joi.number().valid(...bloodList).required(),
    sex: Joi.string().valid(...sexList).required(),
    levelActivity: Joi.number().valid(...levelActivityList).required(),
  
})
const schemas = {
  registerSchema,
  loginSchema,
  userDataSchema

};
module.exports = { User, schemas };
