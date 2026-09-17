'use strict';
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
const userProfile = require('./userProfile');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.UserProfile, {foreignKey: "UserProfileId"})
      User.hasOne(models.Booking, {foreignKey: "UserId"})
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull : false, 
      validate : {
        notEmpty: {
          msg : "Please Insert Username"
        },
        notNull: {
          msg : "Please Insert Username"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull : false, 
      validate : {
        notEmpty: {
          msg : "Please Insert Password"
        },
        notNull: {
          msg : "Please Insert Password"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull : false,
      unique: true, 
      validate : {
        notEmpty: {
          msg : "Please Insert Email"
        },
        notNull: {
          msg : "Please Insert Email"
        }
      }
    },
    role: DataTypes.STRING,
    UserProfileId: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(model => {
    model.password = bcrypt.hashSync(model.password, 10)
  })
  return User;
};