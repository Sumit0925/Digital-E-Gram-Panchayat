const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//* Register User Logic
const register = async (req, res) => {
  const { userName, email, password, role } = req.body;

  try {
    const userExist = await User.findOne({ email });
    const userNameExist = await User.findOne({ userName });

    if (userExist) {
      return res.json({
        success: false,
        msg: "User Already Exist !",
        description: "Try again with another Email",
      });
    }

    if (userNameExist) {
      return res.json({ success: false, msg: "Try Another User Name !" });
    }

    const saltRound = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, saltRound);

    const newUser = new User({
      userName,
      email,
      passwordHash: hashPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      msg: "Registeration Successfull !!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

//* Login User Logic

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.json({
        success: false,
        msg: "User doesn't Exist !!",
      });
    }

    const checkPasswordValid = await bcrypt.compare(
      password,
      userExist.passwordHash
    );

    if (!checkPasswordValid) {
      return res.json({ success: false, msg: "Incorrect Password !" });
    }

    const token = jwt.sign(
      {
        id: userExist._id,
        role: userExist.role,
        email: userExist.email,
        userName: userExist.userName,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      msg: "Logged In Successfully !",
      token,
      user: {
        email: userExist.email,
        id: userExist._id,
        userName: userExist.userName,
      },
      role: userExist.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

module.exports = { register, login };
