const express = require('express');
const {PDFDocument} = require('pdf-lib');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const { send } = require('process');
const { file } = require('pdfkit');
const fontkit = require('fontkit');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: 'fyp.inventory.system@gmail.com',
    pass: 'mjqvcfewvocuaztd',
  }
});

// async function sendTransferEmail(info, items, transferID, db) {

//     const __dirname = path.resolve();

//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([600, 700]);
  
//     page.drawText('Transfer Form', { x: 50, y: 650, size: 20 });
//     page.drawText(`Destination: ${info.destination}`, { x: 50, y: 600, size: 12 });
//     page.drawText(`Recipient: ${info.recipient}`, { x: 50, y: 570, size: 12 });
//     page.drawText(`Date: ${info.date}`, { x: 50, y: 540, size: 12 });
  
//     page.drawText('Items:', { x: 50, y: 510, size: 14 });
//     let yPos = 480;
//     items.forEach((item, index) => {
//       page.drawText(`${index + 1}. ${item.name} - Quantity: ${item.quantity}`, { x: 50, y: yPos, size: 12 });
//       yPos -= 25;
//     });
  
//     const pdfBytes = await pdfDoc.save();
//     // documentName = `transfer${transferID}_${info.destination}_${info.date}.pdf`
//     documentName = `transfer${transferID}.pdf`
//     const filePath = path.join(__dirname, '..', `/backend/documents/${db}` , documentName);
//     fs.writeFileSync(filePath, pdfBytes);

//     const mailOptions = {
//         from: 'fyp.inventory.system@gmail.com',
//         to: `${info.email}`,
//         subject: 'New Transfer Request from SPL',
//         html: `
//           <p>A new transfer has been requested with the following details:</p>
//           <ul>
//             <li>Date: ${info.date}</li>
//             <li>Destination: ${info.destination}</li>
//             <li>Recipient: ${info.recipient}</li>
//           </ul>
//           <p>Please click on the link below to acknowledge:</p>
//           <a href="http://localhost:3000/transfers/accepttransfer/${transferID}?db=${db}">Acknowledge Transfer</a>`
//           ,
//         attachments: {
//             filename: 'transferDocument.pdf',
//             path: filePath
//         }
//     };

    
//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//         console.log('Error:', error);
//         } else {
//         console.log('Email sent:', info.response, 'at', filePath);
//         }
//     });

//     return documentName;
// }

async function sendTransferEmail(type, info, items, transferID, db) {

  const __dirname = path.resolve();
  let template
  switch (type) {
    case "Transfer Out":
      template = 'transferOutForm.pdf'
      break;
    case 'Transfer In':
      template = 'transferInForm.pdf'
      break;
    case 'Loan':
      template = 'loanForm.pdf'
      break;
  }
  const filePath = path.join(__dirname, '..', `/backend/documents/${db}/templates/` , template);
  const pdfBytes = fs.readFileSync(filePath); // Read the PDF as a buffer
  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Adding Georgia font
  const fontBytes = fs.readFileSync(path.join(__dirname, '..', `/backend/documents/testing/` , 'georgia.ttf')); // Adjust the path
  const georgiaFont = await pdfDoc.embedFont(fontBytes);

  const date = `${info.date.split('-')[2]}/${info.date.split('-')[1]}/${info.date.split('-')[0]}`
  firstPage.drawText(date, { x: 72, y: 577, size: 12, font: georgiaFont });

  // Writing recipient name and destination
  if (type === 'Transfer In') {
    firstPage.drawText(`${info.sender}`, { x: 72, y: 515, size: 12, font: georgiaFont });
    firstPage.drawText(`${info.destination}`, { x: 72, y: 499, size: 12, font: georgiaFont });
  }
  else {
    firstPage.drawText(`${info.recipient}`, { x: 251, y: 515, size: 12, font: georgiaFont });
    firstPage.drawText(`${info.destination}`, { x: 251, y: 499, size: 12, font: georgiaFont });
  }

  // Adding table of items
  const headers = ['S/N', 'Item', 'Quantity'];
  const headerYPos = 435; // Starting Y position for headers
  const xPos = 72;
  const rowHeight = 25; // Height for each row
  const cellPadding = 5; // Padding for cells

  // Draw the headers
  headers.forEach((header, index) => {
    firstPage.drawText(header, {
      x: (index === 2 ? (xPos + 400) : (xPos + index*50)), // Adjust the X position for each column
      y: headerYPos,
      size: 12,
      font: georgiaFont // Optionally make the header bold
    });
  });

  // Draw each item in the table
  items.forEach((item, index) => {
    const yPos = headerYPos - (index + 1) * rowHeight; // Calculate Y position for each row
    firstPage.drawText(`${index + 1}`, { x: xPos, y: yPos, size: 12, font: georgiaFont }); // S/N
    firstPage.drawText(item.name, { x: xPos+50, y: yPos, size: 12, font: georgiaFont }); // Item Name
    firstPage.drawText(`${item.quantity}`, { x: xPos+400, y: yPos, size: 12, font: georgiaFont }); // Quantity
  });




  const documentName = `transfer${transferID}.pdf`;
  const newPdfBytes = await pdfDoc.save();
  const newFilePath = path.join(__dirname, '..', `/backend/documents/${db}/` , documentName);
  fs.writeFileSync(newFilePath, newPdfBytes);

  const mailOptions = {
      from: 'fyp.inventory.system@gmail.com',
      to: `${info.email}`,
      subject: 'New Transfer Request from SPL',
      html: `
        <p>A new transfer has been requested with the following details:</p>
        <ul>
          <li>Date: ${date}</li>
          <li>Destination: ${info.destination}</li>
          <li>Recipient: ${info.recipient}</li>
        </ul>
        <p>Please click on the link below to acknowledge:</p>
        <a href="http://localhost:3000/transfers/accepttransfer/${transferID}?db=${db}&type=${type}">Acknowledge Transfer</a>`
        ,
      attachments: {
          filename: 'transferDocument.pdf',
          path: newFilePath
      }
  };

  
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
      console.log('Error:', error);
      } else {
      console.log('Email sent:', info.response, 'at', filePath);
      }
  });

  return documentName;
}

