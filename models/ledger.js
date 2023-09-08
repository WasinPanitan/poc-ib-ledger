'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ledger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Ledger.belongsTo(models.App, { foreignKey: { name: 'appId' }});
      models.Ledger.belongsTo(models.Asset, { foreignKey: { name: 'assetId' }});
    }
  }
  Ledger.init({
    type: DataTypes.STRING,
    assetId: DataTypes.STRING,
    appId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ledger',
  });
  return Ledger;
};