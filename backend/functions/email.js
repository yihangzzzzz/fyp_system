const express = require('express');
const {PDFDocument} = require('pdf-lib');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const { send } = require('process');
const { file } = require('pdfkit');

async function sendEmail(info, items, transferID) {

    const __dirname = path.resolve();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);
  
    page.drawText('Transfer Form', { x: 50, y: 650, size: 20 });
    page.drawText(`Destination: ${info.destination}`, { x: 50, y: 600, size: 12 });
    page.drawText(`Recipient: ${info.recipient}`, { x: 50, y: 570, size: 12 });
    page.drawText(`Date: ${info.date}`, { x: 50, y: 540, size: 12 });
  
    page.drawText('Items:', { x: 50, y: 510, size: 14 });
    let yPos = 480;
    items.forEach((item, index) => {
      page.drawText(`${index + 1}. ${item.name} - Quantity: ${item.quantity}`, { x: 50, y: yPos, size: 12 });
      yPos -= 25;
    });
  
    const pdfBytes = await pdfDoc.save();
    // documentName = `transfer${transferID}_${info.destination}_${info.date}.pdf`
    documentName = `transfer${transferID}.pdf`
    const filePath = path.join(__dirname, '..', '/backend/images/' , documentName);
    fs.writeFileSync(filePath, pdfBytes);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use SSL
        auth: {
          user: 'fyp.inventory.system@gmail.com',
          pass: 'mjqvcfewvocuaztd',
        }
      });

    const mailOptions = {
        from: 'fyp.inventory.system@gmail.com',
        to: `${info.email}`,
        subject: 'New Transfer Request from SPL',
        html: `
          <p>A new transfer has been requested with the following details:</p>
          <ul>
            <li>Date: ${info.date}</li>
            <li>Destination: ${info.destination}</li>
            <li>Recipient: ${info.recipient}</li>
          </ul>
          <p>Please click on the link below to acknowledge:</p>
          <a href="http://localhost:3000/api/transfers/accepttransfer/${transferID}">Acknowledge Transfer</a>`
          ,
        attachments: {
            filename: 'sample.pdf',
            path: filePath
        }
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log('Error:', error);
        } else {
        console.log('Email sent:', info.response);
        }
    });

    return documentName;
}

async function updateTransferDocument (transferID) {
  documentName = `transfer${transferID}.pdf`
  const filePath = path.join(__dirname, '..', 'images/' , documentName);
  const pdfBytes = fs.readFileSync(filePath); // Read the PDF as a buffer
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  firstPage.drawText('Acknowledged on:', {
    x: 50,
    y: 200,
    size: 12
  });
  firstPage.drawText(Date().toLocaleString('en-UK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Use 24-hour format
  }), {
    x: 50,
    y: 150,
    size: 12
  });

  const newPdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, newPdfBytes);
}

module.exports = {
  sendEmail,
  updateTransferDocument,
};