async function sendFinanceEmail(doDocument) {


  const filePath = path.join(__dirname, '..', `/documents/${db}` , doDocument);


  const FinancemailOptions = {
      from: 'fyp.inventory.system@gmail.com',
      to: `yihangzzzzz@gmail.com`, // input finance email
      subject: 'New Delivery DO from SPL',
      html: `
        <p>Love Christina</p>`
        ,
      attachments: {
          filename: 'DO_Document.pdf',
          path: filePath
      }
  };


  
  transporter.sendMail(FinancemailOptions, function(error, info){
      if (error) {
      console.log('Error:', error);
      } else {
      console.log('Email sent:', info.response, 'at', filePath);
      }
  });
}

async function updateTransferDocument (transferID, db, type) {
  documentName = `transfer${transferID}.pdf`
  const filePath = path.join(__dirname, '..', `/documents/${db}/` , documentName);
  const pdfBytes = fs.readFileSync(filePath); // Read the PDF as a buffer
  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Adding Georgia font
  const fontBytes = fs.readFileSync(path.join(__dirname, '..', `/documents/testing/` , 'georgia.ttf')); // Adjust the path
  const georgiaFont = await pdfDoc.embedFont(fontBytes);

  function getTodayFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Get day and pad with leading zero
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and pad
    const year = today.getFullYear(); // Get full year
    
    return `${day}/${month}/${year}`; // Format in DD/MM/YYYY
  }

  // Draw acknowledgment
  if (type === 'Loan') {
    firstPage.drawText('Loan Out Accepted', { x: 72, y: 105, size: 12, font: georgiaFont });
    const todayDate = getTodayFormatted();
    firstPage.drawText(todayDate, { x: 72, y: 90, size: 12, font: georgiaFont });
  }

  else if (type === 'Loan Return') {
    firstPage.drawText('Loan Returned', { x: 200, y: 105, size: 12, font: georgiaFont });
    const todayDate = getTodayFormatted();
    firstPage.drawText(todayDate, { x: 200, y: 90, size: 12, font: georgiaFont });
  }

  else {
    firstPage.drawText('Transfer Accepted', { x: 72, y: 105, size: 12, font: georgiaFont });
    const todayDate = getTodayFormatted();
    firstPage.drawText(todayDate, { x: 72, y: 90, size: 12, font: georgiaFont });
  }


  const newPdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, newPdfBytes);
}

async function testUpdatePDF() {
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, '..', `documents/${db}/templates/` , 'transferForm.pdf');
  const pdfBytes = fs.readFileSync(filePath); // Read the PDF as a buffer
  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Adding Georgia font
  const fontBytes = fs.readFileSync(path.join(__dirname, '..', `documents/testing/` , 'georgia.ttf')); // Adjust the path
  const georgiaFont = await pdfDoc.embedFont(fontBytes);
  firstPage.drawText('01/10/2024', { x: 72, y: 577, size: 12, font: georgiaFont });

  // Writing recipient name and destination
  firstPage.drawText('Recipient Name', { x: 251, y: 515, size: 12, font: georgiaFont });
  firstPage.drawText('Destination', { x: 251, y: 499, size: 12, font: georgiaFont });

  // Adding table of items
  const headers = ['S/N', 'Item', 'Quantity'];
  const headerYPos = 435; // Starting Y position for headers
  const xPos = 72;
  const rowHeight = 25; // Height for each row
  const cellPadding = 5; // Padding for cells

  // Draw the headers
  headers.forEach((header, index) => {
    firstPage.drawText(header, {
      x: xPos + index * 100, // Adjust the X position for each column
      y: headerYPos,
      size: 12,
      font: georgiaFont // Optionally make the header bold
    });
  });

  // Draw each item in the table
  items.forEach((item, index) => {
    const yPos = headerYPos - (index + 1) * rowHeight; // Calculate Y position for each row
    firstPage.drawText(`${index + 1}`, { x: xPos, y: yPos, size: 12, font: georgiaFont }); // S/N
    firstPage.drawText(item.name, { x: xPos+100, y: yPos, size: 12, font: georgiaFont }); // Item Name
    firstPage.drawText(`${item.quantity}`, { x: xPos+200, y: yPos, size: 12, font: georgiaFont }); // Quantity
  });

  // Draw acknowledgment
  firstPage.drawText('Transfer Accepted', { x: xPos, y: 105, size: 12, font: georgiaFont });
  firstPage.drawText('05/10/2024', { x: xPos, y: 90, size: 12, font: georgiaFont });




  const newPdfBytes = await pdfDoc.save();
  const newFilePath = path.join(__dirname, '..', `documents/${db}/` , `transfer_${transferID}.pdf`);
  fs.writeFileSync(newFilePath, newPdfBytes);

}

// testUpdatePDF()
//   .then(() => {
//     console.log('PDF updated successfully!');
//   })
//   .catch(error => {
//     console.error('Error updating PDF:', error);
//   });

module.exports = {
  sendTransferEmail,
  sendFinanceEmail,
  updateTransferDocument,
};


