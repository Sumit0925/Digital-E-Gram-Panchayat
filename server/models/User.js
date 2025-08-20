const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true, // removes leading/trailing spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, //* automatically converts to lowercase
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "staff", "officer"],
      //*only allowed values are "user", "staff", or "officer". If someone tries "admin" or "manager", it will fail.
      default: "user",
    },
    profileDetails: {
      type: Object,
      default: {}, //* ensure it’s always at least an empty object
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", UserSchema);

module.exports = User;
