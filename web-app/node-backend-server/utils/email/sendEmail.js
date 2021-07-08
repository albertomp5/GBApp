const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

// const EMAIL_HOST= "id00725116@usal.es";
// const EMAIL_USERNAME=  "id00725116@usal.es";
// const EMAIL_PORT= 465;
// const EMAIL_PASSWORD= "XMurrBfq"
// const FROM_EMAIL= "id00725116@usal.es";

const sendEmail = async (email, subject, payload, template) => {
    try {
        // create reusable transporter object using the default SMTP transport
        //no funciona con el de la usal
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            logger: true,
            debug: true,
            ignoreTLS: true, // add this 
            auth: {
                user: 'albertohervas5@gmail.com',
                pass: 'juanangapador'
            }
        });

        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars.compile(source);

        const options = () => {
            return {
                from: "albertohervas5@gmail.com",
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };

        // Send email
        transporter.sendMail(options(), (error, info) => {
            if (error) {
                console.log(error);
                return error;
            } else {
                console.log(info);
                return info;
            }
        });
    } catch (error) {
        console.log(error);
        return error;
    }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;
