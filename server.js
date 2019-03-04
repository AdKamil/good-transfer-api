const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

app.use('/', express.static(path.join(__dirname, 'render')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/render/index.html'));
});
app.post('/send', (req, res) => {
  const startPoint = req.body[1]
  const endPoint = req.body[2];
  const email = {
    name: req.body[0].name,
    email: req.body[0].email,
    phone: req.body[0].phone,
    date: req.body[0].date,
    time: req.body[0].time,
    distanceText: req.body[0].distanceText,
    price: req.body[0].price,
    clientsPrice: req.body[0].clientsPrice,
    flight: req.body[0].flight,
  };
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'mail.godtransfer.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'requests@godtransfer.com', // generated ethereal user
          pass: 'Polska123#'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });

  // mail for admin
  // setup email data with unicode symbols
  let adminMailOptions = {
    from: '"GoodTransfer" <requests@godtransfer.com>', // sender address
    to: 'goodtrasfer@gmail.com', // list of receivers
    subject: 'New transfer request', // Subject line
    html: `<p>${email.name}, asks for transfer.<p><br>
          <p>Transfer details:</p><br>
          <p>starting point: ${startPoint}</p>
          <p>ending point: ${endPoint}</p>
          <p>distance: ${email.distanceText}</p>
          <p>price: ${email.price} EUR</p>
          <p>Clients proposal price: ${email.clientsPrice} EUR</p>
          <p>date and time: ${email.date}, ${email.time}</p><br>
          <p>fligh number or train: ${email.flight}</p>
          <p>clients email: ${email.email}</p>
          <p>phone number: <a href="tel:${email.phone}">${email.phone}</a></p>` // html body
  };

  // send mail with defined transport object
  transporter.sendMail(adminMailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });

  // mail for client
  // setup email data with unicode symbols
  let clientMailOptions = {
    from: '"GoodTransfer" <requests@godtransfer.com>', // sender address
    to: email.email, // list of receivers
    subject: 'You just made transfer request', // Subject line
    html: `<p>Hi ${email.name},<p><br>
          <p>Thank You for choosing Us. We have received Your request and will contact You as soon as possible.</p><br>
          <p>Your request details:</p><br>
          <p>starting point: ${startPoint}</p>
          <p>ending point: ${endPoint}</p>
          <p>distance: ${email.distanceText}</p>
          <p>price: ${email.price} EUR</p>
          <p>date and time: ${email.date}, ${email.time}</p>
          <p>fligh number or train: ${email.flight}</p>` // html body
  };

  // send mail with defined transport object
  transporter.sendMail(clientMailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });

  res.status(201).json({
    message: 'Dziękuję za dane z formularza'
  });
});

app.listen(80, () => console.log('Serwer działa elegancko'));