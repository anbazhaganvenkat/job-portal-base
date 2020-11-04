const express = require("express");
const rootRoute = express.Router();

/* GET api root */
rootRoute.get("/", (req, res, next) => {
    res.status(200).send("OK");
});

module.exports = rootRoute;