const {UserProfile, User, Booking, Plane, Ticket} = require('../models')
const {Op} = require('sequelize')
const fs = require('fs').promises
const formatRupiah = require('../helper/rupiah')
const QRCode = require('qrcode')


class CreateTicket{

    static async profile(req, res) {
        try {
            // console.log(req.session.user.id);
            const user = req.session.user
            const id = user.id
            const {message} = req.query
            console.log(req.query);
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
            console.log(req.session.user);
            res.render('createTicket/profile', {user, data, history, message})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async getCreateBooking(req, res) {
        try {
            const {user} = req.session
            const {errors} = req.query
            let dataBandara = JSON.parse(await fs.readFile("./Data/bandara_indonesia.json"))
            // console.log(dataBandara);
            res.render('createTicket/booking', {user, dataBandara, errors})
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
            req.session.booking = newBooking
            req.session.bookingId = newBooking.id
            res.redirect('/booking/add/plane')
        } catch (error) {
            if (error.name === "SequelizeValidationError") { {
                let errors = error.errors.map(err => {
                    return err.message
                })
                res.redirect(`/booking/add?errors=${errors}`)
            }
            } else {
                console.log(error);
                res.send(error)
            }
        }
    }

    // pilih pesawat

    static async getPlane(req,res) {
        try {

            const availablePlanes = await Plane.getAvailablePlanes()

            const {error} = req.query
            res.render('createTicket/plane', {availablePlanes, error})
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

            
            const text = `https://giphy.com/gifs/highcastle-high-castle-the-man-in-tv-RfBCbS7lk0OX9TLrOi`;
            const qrImage = await QRCode.toDataURL(text);
            
            res.render('createTicket/printTicket', {confirmation, kalkulasiHarga, userId, qrImage})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async deleteHistory (req, res) {
        try {
            const {userId} = req.params
            let data = await Booking.findOne({where: {id: {[Op.eq]: userId}}})
            let tanggal = data.createdAt
            await Booking.destroy({where: {id: {[Op.eq]: userId}}})
            res.redirect(`/booking/profile/${userId}?message=Booking tanggal ${tanggal} sudah terhapus`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}


module.exports = CreateTicket