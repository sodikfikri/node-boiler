const moment = require('moment')
const response = require('../config/responses')
const LibJWT = require('../library/LibJWT')

const AuthController = {

    Login: async function(req, res) {
        let apiResult = {}
        try {
            let token = await LibJWT.sign({id: 1})

            return res.json(token)
        } catch (error) {
            apiResult = response[500]
            apiResult.meta.message = error.message
            return res.status(500).send(apiResult)
        }
    }

}

module.exports = AuthController