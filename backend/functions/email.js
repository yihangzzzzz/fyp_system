import express from 'express';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { send } from 'process';

function sendEmail(info, items) {

    const __dirname = import.meta.dirname;

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'temp.pdf'); // Temp file path

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(12).text(`Date: ${info.date}`, 100, 100);
    doc.text(`Destination: ${info.destination}`, 100, 120);
    doc.text(`Recipient: ${info.recipient}`, 100, 140);

    doc.text('Items:', 100, 160);
    items.forEach((item, index) => {
        doc.text(`Item ${index + 1}: ${item.name}, Quantity: ${item.quantity}`, 100, 180 + (index * 20));
    });

    doc.end();

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
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log('Error:', error);
        } else {
        console.log('Email sent:', info.response);
        }
    });
}

export default sendEmail;

