const express = require('express')
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit-table');
const pdfHelper = require('./pdfHelper');
const aws = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const fs = require('fs')
const app = express()
const port = 3000
app.use(cors());
app.use(express.json());
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const transporter = nodemailer.createTransport(
    {
        SES: new aws.SES({ apiVersion: '2010-12-01' })
    });
app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})
// Endpoint to send email
app.post('/send-email', (req, res) => {
    try {
        const { email, details, filling } = req.body;
        if (!email) {
            res.status(400).send({ message: 'Email is required' });
        }
        if (!details) {
            res.status(400).send({ message: 'Details is required' });
        }
    
        const pdfDoc = new PDFDocument({
            margins: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        }
        );
        const chunks = [];

        pdfDoc.on('data', (chunk) => {
            chunks.push(chunk);
        });
        pdfDoc.on('end', async () => {
            const pdfBuffer = Buffer.concat(chunks);
            const mailOptions = {
                from: 'noreply@lawseva.co.in ',
                to: email,
                subject: 'testing',
                text: "Hi there",
                attachments: [
                    {
                        filename: 'Gst Filing Details.pdf',
                        content: pdfBuffer,
                        contentType: 'application/pdf',
                    },
                ],
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send({ message: 'Error sending email' });
                } else {
                    console.log('Email sent: ');
                    res.status(200).send({ message: 'Email sent successfully', info: info.messageId });
                }
            });

        });
        pdfHelper.createInvoice(pdfDoc, details, filling)
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Some Error Occured', error });
    }
});

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

