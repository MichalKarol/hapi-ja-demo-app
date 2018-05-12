const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');
const Mailer = require('nodemailer');

const server = new Hapi.Server({
    port: 80,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});

const provision = async () => {
    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true,
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/api/email',
        handler: function (request, h) {
            let input_model = request.payload;

            let transporter = Mailer.createTransport({
                host: 'student.pwr.edu.pl',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
                }
            });

            let mail = {
                from: `Newsletetr <${process.env.USER}>`,
                to: input_model.email,
                subject: "Send Email Using Hapi.js",
                text: `Witaj ${input_model.name} ${input_model.surname} w newsletterze wysłanym przy zastosowaniu Hapi.js`,
                html: `<b>Witaj ${input_model.name} ${input_model.surname} w newsletterze wysłanym przy zastosowaniu Hapi.js</b>`
            }
        
            // send mail with defined transport object
            transporter.sendMail(mail, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });

            return 'OK';
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
};

provision();