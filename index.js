const express = require('express')
const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const dotenv = require('dotenv');
const Content = require('./pdfHelper.js');
const html_to_pdf = require('html-pdf-node');
const gstRouter = require('./routes/gstDetailsRoute');
let options = { format: 'A4', printBackground: true, pageRanges: '1-2' };
dotenv.config();
const cors = require('cors');
const app = express()
const port = 3000
app.use(cors());
app.use(express.json());
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})
app.use('/gst', gstRouter);
const transporter = nodemailer.createTransport({
    SES: new aws.SES({ apiVersion: '2010-12-01' })
});
app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})
// Endpoint to send email
app.post('/send-api', async (req, res) => {

    const { email, details, filling } = req.body;
    if (!email) {
        res.status(400).send({ message: 'Email is required' });
    }
    if (!details) {
        res.status(400).send({ message: 'Details is required' });
    }
    const html = `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <title>Email</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style type="text/css">
        a, a[href], a:hover, a:link, a:visited {
            /* This is the link colour */
            text-decoration: none !important;
            color: #0000EE;
        }

        .link {
            text-decoration: underline !important;
        }

        p, p:visited {
            /* Fallback paragraph style */
            font-size: 15px;
            line-height: 24px;
            font-family: 'Helvetica', Arial, sans-serif;
            font-weight: 300;
            text-decoration: none;
            color: #000000;
        }

        h1 {
            /* Fallback heading style */
            font-size: 22px;
            line-height: 24px;
            font-family: 'Helvetica', Arial, sans-serif;
            font-weight: normal;
            text-decoration: none;
            color: #000000;
        }

        .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {
            line-height: 100%;
        }

        .ExternalClass {
            width: 100%;
        }
    </style>

</head>

<!-- You can change background colour here -->
<body style="text-align: center; margin: 0; padding-top: 10px; padding-bottom: 10px; padding-left: 0; padding-right: 0; -webkit-text-size-adjust: 100%;background-color: #f2f4f6; color: #000000"
      align="center">

<!-- Fallback force center content -->
<div style="text-align: center;">
    <table align="center"
           style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color:#f2f4f6;"
           width="600">
        <tbody>
        <tr>
            <td style="width: 596px; vertical-align: top; padding-left: 0; padding-right: 0; padding-top: 15px; padding-bottom: 15px;"
                width="596">
                <img style="max-height: 100px; text-align: center;"
                     alt="Logo" src="https://partner.caclouddesk.com/imgs/logos/logo.png"
                     align="center">

            </td>
        </tr>
        </tbody>
    </table>

    <!-- Hero image -->
    
    <h1 style="color: #52409d;font-size: 32px;font-weight:  800;">Your PDF is ready to <br><br> Download!!</h1>
    <img style="max-width: 590px; height: 290px; max-height: 290px; text-align: center;background-color:#f2f4f6;"
         alt="Hero image" src="https://partner.caclouddesk.com/imgs/logos/partner-employee-welcome.png" align="center">
    <!-- Hero image -->

    <!-- Start single column section -->
    
    <table align="center" 
    style="border-top: 5px solid #63BCC3;text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #ffffff;"
           width="600">
        <tbody>
        <tr>
            <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;"
                width="596">
                
                <p style="font-size: 18px;font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none;text-align: left;">
                    Hey,<br/>
                    Thank you for using the CA Cloud Desk FREE GST Details tool. You can download the requested GST filing information for GST number ${details.gstin} from the attachment in this email.
                </p>

                <p style="font-size: 18px;font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none;text-align: left;">
                    If you are looking to streamline your practice, <br> TRY CA Cloud Desk Practice Management Software for efficient practice management.
                </p>
                
                
                <!-- Start button (You can change the background colour by the hex code below) -->
                <a href="https://demo.caclouddesk.com/" target="_blank"
                style="background-color: #6751c0; font-size: 18px; font-family: 'Helvetica', Arial, sans-serif; font-weight: normal; text-decoration: none; padding: 12px 25px; color: #ffffff; border-radius: 35px; display: inline-block; mso-padding-alt: 0;">
                    <!--[if mso]>
                    <i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt;">&nbsp;</i>
                  <![endif]-->

                    <span style="mso-text-raise: 15pt; color: #ffffff; font-weight: bold;">Try CA CloudDesk</span></a>
                    <!-- End button here -->
                    
                </td>
            </tr>
        </tbody>
    </table>
    
    <!-- End single column section -->

    <!-- Start unsubscribe section -->
    <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px;" width="600">
    <tbody>
    <tr>
        <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 30px;"
            width="596">

            <p style="font-size: 20px; line-height: 20px; font-family: 'Helvetica', Arial, sans-serif; font-weight: normal; text-decoration: none; color: #000000;">
            <a href=3D"https://www.linkedin.com/company/caclouddesk/" target="_blank">
                                <img src="https://partner.caclouddesk.com/imgs/logos/linkedin.png" alt="linkedin" height="18"/>
                            </a>
                            <a href="https://www.facebook.com/caclouddesk" target="_blank">
                                <img src="https://partner.caclouddesk.com/imgs/logos/facebook.png" alt="facebook" height="18"/>
                            </a>
                            <a href="https://x.com/caclouddesk" target="_blank">
                                <img src="https://partner.caclouddesk.com/imgs/logos/twitter.png" alt="twitter" height="18"/>
                            </a>
                            <a href="https://www.youtube.com/@CACloudDesk" target="_blank">
                                <img src="https://partner.caclouddesk.com/imgs/logos/youtube.png" alt="youtube" height="18"/>
                            </a>
                            <a href="https://www.instagram.com/caclouddesk/" target="_blank">
                                <img src="https://partner.caclouddesk.com/imgs/logos/instagram.png" alt="instagram" height="18"/>
                            </a>
                / @CACLOUDDESK
            </p>

            <p style="font-size: 16px; line-height: 16px; font-family: 'Helvetica', Arial, sans-serif; font-weight: bold; text-decoration: none; color: #000000;">
                CUSTOMER CARE: 0120-4308902
            </p>

            <p style="font-size: 14px; line-height: 14px; font-family: 'Helvetica', Arial, sans-serif; font-weight: normal; text-decoration: none; color: #919293; margin-top: 30px;">
                © CA Cloud Desk 2024. All rights reserved.
            </p>

        </td>
    </tr>
    </tbody>
</table>

</div>

</body>

</html>
    
    `
    let out;
    await html_to_pdf.generatePdf(Content(filling, details), options).then(output => {
        out = output;
    });
    const mailOptions = {
        from: 'noreply@lawseva.co.in ',
        to: email,
        subject: `GST Filing Details PDF ready to download`,
        html: html,
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

            res.status(500).send({ message: 'Error sending email' });
        } else {
            res.status(200).send({ message: 'Email sent successfully', info: info.messageId });
        }
    });
});

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

