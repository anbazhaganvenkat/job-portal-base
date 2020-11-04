const express = require("express");
const userRoute = express.Router();
const create  = require ("./create")


userRoute.post("/",  create);

module.exports = userRoute;