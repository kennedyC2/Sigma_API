// Handler For Mailing
// =====================================================================

// Import Dependencies
// =====================================================================
const mailgun = require("mailgun-js");
const config = require("./config");

// Container
// =====================================================================
const message = {};

// Verification Message
// =====================================================================
message["verification"] = (email, code, callback) => {
    const mg = mailgun({ apiKey: config.mailgun_key, domain: config.mailgun_domain });

    const data = {
        from: "Sigma Solutions <Sigma@mailgun.org>",
        to: email,
        subject: "Sigma Solutions Verification Code",
        html: `<div>
                    <h4 style="margin-bottom: 10px; color: #5D3FD3">One Time Verification Code</h4>
                    <p style="margin-bottom: 10px">Hi there,</p>
                    <p>Your verification code is ${code}; expires in 5 minutes</p>
                    <p>Unverified Accounts will be deleted within 24hrs</p>
                    <p style="margin-bottom: 10px">Thanks</p>
                    <p style="margin-bottom: 10px">Phantom Developers</p>
                </div>`,
    };

    mg.messages().send(data, (error) => {
        if (!error) {
            callback(false);
        } else {
            callback(true);
        }
    });
};

// Export Module
module.exports = message;
