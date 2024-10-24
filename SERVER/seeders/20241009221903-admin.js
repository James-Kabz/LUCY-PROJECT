"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require("bcrypt");

    // Hash the password
    const hashedPassword = await bcrypt.hash("@lucywanjiru254", 10);

    // Add seed commands here
    await queryInterface.bulkInsert(
      "users",
      [
        {
          roleId: 1,
          email: "lucy@gmail.com",
          password: hashedPassword, // Use the hashed password
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Add commands to revert seed here
    await queryInterface.bulkDelete("users", null, {});
  },
};
