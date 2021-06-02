const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  // Email
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      res.status(400).send({ message: "¡Error! ¡Email está ya en uso!" });
      return;
    }
    next();
  });
};

checkUserIsAlreadyAdmin = (req, res, next) => {
  User.findById(req.params.id)
  .exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user) {
      if(user.roles.length>1){
        res.status(400).send({ message: "¡Error! ¡Usuario es un Admininstrador!" });
        return;
      }
    }
    next();
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `¡Error! ¡Rol ${req.body.roles[i]} no existe!`
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRolesExisted,
  checkUserIsAlreadyAdmin
};

module.exports = verifySignUp;