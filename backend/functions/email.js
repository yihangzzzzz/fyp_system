const express = require('express');
const {PDFDocument} = require('pdf-lib');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const { send } = require('process');
const { file } = require('pdfkit');

async function sendEmail(info, items) {

    const __dirname = path.resolve();

    // const doc = new PDFDocument();
    // const filePath = path.join(__dirname, 'temp.pdf'); // Temp file path

    // doc.pipe(fs.createWriteStream(filePath));
    // doc.fontSize(12).text(`Date: ${info.date}`, 100, 100);
    // doc.text(`Destination: ${info.destination}`, 100, 120);
    // doc.text(`Recipient: ${info.recipient}`, 100, 140);

    // doc.text('Items:', 100, 160);
    // items.forEach((item, index) => {
    //     doc.text(`Item ${index + 1}: ${item.name}, Quantity: ${item.quantity}`, 100, 180 + (index * 20));
    // });

    //     // Create a form
    // const form = doc.getForm();

    // // Add a checkbox to the form
    // const checkBox = form.createCheckBox('acknowledgment.checkbox');
    // checkBox.addToPage(doc, { x: 50, y: 250 });

    // // Add instructions
    // doc.drawText('I acknowledge that I have received the document.', { x: 80, y: 255 });

    // doc.end();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 700]);
  
    page.drawText('Delivery Receipt', { x: 50, y: 650, size: 20 });
    page.drawText(`Name: ${info.destination}`, { x: 50, y: 600, size: 12 });
    page.drawText(`Recipient: ${info.recipient}`, { x: 50, y: 570, size: 12 });
    page.drawText(`Date: ${info.date}`, { x: 50, y: 540, size: 12 });
  
    let yPos = 500;
    page.drawText('Items:', { x: 50, y: yPos + 30, size: 14 });
  
    items.forEach((item, index) => {
      page.drawText(`${index + 1}. ${item.name} - Quantity: ${item.quantity}`, { x: 50, y: yPos, size: 12 });
      yPos -= 25;
    });
  
    const form = pdfDoc.getForm();
    const checkbox = form.createCheckBox('checkbox.field');
    checkbox.addToPage(page, { x: 50, y: 300, width: 20, height: 20 });
  
    // Add a label for the checkbox
    page.drawText('I agree to the terms and conditions.', { x: 80, y: 305, size: 12 });
  
    const pdfBytes = await pdfDoc.save();
    // documentName = `transfer_${info.destination}_${info.date}.pdf`
    const filePath = path.join(__dirname, '..', '/backend/images/hoho.pdf');
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
        subject: 'Sending Email using Node.js',
        text: `That was easy HAHAHAHAH
               Date is ${info.date}
               Destination is ${info.destination}
               Recipient is ${info.recipient}`,
        attachments: {
            filename: 'sample.pdf',
            path: filePath
        }
    };
    
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //     console.log('Error:', error);
    //     } else {
    //     console.log('Email sent:', info.response);
    //     }
    // });

    // return documentName;
}

// async function createPDFWithCheckbox() {
//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();
  
//     // Add a page
//     const page = pdfDoc.addPage([600, 400]);
  
//     // Add some content
//     page.drawText('Please check the box below:', { x: 50, y: 350, size: 12 });
  
//     // Create an interactive checkbox
//     const form = pdfDoc.getForm();
//     const checkbox = form.createCheckBox('checkbox.field');
//     checkbox.addToPage(page, { x: 50, y: 300, width: 20, height: 20 });
  
//     // Add a label for the checkbox
//     page.drawText('I agree to the terms and conditions.', { x: 80, y: 305, size: 12 });
  
//     // Save the PDF document to bytes
//     const pdfBytes = await pdfDoc.save();
  
//     // Save the PDF to a file
//     fs.writeFileSync('PDFWithCheckbox.pdf', pdfBytes);
//     console.log('PDF with interactive checkbox saved as PDFWithCheckbox.pdf');
//   }

// //   createPDFWithCheckbox();
// //   console.log("donez")

module.exports = sendEmail;

