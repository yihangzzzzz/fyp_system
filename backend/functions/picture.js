const express = require('express');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const path = require('path');
const { dirname } = require('path');
const { fileURLToPath } = require('url');
const { send } = require('process');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dbParam = req.query.db; // Get the query parameter

        // Determine the directory based on the db parameter
        let uploadDir;
        if (dbParam === 'hw') {
            uploadDir = 'documents/hw';
        } else if (dbParam === 'sw') {
            uploadDir = 'documents/sw';
        } else {
            uploadDir = 'documents'; // Default directory if no match
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
    });


// Multer configuration
const upload = multer({ storage });


module.exports = upload;

