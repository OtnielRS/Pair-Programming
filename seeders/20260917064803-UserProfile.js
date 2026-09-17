'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile("./Data/User_Profiles.json", "utf-8"))

    data = data.map(el => {
      return {
        firstName: el.firstName,
        lastName: el.lastName,
        phoneNum: el.phoneNum,
        address: el.address,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await queryInterface.bulkInsert("UserProfiles", data, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserProfiles", null, {})
  }
};
