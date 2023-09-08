'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LedgerEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LedgerEntry.init({
    ledgerId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    transactionId: DataTypes.INTEGER,
    assetId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'LedgerEntry',
  });
  return LedgerEntry;
};