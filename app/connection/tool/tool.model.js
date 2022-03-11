const { DataTypes } = require("sequelize");
const DATABASE = require("./db");
module.exports = DATABASE.define("user",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
         unique: true
      },
      name: {
         type: DataTypes.STRING
      }
   }
);