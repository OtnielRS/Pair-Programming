'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "UserProfileId", {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: "UserProfiles",
        key: "id"
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "UserProfileId", {})
  }
};
