const controller = {}
const nodemailer = require('nodemailer')
// let smtpTransport = require('nodemailer-smtp-transport');
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

controller.send = async (props) => {
    const readHTMLFile = function (path, callback) {
        fs.readFile(
            path,
            {
                encoding: 'utf-8',
            },
            function (err, html) {
                if (err) {
                    throw err
                } else {
                    callback(null, html)
                }
            }
        )
    }

    const smtpTransport = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    const file = './email_confirmation.html'
    await readHTMLFile(path.join(__dirname, file), function (err, html) {
        const subject = 'Email Confirmation'

        const template = handlebars.compile(html)
        const replacements = {
            name: props.name,
            email: props.email,
            url_confirmation:
                process.env.BASE_URL +
                '/api/v1/user/email-confirmation/' +
                props.token_confirmation,
        }

        const htmlToSend = template(replacements)
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: props.email,
            subject: subject,
            html: htmlToSend,
        }

        smtpTransport.sendMail(mailOptions, async function (error, _) {
            if (error) {
                console.log('============================')
                console.log(error.message)
                console.log('============================')
                callback(error)
            } else {
                console.log('email confirmation terkirim')
                return true
            }
        })
    })
}

module.exports = controller
