const responses = require("../config/responses")
const LibJWT = require("../library/LibJWT")


const AuthMiddleware = async function (req, res, next) {

    let apiResult= {}
    try {
        const payload = await LibJWT.verify(req.headers['x-api-key']);
        req.auth = { ...payload };
    } catch (err) {
        apiResult.meta = responses[500].meta;
        apiResult.meta.message = err.message;
        return res.status(500).send(apiResult);
    }
    next();

}

module.exports = AuthMiddleware