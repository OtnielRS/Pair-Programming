'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {foreignKey: "UserId"})
      Booking.hasOne(models.Ticket, {foreignKey: "BookingId"})
    }
  }
  Booking.init({
    jumlahTiket: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Jumlah required"
      }, 
      notEmpty: {
        msg: "Jumlah required"
      },
      MaxTwo(value) {
        if (value > 2 ) {
          throw new Error("Only 2 Maximum ticket per account")
        }
      }
    },
    },
    bandara: DataTypes.STRING,
    tanggalBerangkat: DataTypes.DATE,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};