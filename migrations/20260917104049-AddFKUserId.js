'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Bookings", "UserId", {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model:"Users",
        key:"id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Bookings", "UserId", {})
  }
};
