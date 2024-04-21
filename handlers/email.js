const nodemailer = require('nodemailer');
const emailConfig = require('../config/emails');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

exports.sendEmail = async (options) => {
    console.log(options);

    // Leer el archivo para el email
    const file = __dirname + `/../views/emails/${options.file}.ejs`;

    // Compilarlo
    const compiled = ejs.compile(fs.readFileSync(file, 'utf8'));

    // Crear el HTML
    const html = compiled({ url: options.url });

    // Configurar el email
    const mailOptions = {
        from: 'Meeti <noreply@meeti.com>',
        to: options.user.email,
        subject: options.subject,
        html
    };

    // Enviar el email
    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport, mailOptions);
}
