'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Swap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Swap.init({
    fromAssetId: DataTypes.STRING,
    fromAppId: DataTypes.STRING,
    // fromAppId: DataTypes.INTEGER,
    fromAmount: DataTypes.DECIMAL,
    toAssetId: DataTypes.STRING,
    toAppId: DataTypes.STRING,
    // toAppId: DataTypes.INTEGER,
    toAmount: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Swap',
  });
  return Swap;
};