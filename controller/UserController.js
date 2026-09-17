const {UserProfile, User, Booking} = require('../models')
const {Op} = require('sequelize')
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const session = require('express-session')

class UserController {
    
    // static async logOut (req,res) {
    //     req.session.userId = null
        
    //     res.render('homeAndUsers/homepage', {data : null})
    // }
    // Homepage


    static async homePage(req,res) {
        try {

            res.render('homeAndUsers/homepage')
          
        } catch (error) {
            console.log(error);
            res.render('homeAndUsers/homepage')
            // res.send(error)
        }
    }

    // Belum Login
    static async getLoginPage(req,res) {
        try {
            const {errors, error} = req.query
            
            res.render('homeAndUsers/login', {errors, error})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async postLoginPage(req,res) {
        try {
            let input = req.body
            const {userName, password} = input

            const user = await User.findOne({
                where: {
                    userName
                }
            })
            if (!user) {
                res.redirect('/login?errors=Username or Password is incorrect.')
            }
            let compare = bcrypt.compareSync(password, user.password)
            if (!compare) {
                res.redirect('/login?errors=Username or Password is incorrect.')
            }
            req.session.user = user// set session di controller login   
            res.redirect(`/booking/profile/${req.session.user.id}`)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async getRegisterPage(req,res) {
        try {
            const {errors} = req.query
            res.render('homeAndUsers/registrationProfiles', {errors})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
    static async postRegisterPage(req,res) {
        try {
            let errors = []
            let {userName, email, password, role, firstName, lastName, phoneNum, address} = req.body

            if (!userName) {
                errors.push("User Name is required")
            }
            if (!email) {
                errors.push("Email is required")
            }
            if (!password) {
                errors.push("Password is required")
            }
            if (!firstName) {
                errors.push("First Name is required")
            }
            if (!lastName) {
                errors.push("lastName is required")
            }
            if (!phoneNum) {
                errors.push("phoneNum is required")
            }

            if (!address) {
                errors.push("Address is required")
            }

            if (errors.length > 0) {
                res.redirect(`/registrationProfiles?errors=${errors}`)
            }
            const newUserProfile = await UserProfile.create({
                firstName, lastName, phoneNum, address
            })
            const UserProfileId = newUserProfile.id
            const newUserId = await User.create({
                userName, email, password, role, UserProfileId
            })
            res.redirect('/')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async logout(req, res){
        try {
            req.session.destroy((err) => {
                if(err) console.log(err);
                else{
                    res.redirect('/')
                }
            })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

}


module.exports = UserController