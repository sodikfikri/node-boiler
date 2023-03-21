const AuthController = require("../controllers/AuthController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const PREFIX = process.env.API_URL

exports.routesConfig = function (app) {
    app.post(`/${PREFIX}/login`, AuthController.Login)
}