
class UserController {
    static async homePage(req,res) {
        try {
            res.render('/views/homeAndUsers/homepage.ejs')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }
}


module.exports = UserController