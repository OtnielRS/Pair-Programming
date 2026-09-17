const {UserProfile, User, Booking, Plane, Ticket} = require('../models')
const {Op} = require('sequelize')
const fs = require('fs').promises
const formatRupiah = require('../helper/rupiah')


class CreateTicket{

    static async profile(req, res) {
        try {
            // console.log(req.session.user.id);
            const user = req.session.user
            const id = user.id
            let data = await UserProfile.findOne({
                where: {
                    id: id
                }
            })

            let history = await Booking.findAll({
                where : {
                    UserId: id
                }
            })
            // console.log(data);
            // res.send(data)
            res.render('createTicket/profile', {user, data, history})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async getCreateBooking(req, res) {
        try {
            const {user} = req.session
            let dataBandara = JSON.parse(await fs.readFile("./Data/bandara_indonesia.json"))
            // console.log(dataBandara);
            res.render('createTicket/booking', {user, dataBandara})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async postCreateBooking (req,res) {
        try {
            let {jumlahTiket, bandara, tanggalBerangkat} = req.body
            const UserId = req.session.user.id
            let newBooking = await Booking.create({
                jumlahTiket, bandara, tanggalBerangkat, UserId
            })
            await Ticket.create({
                BookingId: newBooking.id
            })

            req.session.bookingId = newBooking.id
            res.redirect('/booking/add/plane')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    // pilih pesawat

    static async getPlane(req,res) {
        try {
            const dataPlane = await Plane.findAll({})
            res.render('createTicket/plane', {dataPlane})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    // confirmation 

    static async getConfirmation(req, res) {
        try {
           const {id} = req.params 
           const dataPesawat = await Plane.findByPk(id)
           
           res.render('createTicket/confirmation', {dataPesawat, id})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async postConfirmation(req,res) {
        try {
            const bookingId = req.session.bookingId
            const {id} = req.params
            let dataTicket = await Ticket.findOne( {
                where : {
                    BookingId : bookingId
                }
            })

            await dataTicket.update({
                PlaneId: id
            })
            res.redirect(`/booking/calculation/${dataTicket.id}`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async priceCalculation (req,res) {
        try {
            const userId = req.session.user.id
            const {id} = req.params
            let dataTiket = await Ticket.findByPk(id)
            const dataPesawat = await Plane.findByPk(dataTiket.PlaneId)
            const dataBooking = await Booking.findByPk(dataTiket.BookingId)
            await dataPesawat.decrement({
                totalSeat: dataBooking.jumlahTiket
            })
            let kalkulasiHarga = dataPesawat.price * +dataBooking.jumlahTiket
            
            await dataTiket.update({
                totalPrice: kalkulasiHarga
            })
            const confirmation = await Ticket.findOne({
                where: {
                    id: id
                },
                include : [Booking, Plane]
            })
            kalkulasiHarga = formatRupiah(kalkulasiHarga)
            res.render('createTicket/printTicket', {confirmation, kalkulasiHarga, userId})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}


module.exports = CreateTicket