'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Swaps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fromAssetId: {
        type: Sequelize.STRING,
        references: {
          model: 'Assets',
          key: 'id'
        }
      },
      fromAppId: {
        type: Sequelize.STRING
      },
      // fromAppId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'Apps',
      //     key: 'id'
      //   }
      // },
      fromAmount: {
        type: Sequelize.DECIMAL
      },
      toAssetId: {
        type: Sequelize.STRING,
        references: {
          model: 'Assets',
          key: 'id'
        }
      },
      toAppId: {
        type: Sequelize.STRING,
      },
      // toAppId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: 'Apps',
      //     key: 'id'
      //   }
      // },
      toAmount: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('Swaps');
  }
};