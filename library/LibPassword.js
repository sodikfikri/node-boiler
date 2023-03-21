const bcrypt = require("bcrypt")

const SALT_ROUNDS = 10

const LibPassword = {
    hash(passwd) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(passwd, SALT_ROUNDS, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    },
    compare(passwd, hashPaswd) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(passwd, hashPaswd, function(err, result) {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = LibPassword