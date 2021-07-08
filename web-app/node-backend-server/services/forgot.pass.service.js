'use strict'

const db = require("../models");
const User = db.user;
const Token = db.resettoken;

var bcrypt = require("bcrypt");
const crypto = require("crypto");
const saltRounds = 10;
const sendEmail = require("../utils/email/sendEmail");

const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email does not exist");

    let token = await Token.findOne({ usuario: user._id });
    if (token) await token.deleteOne();
  
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(saltRounds));


    await new Token({
      usuario: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();
  
    const link = `gbapp.ddns.net/reset-password/token=${resetToken}&id=${user._id}`; ///token=${resetToken}&id=${user._id}
    sendEmail(
      user.email,
      "Password Reset Request",
      {
        name: user.nombre,
        link: link,
      },
      "./template/requestResetPassword.handlebars"
    );
    return link;
};

const resetPassword = async (userId, token, password) => {
    let passwordResetToken = await Token.findOne({ 'usuario': userId });
  
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
  
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
  
    const hash = await bcrypt.hash(password, Number(saltRounds));
  
    await User.updateOne(
      { _id: userId },
      { $set: { contraseña: hash } },
      { new: true }
    );
  
    const user = await User.findById({ _id: userId });
  
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.nombre,
      },
      "./template/resetPassword.handlebars"
    );
  
    await passwordResetToken.deleteOne();
  
    return true;
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
