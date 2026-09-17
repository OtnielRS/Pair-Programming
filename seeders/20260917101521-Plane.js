'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile('./Data/plane.json', 'utf-8'))

    data = data.map (el => {
      return {
        groupName: el.groupName,
        className: el.className,
        totalSeat: el.totalSeat,
        price: el.price,
        imageUrl : el.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await queryInterface.bulkInsert("Planes", data, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Planes", null, {})
  }
};
