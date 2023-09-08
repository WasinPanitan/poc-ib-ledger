'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LedgerEntries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ledgerId: {
        type: Sequelize.STRING
      },
      assetId: {
        type: Sequelize.STRING,
        references: {
          model: 'Assets',
          key: 'id'
        }
      },
      // ledgerId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'Ledgers',
      //     key: 'id'
      //   }
      // },
      type: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      transactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Transactions',
          key: 'id'
        }
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
    await queryInterface.dropTable('LedgerEntries');
  }
};