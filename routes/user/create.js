const mongoose = require("mongoose");
require("../../models/users");
const User = mongoose.model("users");

function create(req, res, next) {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password
  };
  User.create(userData)
    .then(userData => {
      return res.json(201, {
        message: "User Created Successfully",
        data: userData
      });
    })
    .catch(err => {
      res.send({ message: err });
    });
}

module.exports = create;
