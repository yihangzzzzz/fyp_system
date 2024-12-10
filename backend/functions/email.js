const express = require("express");
const { PDFDocument, PDFString, PDFName, rgb } = require("pdf-lib");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");
const { send } = require("process");
const { file } = require("pdfkit");
const fontkit = require("fontkit");
const schedule = require("node-schedule");
const { poolHWPromise, poolSWPromise } = require("../config.js");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use SSL
  auth: {
    user: "ccds.item.inventory.system@gmail.com",
    pass: "zdlvewwujtfhewbi",
  },
});

async function sendTransferEmail(
  type,
  info,
  items,
  transferID,
  db,
  emailDetails,
  lab,
  url
) {
  const __dirname = path.resolve();
  let template;
  switch (type) {
    case "Transfer Out":
      template = "transferOutForm.pdf";
      break;
    case "Transfer In":
      template = "transferInForm.pdf";
      break;
    case "Loan":
      template = "loanForm.pdf";
      break;
  }
  const filePath = path.join(
    __dirname,
    "..",
    `/backend/documents/${db}/templates/`,
    template
  );
  const pdfBytes = fs.readFileSync(filePath); // Read the PDF as a buffer
  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Adding Georgia font
  const fontBytes = fs.readFileSync(
    path.join(__dirname, "..", `/backend/documents/testing/`, "georgia.ttf")
  ); // Adjust the path
  const georgiaFont = await pdfDoc.embedFont(fontBytes);

  const date = `${info.date.split("-")[2]}/${info.date.split("-")[1]}/${
    info.date.split("-")[0]
  }`;
  firstPage.drawText(date, { x: 72, y: 577, size: 12, font: georgiaFont });

  // Writing recipient name and destination
  if (type === "Transfer In") {
    firstPage.drawText(`${info.sender}`, {
      x: 72,
      y: 515,
      size: 12,
      font: georgiaFont,
    });
    firstPage.drawText(`${lab.recipient}`, {
      x: 251,
      y: 515,
      size: 12,
      font: georgiaFont,
    });
    firstPage.drawText(`${lab.lab}`, {
      x: 72,
      y: 499,
      size: 12,
      font: georgiaFont,
    });
  } else {
    firstPage.drawText(`${info.sender}`, {
      x: 72,
      y: 515,
      size: 12,
      font: georgiaFont,
    });
    firstPage.drawText(`${lab.recipient}`, {
      x: 251,
      y: 515,
      size: 12,
      font: georgiaFont,
    });
    firstPage.drawText(`${lab.lab}`, {
      x: 251,
      y: 499,
      size: 12,
      font: georgiaFont,
    });
  }

  // Adding table of items
  const headers = ["S/N", "Item", "Quantity"];
  const headerYPos = 435; // Starting Y position for headers
  const xPos = 72;
  const rowHeight = 25; // Height for each row
  const cellPadding = 5; // Padding for cells

  // Draw the headers
  headers.forEach((header, index) => {
    firstPage.drawText(header, {
      x: index === 2 ? xPos + 400 : xPos + index * 50, // Adjust the X position for each column
      y: headerYPos,
      size: 12,
      font: georgiaFont, // Optionally make the header bold
    });
  });

  // Draw each item in the table
  items.forEach((item, index) => {
    const yPos = headerYPos - (index + 1) * rowHeight; // Calculate Y position for each row
    firstPage.drawText(`${index + 1}`, {
      x: xPos,
      y: yPos,
      size: 12,
      font: georgiaFont,
    }); // S/N
    firstPage.drawText(item.name, {
      x: xPos + 50,
      y: yPos,
      size: 12,
      font: georgiaFont,
    }); // Item Name
    firstPage.drawText(`${item.quantity}`, {
      x: xPos + 400,
      y: yPos,
      size: 12,
      font: georgiaFont,
    }); // Quantity
  });

  // ADD HYPERLINK TO ACKNOWLEDGE
  const createPageLinkAnnotation = (page, uri) =>
    page.doc.context.register(
      page.doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [72, 120, 212, 150],
        C: [1, 1, 1],
        A: {
          Type: "Action",
          S: "URI",
          URI: PDFString.of(uri),
        },
      })
    );
  firstPage.drawRectangle({
    x: 72, // Starting x position
    y: 120, // Starting y position
    width: 140, // Width of the rectangle
    height: 30, // Height of the rectangle
    color: rgb(0, 0.6, 0), // Green color
  });
  firstPage.drawText("Accept Transfer", {
    x: 84,
    y: 130,
    size: 12,
    font: georgiaFont,
    color: rgb(0, 0, 0), // White text for contrast
  });

  const link = createPageLinkAnnotation(
    firstPage,
    `${url}/transfers/accepttransfer/${transferID}?db=${db}&type=${type}`
  );
  firstPage.node.set(PDFName.of("Annots"), pdfDoc.context.obj([link]));

  const documentName = `transfer${transferID}.pdf`;
  const newPdfBytes = await pdfDoc.save();
  const newFilePath = path.join(
    __dirname,
    "..",
    `/backend/documents/${db}/transferForms/`,
    documentName
  );
  fs.writeFileSync(newFilePath, newPdfBytes);

  const mailOptions = {
    from: "fyp.inventory.system@gmail.com",
    to: `${lab.email}`,
    subject: `${emailDetails.subject}`,
    html: `
        <p>${emailDetails.message}</p>
        <ul>
          <li>Date: ${date}</li>
          <li>Destination: ${lab.lab}</li>
          <li>Recipient: ${lab.recipient}</li>
        </ul>
        <p>Please acknowledge the transfer in the attached document</p>
        `,
    attachments: {
      filename: "transferDocument.pdf",
      path: newFilePath,
    },
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response, "at", filePath);
    }
  });

  return documentName;
}

