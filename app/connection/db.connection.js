require('dotenv').config();
const Sequlize = require('sequelize');
module.exports = new Sequlize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        dialect: process.env.POSTGRES_DIALECT
    }
);