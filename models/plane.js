'use strict';
const { format } = require('sequelize/lib/utils');
const formatRupiah = require('../helper/rupiah')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Plane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Plane.belongsToMany(models.Booking, {through: "Tickets"})
      Plane.hasOne(models.Ticket, {foreignKey: "PlaneId"})
    }

    get changeToRupiah(){
      return formatRupiah(this.price)
    }
  }
  Plane.init({
    groupName: DataTypes.STRING,
    className: DataTypes.STRING,
    totalSeat: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Plane',
  });
  return Plane;
};