async function sendFinanceEmail(doDocument, emailDetails, db) {
  const filePath = path.join(
    __dirname,
    "..",
    `/documents/${db}/doDocuments`,
    doDocument
  );

  const FinancemailOptions = {
    from: "fyp.inventory.system@gmail.com",
    to: `${emailDetails.email}`, // input finance email
    subject: `${emailDetails.subject}`,
    html: `
        <p>${emailDetails.message}</p>
        `,
    attachments: {
      filename: "DO_Document.pdf",
      path: filePath,
    },
  };

  transporter.sendMail(FinancemailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response, "at", filePath);
    }
  });
}

async function sendWeeklyLowStock(toggle) {
  const swPool = await poolSWPromise;
  const swDetails = await swPool.query(`
    SELECT *
    FROM emailTemplates
    WHERE templateName = 'lowStock';  
  `);
  const swItems = await swPool.query(`
    SELECT *
    FROM warehouse
    WHERE (counter + cabinet) < lowStock
  `);
  const swLowStockmailOptions = {
    from: "fyp.inventory.system@gmail.com",
    to: `${swDetails.recordset[0].email}`, // input finance email
    subject: `${swDetails.recordset[0].subject}`,
    html: `
      <p>${swDetails.recordset[0].message}</p>
      <ul>
        ${swItems.recordset
          .map(
            (item) =>
              `<li>${item.itemName} : ${item.counter + item.cabinet}</li>`
          )
          .join("")}
      </ul>
      `,
  };

  const hwPool = await poolHWPromise;
  const hwDetails = await hwPool.query(`
    SELECT *
    FROM emailTemplates
    WHERE templateName = 'lowStock';  
  `);
  const hwItems = await hwPool.query(`
    SELECT *
    FROM warehouse
    WHERE (counter + cabinet) < lowStock
  `);
  const hwLowStockmailOptions = {
    from: "fyp.inventory.system@gmail.com",
    to: `${hwDetails.recordset[0].email}`, // input finance email
    subject: `${hwDetails.recordset[0].subject}`,
    html: `
      <p>${hwDetails.recordset[0].message}</p>
      <ul>
        ${hwItems.recordset
          .map(
            (item) =>
              `<li>${item.itemName} : ${item.counter + item.cabinet}</li>`
          )
          .join("")}
      </ul>
      `,
  };

  const dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  console.log("day is", swDetails.recordset[0].day);
  console.log("hour is", swDetails.recordset[0].time.split(":")[0]);
  console.log("minute is", swDetails.recordset[0].time.split(":")[1]);

  const job = schedule.scheduleJob(
    `${swDetails.recordset[0].time.split(":")[1]} ${
      swDetails.recordset[0].time.split(":")[0]
    } * * ${dayMap[swDetails.recordset[0].day.toLowerCase()]}`,
    () => {
      transporter.sendMail(swLowStockmailOptions, function (error, info) {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("SW Email sent:", info.response);
        }
      });

      transporter.sendMail(hwLowStockmailOptions, function (error, info) {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("HW Email sent:", info.response);
        }
      });
    }
  );
}

async function updateTransferDocument(transferID, db, type) {
  documentName = `transfer${transferID}.pdf`;
  const filePath = path.join(
    __dirname,
    "..",
    `/documents/${db}/transferForms/`,
    documentName
  );
  const pdfBytes = fs.readFileSync(filePath); // Read the PDF as a buffer
  const pdfDoc = await PDFDocument.load(pdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Adding Georgia font
  const fontBytes = fs.readFileSync(
    path.join(__dirname, "..", `/documents/testing/`, "georgia.ttf")
  ); // Adjust the path
  const georgiaFont = await pdfDoc.embedFont(fontBytes);

  function getTodayFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Get day and pad with leading zero
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Get month (0-based, so add 1) and pad
    const year = today.getFullYear(); // Get full year

    return `${day}/${month}/${year}`; // Format in DD/MM/YYYY
  }

  // Draw acknowledgment
  if (type === "Loan") {
    firstPage.drawText("Loan Out Accepted", {
      x: 72,
      y: 85,
      size: 12,
      font: georgiaFont,
    });
    const todayDate = getTodayFormatted();
    firstPage.drawText(todayDate, {
      x: 72,
      y: 70,
      size: 12,
      font: georgiaFont,
    });
  } else if (type === "Loan Return") {
    firstPage.drawText("Loan Returned", {
      x: 200,
      y: 85,
      size: 12,
      font: georgiaFont,
    });
    const todayDate = getTodayFormatted();
    firstPage.drawText(todayDate, {
      x: 200,
      y: 70,
      size: 12,
      font: georgiaFont,
    });
  } else {
    firstPage.drawText("Transfer Accepted", {
      x: 72,
      y: 85,
      size: 12,
      font: georgiaFont,
    });
    const todayDate = getTodayFormatted();
    firstPage.drawText(todayDate, {
      x: 72,
      y: 70,
      size: 12,
      font: georgiaFont,
    });
  }

  const newPdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, newPdfBytes);
}

sendWeeklyLowStock();

module.exports = {
  sendTransferEmail,
  sendFinanceEmail,
  updateTransferDocument,
  sendWeeklyLowStock,
};
