const express = require('express');
const {PDFDocument, PDFString, PDFName, rgb} = require('pdf-lib');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const { send } = require('process');
const { file } = require('pdfkit');
const fontkit = require('fontkit');
const schedule = require('node-schedule');
const { poolHWPromise, poolSWPromise } = require('../config.js');

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

async function sendTransferEmail(type, info, items, transferID, db, emailDetails) {

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


  // ADD HYPERLINK TO ACKNOWLEDGE 
  const createPageLinkAnnotation = (page, uri) =>
    page.doc.context.register(
      page.doc.context.obj({
        Type: 'Annot',
        Subtype: 'Link',
        Rect: [72, 120, 212, 150],
        C: [1, 1, 1],
        A: {
          Type: 'Action',
          S: 'URI',
          URI: PDFString.of(uri),
        },
      }),
    );
    firstPage.drawRectangle({
      x: 72, // Starting x position
      y: 120, // Starting y position
      width: 140, // Width of the rectangle
      height: 30, // Height of the rectangle
      color: rgb(0, 0.6, 0), // Green color
    });
  firstPage.drawText('Acknowledge Transfer', {
    x: 84,
    y: 130,
    size: 12,
    font: georgiaFont,
    color: rgb(0,0,0) // White text for contrast
  });

  const link = createPageLinkAnnotation(firstPage, `http://localhost:3000/transfers/accepttransfer/${transferID}?db=${db}&type=${type}`);
  firstPage.node.set(PDFName.of('Annots'), pdfDoc.context.obj([link]));

  // pdfDoc.textWithLink('Acknowledge', 72, 200, { url: `http://localhost:3000/transfers/accepttransfer/${transferID}?db=${db}&type=${type}` });

  // firstPage.drawText('Acknowledge Transfer', {
  //     x: 72,
  //     y: 200,
  //     size: 12,
  //     font: georgiaFont
  // });

  // // Create a link annotation
  // firstPage.addLinkAnnotation({
  //     x: 72,
  //     y: 200,
  //     size: 12,
  //     font: georgiaFont,
  //     url: `http://localhost:3000/transfers/accepttransfer/${transferID}?db=${db}&type=${type}`
  // });




  const documentName = `transfer${transferID}.pdf`;
  const newPdfBytes = await pdfDoc.save();
  const newFilePath = path.join(__dirname, '..', `/backend/documents/${db}/` , documentName);
  fs.writeFileSync(newFilePath, newPdfBytes);

  const mailOptions = {
      from: 'fyp.inventory.system@gmail.com',
      to: `${info.email}`,
      subject: `${emailDetails.subject}`,
      html: `
        <p>${emailDetails.message}</p>
        <ul>
          <li>Date: ${date}</li>
          <li>Destination: ${info.destination}</li>
          <li>Recipient: ${info.recipient}</li>
        </ul>
        <p>Please acknowledge the transfer in the attached document</p>
        `
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

async function sendFinanceEmail(doDocument, emailDetails, db) {


  const filePath = path.join(__dirname, '..', `/documents/${db}` , doDocument);



  const FinancemailOptions = {
      from: 'fyp.inventory.system@gmail.com',
      to: `${emailDetails.email}`, // input finance email
      subject: `${emailDetails.subject}`,
      html: `
        <p>${emailDetails.message}</p>
        `,
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

async function sendWeeklyLowStock() {
  const swPool = await poolSWPromise;
  const swDetails = await swPool.query(`
    SELECT *
    FROM emailTemplates
    WHERE templateName = 'lowStock';  
  `)
  const swItems = await swPool.query(`
    SELECT *
    FROM warehouse
    WHERE (counter + cabinet) < lowStock
  `)
  const swLowStockmailOptions = {
    from: 'fyp.inventory.system@gmail.com',
    to: `${swDetails.recordset[0].email}`, // input finance email
    subject: `${swDetails.recordset[0].subject}`,
    html: `
      <p>${swDetails.recordset[0].message}</p>
      <ul>
        ${swItems.recordset.map(item => `<li>${item.itemName} : ${item.counter + item.cabinet}</li>`).join('')}
      </ul>
      `
  };

  const hwPool = await poolHWPromise;
  const hwDetails = await hwPool.query(`
    SELECT *
    FROM emailTemplates
    WHERE templateName = 'lowStock';  
  `)
  const hwItems = await hwPool.query(`
    SELECT *
    FROM warehouse
    WHERE (counter + cabinet) < lowStock
  `)
  const hwLowStockmailOptions = {
    from: 'fyp.inventory.system@gmail.com',
    to: `${hwDetails.recordset[0].email}`, // input finance email
    subject: `${hwDetails.recordset[0].subject}`,
    html: `
      <p>${hwDetails.recordset[0].message}</p>
      <ul>
        ${hwItems.recordset.map(item => `<li>${item.itemName} : ${item.counter + item.cabinet}</li>`).join('')}
      </ul>
      `
  };

  schedule.scheduleJob('39 13 * * 1', () => {
    transporter.sendMail(swLowStockmailOptions, function(error, info){
        if (error) {
        console.log('Error:', error);
        } else {
        console.log('SW Email sent:', info.response);
        }
    });

    transporter.sendMail(hwLowStockmailOptions, function(error, info){
      if (error) {
      console.log('Error:', error);
      } else {
      console.log('HW Email sent:', info.response);
      }
  });
  })




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
    firstPage.drawText('Loan Out Accepted', { x: 72, y: 85, size: 12, font: georgiaFont });
    const todayDate = getTodayFormatted();
    firstPage.drawText(todayDate, { x: 72, y: 70, size: 12, font: georgiaFont });
  }

  else if (type === 'Loan Return') {
    firstPage.drawText('Loan Returned', { x: 200, y: 85, size: 12, font: georgiaFont });
    const todayDate = getTodayFormatted();
    firstPage.drawText(todayDate, { x: 200, y: 70, size: 12, font: georgiaFont });
  }

  else {
    firstPage.drawText('Transfer Accepted', { x: 72, y: 85, size: 12, font: georgiaFont });
    const todayDate = getTodayFormatted();
    firstPage.drawText(todayDate, { x: 72, y: 70, size: 12, font: georgiaFont });
  }


  const newPdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, newPdfBytes);
}

// async function testUpdatePDF() {
//   const __dirname = path.resolve();
//   const filePath = path.join(__dirname, '..', `documents/${db}/templates/` , 'transferForm.pdf');
//   const pdfBytes = fs.readFileSync(filePath); // Read the PDF as a buffer
//   const pdfDoc = await PDFDocument.load(pdfBytes);
//   pdfDoc.registerFontkit(fontkit);
//   const pages = pdfDoc.getPages();
//   const firstPage = pages[0];

//   // Adding Georgia font
//   const fontBytes = fs.readFileSync(path.join(__dirname, '..', `documents/testing/` , 'georgia.ttf')); // Adjust the path
//   const georgiaFont = await pdfDoc.embedFont(fontBytes);
//   firstPage.drawText('01/10/2024', { x: 72, y: 577, size: 12, font: georgiaFont });

//   // Writing recipient name and destination
//   firstPage.drawText('Recipient Name', { x: 251, y: 515, size: 12, font: georgiaFont });
//   firstPage.drawText('Destination', { x: 251, y: 499, size: 12, font: georgiaFont });

//   // Adding table of items
//   const headers = ['S/N', 'Item', 'Quantity'];
//   const headerYPos = 435; // Starting Y position for headers
//   const xPos = 72;
//   const rowHeight = 25; // Height for each row
//   const cellPadding = 5; // Padding for cells

//   // Draw the headers
//   headers.forEach((header, index) => {
//     firstPage.drawText(header, {
//       x: xPos + index * 100, // Adjust the X position for each column
//       y: headerYPos,
//       size: 12,
//       font: georgiaFont // Optionally make the header bold
//     });
//   });

//   // Draw each item in the table
//   items.forEach((item, index) => {
//     const yPos = headerYPos - (index + 1) * rowHeight; // Calculate Y position for each row
//     firstPage.drawText(`${index + 1}`, { x: xPos, y: yPos, size: 12, font: georgiaFont }); // S/N
//     firstPage.drawText(item.name, { x: xPos+100, y: yPos, size: 12, font: georgiaFont }); // Item Name
//     firstPage.drawText(`${item.quantity}`, { x: xPos+200, y: yPos, size: 12, font: georgiaFont }); // Quantity
//   });

//   // Draw acknowledgment
//   firstPage.drawText('Transfer Accepted', { x: xPos, y: 105, size: 12, font: georgiaFont });
//   firstPage.drawText('05/10/2024', { x: xPos, y: 90, size: 12, font: georgiaFont });




//   const newPdfBytes = await pdfDoc.save();
//   const newFilePath = path.join(__dirname, '..', `documents/${db}/` , `transfer_${transferID}.pdf`);
//   fs.writeFileSync(newFilePath, newPdfBytes);

// }

// testUpdatePDF()
//   .then(() => {
//     console.log('PDF updated successfully!');
//   })
//   .catch(error => {
//     console.error('Error updating PDF:', error);
//   });
sendWeeklyLowStock();

module.exports = {
  sendTransferEmail,
  sendFinanceEmail,
  updateTransferDocument,
};


