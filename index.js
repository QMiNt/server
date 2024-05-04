const express = require('express')
const nodemailer = require('nodemailer');
const aws  = require('aws-sdk');
const dotenv = require('dotenv');
const Content = require('./pdfHelper.js');
const html_to_pdf = require('html-pdf-node');
let options = { format: 'A4', printBackground: true,pageRanges: '1-2'};
dotenv.config();
const cors = require('cors');
const fs = require('fs');
const { page } = require('pdfkit');
const app = express()
const port = 3000
app.use(cors());
app.use(express.json());
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const transporter = nodemailer.createTransport({
    SES: new aws.SES({ apiVersion: '2010-12-01' })
});
app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})
// Endpoint to send email
app.post('/send-email', async (req, res) => {

    const { email, details, filling } = req.body;
    if (!email) {
        res.status(400).send({ message: 'Email is required' });
    }
    if (!details) {
        res.status(400).send({ message: 'Details is required' });
    }
    let out;
    await html_to_pdf.generatePdf(Content(filling,details),options).then(output => {
        out = output;
    });
    const mailOptions = {
        from: 'noreply@lawseva.co.in ',
        to: email,
        subject: `GST Filing Details PDF ready to download`,
        text: `
                Hey,

                Thank you for using the CA Cloud Desk FREE GST filing Details tool for the filing details. You can now download the requested filing details of the GST number {GST NUMBER}. 
                
                If you are looking to streamline your practice, TRY CA Cloud Desk Practice Management Software for efficient practice management.
                
                TRY CA CLOUD DESK.                                       SCHEDULE DEMO -BUTTONS
                
                Thanks and Regards
                CA Cloud Desk
                `,
        attachments: [
            {
                filename: 'Gst Filing Details.pdf',
                content: out,
                contentType: 'application/pdf',
            },
        ],
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error sending email' });
        } else {
            console.log('Email sent: ');
            console.log(info)
            res.status(200).send({ message: 'Email sent successfully', info: info.messageId });
        }
    });
});

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

