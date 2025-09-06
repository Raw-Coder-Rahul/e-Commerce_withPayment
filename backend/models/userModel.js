import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [100, "Name cannot exceed 100 characters"],
    minlength: [2, "Name must be at least 2 characters"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {timestamps: true});

// Password Hashing
userSchema.pre("save", async function(next) {
  // 1st Updating Profile(name, email, image)
  // 2nd Updating Password
  this.password = await bcrypt.hash(this.password, 10);
  if (!this.isModified("password")) {
    return next();
  }
});

userSchema.methods.getJWTToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

userSchema.methods.verifyPassword = async function(userEnteredPassword) {
  return await bcrypt.compare(userEnteredPassword, this.password);
};

export default mongoose.model("User", userSchema);