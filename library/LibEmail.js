const path = require("path")
const ejs = require("ejs")
const nodemailer = require("nodemailer")
// const winston_helpers = require("./winston_helpers")

// const logName = 'mail_helpers';
// const Logger = winston_helpers.initialize(logName);

const LibEmail = {

    createTransport: function () {
        return new Promise((resolve, reject) => {
            try {
                const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASW,
                },
                pool: true,
                connectionTimeout: 10000,
                greetingTimeout: 5000,
                socketTimeout: 5000,
                maxConnections: 10,
                maxMessages: 500,
                // secure: false,
                // tls: {
                //     rejectUnauthorized: false
                // }
            });
  
            transporter.verify(function (err, success) {
                if (err) {
                    transporter.close();
                    reject(err);
                    // resolve({
                    //   type: 'error',
                    //   err,
                    // });
                    return false;
                }
                resolve({
                    type: 'success',
                    transporter,
                });
            });
        } catch (err) {
            reject(err);
            // resolve({
            //   type: 'error',
            //   err,
            // });
        }
      });
    },
  
    initializeTransport: function () {
        return new Promise(async (resolve, reject) => {
            try {
                let conn = null;
                for (let i = 0; i<3; i++) {
                    try {
                        conn = await LibEmail.createTransport();
                    } catch (err) {
                    continue;
                }
                if (!conn.transporter.isIdle()) continue;
                i = 2;
            }
            if (conn.type != 'success') {
                reject(err);
                // resolve({
                //   type: conn.type,
                //   err: conn.err,
                // });
                return false;
            } else {
                if (!conn.transporter.isIdle()) {
                    resolve({
                        type: 'fail',
                        message: 'transporter not idle',
                    });
                    return false;
                }
            }
            resolve({
                type: 'success',
                transporter: conn.transporter,
            });
        } catch (err) {
            reject(err);
            // resolve({
            //   type: 'error',
            //   err,
            // });
        }
      });
    },
  
    sendMail: function (subject, to, mailData, filename) {
        return new Promise(async (resolve, reject) => {
            try {
                const initTransport = await LibEmail.initializeTransport();
                if (initTransport.type != 'success') {
                    // Logger.log('error', `${logName} transporter_fail ${filename}: ${JSON.stringify(initTransport)}`);
                    reject(initTransport.err || initTransport.message);
                    // resolve({
                    //   type: initTransport.type,
                    //   message: initTransport.message,
                    //   err: initTransport.err,
                    // });
                    return false;
                }
                const transporter = initTransport.transporter;
        
                const renderData = {
                    ...mailData,
                    asset: process.env.ASSET,
                }
                ejs.renderFile(path.join(__dirname, `../files/mails/${filename}.html`), renderData, function (err, html) {
                    if (err) {
                        // Logger.log('error', `${logName} rendering_fail ${filename}: ${JSON.stringify(err)}`);
                        reject(err);
                        // resolve({
                        //   type: 'error',
                        //   err,
                        // });
                        return false;
                    }
                    const options = {
                        from: process.env.SMTP_FROM,
                        to,
                        subject,
                        html,
                    };
                    transporter.sendMail(options, function (err, info) {
                        if (err) {
                            // Logger.log('error', `${logName} sending_fail ${filename}: ${JSON.stringify(err)}`);
                            reject(err);
                            // resolve({
                            //   type: 'error',
                            //   err,
                            // });
                            return false;
                        }
                        resolve({
                            type: 'success',
                            result: info,
                        });
                    });
                });
            } catch (err) {
                // Logger.log('error', `${logName} sending_error ${filename}: ${JSON.stringify(err)}`);
                reject(err);
                // resolve({
                //   type: 'error',
                //   err,
                // });
            }
        });
    },
  
}
  
module.exports = LibEmail;