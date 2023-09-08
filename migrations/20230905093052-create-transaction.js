'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      refType: {
        type: Sequelize.STRING
      },
      refId: {
        type: Sequelize.INTEGER
      },
      fromAssetId: {
        type: Sequelize.STRING,
        references: {
          model: 'Assets',
          key: 'id'
        }
      },
      fromAmount: {
        type: Sequelize.DECIMAL,
      },
      toAssetId: {
        type: Sequelize.STRING,
        references: {
          model: 'Assets',
          key: 'id'
        }
      },
      toAmount: {
        type: Sequelize.DECIMAL,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};