const dotenv = require("dotenv");
dotenv.config();

module.exports = Object.freeze({
    PORT: process.env.PORT,
    MONGODB: process.env.MONGODB,
});