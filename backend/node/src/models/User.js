const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  emailOptIn: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.statics.comparePassword = async function comparePassword(email, password) {
  const user = await this.findOne({ email });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
