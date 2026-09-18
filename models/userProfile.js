'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProfile.hasOne(models.User, {foreignKey: "UserProfileId"})
    }
  }
  UserProfile.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNum: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UserProfile',
  });

  return UserProfile;
};