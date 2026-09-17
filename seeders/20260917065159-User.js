'use strict';
const fs = require('fs').promises
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = JSON.parse( await fs.readFile('./Data/Users.json', 'utf-8'))
    
    data = data.map(el => {
      return {
        userName: el.userName,
        password: bcrypt.hashSync(el.password, 10),
        email: el.email,
        role: el.role,
        UserProfileId: el.UserProfileId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await queryInterface.bulkInsert("Users", data, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
  }
};
