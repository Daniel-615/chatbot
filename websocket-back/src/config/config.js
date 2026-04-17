const dotenv = require('dotenv');
dotenv.config();
const {
    DB_PORT, HOST, USER, PASSWORD, PORT, DB
} = process.env;

module.exports = {
    PORT,
    HOST,
    USER,
    PASSWORD,
    DB,
    DB_PORT,
};