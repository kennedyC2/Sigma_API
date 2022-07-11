// Handler For Mailing
// =====================================================================

// Import Dependencies
// =====================================================================
const nodemailer = require("nodemailer");
const config = require("./config");

// Container
// =====================================================================
const message = {};

message.transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: config.email,
        pass: config.key,
    },
});

// Verification Message
// =====================================================================
message["verification"] = (email, code, callback) => {
    const mailOptions = {
        from: "MedSoph Solutions <hello@medsoph.com>",
        reply_to: "hello@medsoph.com",
        to: email,
        subject: "Medsoph Application Verification Code",
        html: `
            <div style="background-color: rgba(128, 128, 128, 0.28); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center">
                <div style="width: 100%; max-width: 400px; margin: auto; padding: 0 3rem 2rem; background-color: #ffffff">
                    <div style="text-align: left; padding: 0 0.3rem">
                        <a href="https://medsoph.com" style="display: inline-flex; text-decoration: none; border-bottom: 3px solid red">
                            <div>
                                <h1 style="color: #202a44; font-size: 1.5rem; font-weight: bolder !important; margin: 7px 0 0; padding: 0">MED<span style="color: #0d6efd">SOPH</span></h1>
                            </div>
                        </a>
                    </div>

                    <div style="padding: 0 0.3rem; color: #202a44">
                        <h2>Verification Code</h2>
                        <p style="padding: 0.5rem 0">Below is your verification code</p>
                        <div style="padding: 0.5rem 1rem; font-weight: bold; background-color: rgba(128, 128, 128, 0.28); margin-bottom: 0.5rem; font-size: 1.5rem">${code}</div>
                        <p>Please do not share this code with anyone.</p>
                        <strong>This code will expire in 15 minutes.</strong>
                    </div>

                    <div style="padding-left: 0.3rem; color: #202a44">
                        <p style="font-size: 13px">Kind Regards.</p>
                    </div>
                </div>
            </div>
                `,
    };

    message.transporter.sendMail(mailOptions, function (err, info) {
        if (!err) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

// Export Module
module.exports = message;
