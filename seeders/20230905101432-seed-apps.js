'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Apps', [{
      name: 'hashpays',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'ironbank',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'worpt',
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
