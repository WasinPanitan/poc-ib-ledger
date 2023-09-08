'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Assets', [{
      id: 'BNB',
      network: 'BNB',
      currency: 'BNB',
      description: 'binance coin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 'BTC',
      network: 'BTC',
      currency: 'BTC',
      description: 'bitcoin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 'ETH',
      network: 'ETH',
      currency: 'ETH',
      description: 'etheruem',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 'USDT',
      network: 'USDT',
      currency: 'USDT',
      description: 'tether',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 'USDTB',
      network: 'BNB',
      currency: 'USDT',
      description: 'bnb usdt',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
