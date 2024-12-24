"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seguidor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuario, {
        foreignKey: "seguidor_id", // Usuario que sigue
        as: "seguidor",
      });
      this.belongsTo(models.Usuario, {
        foreignKey: "user_id", // Usuario que es seguido
        as: "seguido",
      });
    }
  }

  Seguidor.init(
    {
      user_id: DataTypes.INTEGER,
      seguidor_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Seguidor",
      tableName: process.env.TABLA_SEGUIDORES,
    },
  );
  return Seguidor;
};
