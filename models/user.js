const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

// eslint-disable-next-line no-useless-escape
const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/;
const dateRegexp = /^\d{2}-\d{2}-\d{4}$/;
const bloodList = [1, 2, 3, 4];
const sexList = ["male", "female"];
const levelActivityList = [1, 2, 3, 4, 5];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "John Doe"],
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
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
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
      required: true,
    },
    currentWeight: {
      type: Number,
      min: 35,
      required: true,
    },
    desiredWeight: {
      type: Number,
      min: 35,
      required: true,
    },
    // строку 65-76 можна видалити т.я.це буде оброблено перевіркою формату дати.
    // birthday: {
    // type: Date,
    // required: true,
    // validate: {
    //   validator: function (value) {
    //     // Перевірка, чи вік більше або рівний 18 рокам
    //     const age = (new Date() - value) / (1000 * 60 * 60 * 24 * 365); // Розрахунок віку в роках
    //     return age >= 18;
    //   },
    //   message: 'Ви повинні бути старше 18 років.',
    // },
    // },
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
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);
const User = model("user", userSchema);

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

  // birthday: Joi.date()
  //   .max("now")
  //   .iso()
  //   .required()
  //   .less("18 years")//тут была ошибка
  birthday: Joi.date()
    .max(
      new Date(
        new Date().setFullYear(new Date().getFullYear() - 18)
      ).toISOString()
    )
    .iso()
    .required()
    .custom((value, helpers) => {
      // Добавляем логирование перед валидацией
      console.log("Дата рождения перед валидацией:", value);

      // Проверка на возраст больше или равно 18 лет
      const age = (new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365); // Расчет возраста
      if (age >= 18) {
        return value; // Вернуть значение, если валидация успешна
      } else {
        return helpers.message("Ви повинні бути старше 18 років."); // Вернуть ошибку, если не прошла валидация
      }
    }),
  // birthday: Joi.string().pattern(dateRegexp).required(),
  blood: Joi.number()
    .valid(...bloodList)
    .required(),
  sex: Joi.string()
    .valid(...sexList)
    .required(),
  levelActivity: Joi.number()
    .valid(...levelActivityList)
    .required(),
});
const schemas = {
  registerSchema,
  loginSchema,
  userDataSchema,
};
module.exports = { User, schemas };
