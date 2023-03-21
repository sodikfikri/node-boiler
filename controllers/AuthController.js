const moment = require('moment')
const response = require('../config/responses')

const AuthController = {

    Login: async function(req, res) {
        let apiResult = {}
        try {
            return res.json('success')
        } catch (error) {
            apiResult = response[500]
            apiResult.meta.message = error.message
            return res.status(500).send(apiResult)
        }
    }

}

module.exports = AuthController