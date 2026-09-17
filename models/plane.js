'use strict';
const { format } = require('sequelize/lib/utils');
const formatRupiah = require('../helper/rupiah')
const {Op} = require('sequelize')
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

    static async classFilter(value) {
      let data = ''
      if (value === "Business") {
        data = await Plane.findAll({
          where: {
            className : {
              [Op.iLike] : `%${value}%`
            }
          } 
        })
      } else {
        data = await Plane.findAll({
           where: {
            className : {
              [Op.iLike] : `%${value}%`
            }
          } 
        })
      }
      return data
    }
  }
  Plane.init({
    groupName: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    className:{
      type: DataTypes.STRING,
      allowNull: false 
    },
    totalSeat:{
      type: DataTypes.INTEGER,
      allowNull: false, 
      isZero(value) {
        if(value === 0) {
          throw new Error("Seat is full. Please choose another agent!")
        }
      }
    },
    price: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Plane',
  });

  
  return Plane;
};