'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mensaje extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuario, {
        targetKey: 'id',
        foreignKey: 'emisor',
        as: 'emisorUsuario',
      })

      this.belongsTo(models.Usuario, {
        foreignKey: 'receiver',
        as: 'receptorUsuario',
      })

      this.hasMany(models.Asset, {
        foreignKey: 'asset_id', 
        as: 'files', 
      });
    }
  }
  Mensaje.init({
    emisor: DataTypes.INTEGER,
    receptor: DataTypes.INTEGER,
    texto: DataTypes.STRING,
    leido: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Mensaje',
    tableName: process.env.TABLA_MENSAJE
  });
  return Mensaje;
};