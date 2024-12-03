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

const picturestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dbParam = req.query.db; // Get the query parameter

        // Determine the directory based on the db parameter
        let uploadDir;
        if (dbParam === 'hw') {
            uploadDir = 'documents/hw/itemPictures';
        } else if (dbParam === 'sw') {
            uploadDir = 'documents/sw/itemPictures';
        } else {
            uploadDir = 'documents'; // Default directory if no match
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
        cb(null, file.originalname);
    },
    });

const poDocumentstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dbParam = req.query.db; // Get the query parameter

        // Determine the directory based on the db parameter
        let uploadDir;
        if (dbParam === 'hw') {
            uploadDir = 'documents/hw/poDocuments';
        } else if (dbParam === 'sw') {
            uploadDir = 'documents/sw/poDocuments';
        } else {
            uploadDir = 'documents'; // Default directory if no match
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
    });

const doDocumentstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dbParam = req.query.db; // Get the query parameter

        // Determine the directory based on the db parameter
        let uploadDir;
        if (dbParam === 'hw') {
            uploadDir = 'documents/hw/doDocuments';
        } else if (dbParam === 'sw') {
            uploadDir = 'documents/sw/doDocuments';
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
const pictureupload = multer({ storage: picturestorage });
const poDocumentupload = multer({ storage: poDocumentstorage });
const doDocumentupload = multer({ storage: doDocumentstorage });


module.exports = {upload, pictureupload, poDocumentupload, doDocumentupload};

