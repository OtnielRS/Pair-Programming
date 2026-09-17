'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Tickets", "PlaneId", {
      type: Sequelize.DataTypes.INTEGER, 
      references : {
        model: "Planes",
        key: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tickets", "PlaneId", {})
  }
};
