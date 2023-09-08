'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ManualOperation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ManualOperation.init({
    type: DataTypes.STRING,
    assetId: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    price: DataTypes.DECIMAL,
    costPrice: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'ManualOperation',
  });
  return ManualOperation;
};