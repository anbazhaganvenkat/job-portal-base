const mongoose = require("mongoose");

//Attributes of the User object
var usersSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String
    },
    phone: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value"
      }
    },
    password: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

mongoose.model("users", usersSchema);
