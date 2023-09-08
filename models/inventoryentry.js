'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventoryEntry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InventoryEntry.init({
    inventoryId: DataTypes.STRING,
    assetId: DataTypes.STRING,
    amountChange: DataTypes.DECIMAL,
    transactionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InventoryEntry',
  });
  return InventoryEntry;
};