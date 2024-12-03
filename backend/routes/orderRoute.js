const express = require("express");
const sql = require("mssql");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const { json } = require("express");
const { log } = require("console");
const {
  poDocumentupload,
  doDocumentupload,
} = require("../functions/picture.js");
const { spawn } = require("child_process");
const { sendFinanceEmail } = require("../functions/email.js");

const orderRouter = express.Router();

// ========================== GET =============================================

// GETTING ALL RECORDS
orderRouter.get("/", async (req, res) => {
  const pool = req.sqlPool;

  const { sortBy } = req.query;
  let query;
  switch (sortBy) {
    case "name":
      query = "select * from orders order by itemName";
      break;
    case "quantity":
      query = "select * from orders order by quantity";
      break;
    default:
      query = "select * from orders";
  }

  try {
    const orders = (await pool.query(`SELECT * FROM orders`)).recordset;
    const doDetails = (await pool.query(`SELECT * from doDetails`)).recordset;

    const ordersDict = {};
    orders.forEach((order) => {
      order.items = [];
      ordersDict[order.orderID] = order;
    });
    doDetails.forEach((doDetail) => {
      ordersDict[doDetail.orderID].items.push(doDetail);
    });
    const result = Object.entries(ordersDict).map(([key, order]) => order);
    result.forEach((order) => {
      let delivered = 0;
      order.items.forEach((subOrder) => {
        delivered += subOrder.subQuantity;
      });
      order.deliveredQuantity = delivered;
      if (order.items.length === 0) {
        order.items = [
          {
            doNumber: "",
            doDate: "",
            doDocument: "",
            subQuantity: "",
            finance: "",
          },
        ];
      }
    });

    return res.json(result);
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

// GET 1 PDF

orderRouter.get("/pdf/:filename", (req, res) => {
  const pool = req.sqlPool;
  const db = req.query.db;
  const doc = req.query.doc;
  const { filename } = req.params;
  const options = {
    root:
      doc === "po"
        ? path.join(__dirname, `../documents/${db}/poDocuments`)
        : path.join(__dirname, `../documents/${db}/doDocuments`),
  };

  res.sendFile(filename, options, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("File not found");
    }
  });
});

// GET INFO FROM PO DOCUMENT

orderRouter.post(
  "/scanDocument",
  poDocumentupload.single("poDocument"),
  async (req, res) => {
    const pool = req.sqlPool;
    const db = req.query.db;

    const pythonScript = path.join(
      __dirname,
      "../functions",
      "readDocument.py"
      //   "test.py"
    );
    const pdfFilePath = path.join(__dirname, `../`, req.file.path);
    const pythonProcess = spawn(`C:\\Python312\\python`, [
      pythonScript,
      pdfFilePath,
    ]);

    console.log("script is", pythonScript);
    console.log("file is", pdfFilePath);

    let result = "";
    console.log("before process");
    pythonProcess.stdout.on("data", (data) => {
      console.log("results is", result);
      result += data.toString();
      console.log("results is", result);
    });

    pythonProcess.on("error", (err) => {
      console.error("Error spawning Python process:", err); // Log any error spawning the process
    });

    console.log("middle process");

    let parsedResult = {};
    pythonProcess.on("error", (err) => {
      console.log("ERROR: spawn failed! (" + err + ")");
    });
    pythonProcess.on("close", (code) => {
      console.log("code is", code);
      if (code === 0) {
        parsedResult = JSON.parse(result);
        console.log("scan got run", parsedResult);
      } else {
        console.log("reading failed sia sian");
      }
      parsedResult["orderDocument"] = req.file.filename;
      res.json({ message: parsedResult });
    });
  }
);

orderRouter.put("/predictitems", async (req, res) => {
  const pool = req.sqlPool;
  const data = await pool.query(`
        SELECT itemName
        FROM warehouse
    `);
  const dbItemNames = data.recordset.map((row) => row.itemName);
  const queryItemNames = req.body.queryItems.map((item) => item[0]);
  const queryItemQuantities = req.body.queryItems.map((item) => item[1]);

  const pythonScript = path.join(__dirname, "../functions", "predictItem.py");

  const pythonProcess = spawn("python", [
    pythonScript,
    dbItemNames,
    queryItemNames,
    queryItemQuantities,
  ]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  let parsedResult = {};
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      parsedResult = JSON.parse(result);
      console.log("predicted result is ", result);
    } else {
      console.log("predicted failed sia sian");
    }
    res.json({ message: parsedResult });
  });
});

// ================================ POST ==================================================

// ADDING NEW RECORD
orderRouter.post("/neworder", async (req, res) => {
  const pool = req.sqlPool;

  const info = req.body.info;
  const orders = req.body.items;

  const poDocument = req.body.poDocument;
  const poDate = info.poDate;
  const poNumber = info.poNumber;

  try {
    orders.forEach((order) => {
      const name = order.name;
      const quantity = order.quantity;

      pool.query(`UPDATE warehouse
                SET ordered = ordered + ${quantity}
                WHERE itemName = '${name}'`);

      pool.query(`INSERT INTO orders 
                (itemName, poDate, quantity, poNumber, poDocument)
                VALUES ('${name}', '${poDate}', ${quantity}, '${poNumber}', '${poDocument}')`);
    });

    res.status(200).json({ message: "Items updated successfully" });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

orderRouter.post(
  "/newdelivery",
  doDocumentupload.single("doDocument"),
  async (req, res) => {
    const pool = req.sqlPool;

    const info = req.body.info;
    const deliveryItems = req.body.items;

    const doDocument = req.file ? req.file.filename : "";
    const doDate = info.doDate;
    const doNumber = info.doNumber;

    try {
      deliveryItems.forEach((item) => {
        const orderID = item.orderID;
        const subQuantity = item.subQuantity;
        const itemName = item.itemName;

        if (+item.totalQuantity === +item.deliveredQuantity + +subQuantity) {
          pool.query(`
                    UPDATE orders
                    SET status = 'Fulfilled'
                    WHERE orderID = ${orderID}
                    `);
        }

        pool.query(`UPDATE warehouse
                SET cabinet = cabinet + ${subQuantity},
                    ordered = ordered - ${subQuantity}
                WHERE itemName = '${itemName}'`);

        pool.query(`
                INSERT INTO doDetails (orderID, doNumber, doDate, doDocument, subQuantity)
                VALUES (${orderID}, '${doNumber}', '${doDate}', '${doDocument}', ${subQuantity})
            `);
      });

      res.status(200).json({ message: "Items updated successfully" });
    } catch (error) {
      console.log("error is " + error.message);
      res.send({ message: error.message });
    }
  }
);

// =================================== PUT ================================================

// UPDATE ONE RECORD
orderRouter.put(
  "/fulfillorder",
  doDocumentupload.single("doDocument"),
  async (req, res) => {
    const pool = req.sqlPool;

    const doDate = req.body.doDate;
    const doNumber = req.body.doNumber;
    const doDocument = req.file.filename;

    try {
      req.body.items.forEach((item) => {
        pool.query(`UPDATE orders
                SET doNumber = '${doNumber}',
                    doDate = '${doDate}',
                    status = 'Fulfilled',
                    doDocument = '${doDocument}'
                WHERE itemName = '${item.itemName}'`);

        pool.query(`UPDATE warehouse
                SET cabinet = cabinet + ${item.quantity},
                    ordered = ordered - ${item.quantity}
                WHERE itemName = '${item.itemName}'`);
      });
      res.status(200).json({ message: "Items updated successfully" });
    } catch (error) {
      console.log("error is " + error.message);
      res.send({ message: error.message });
    }
  }
);

orderRouter.put("/sendfinance", async (req, res) => {
  const pool = req.sqlPool;
  const db = req.query.db;

  const { doNumber, doDocument } = req.body;
  const emailDetails = await pool.query(`
        SELECT * 
        FROM emailTemplates
        WHERE templateName = 'finance'    
    `);

  try {
    sendFinanceEmail(doDocument, emailDetails.recordset[0], db);

    pool.query(`
            UPDATE doDetails
            SET finance = 'Sent'
            WHERE doNumber = '${doNumber}'    
        `);

    res.status(200).json({ message: "Items updated successfully" });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

orderRouter.put("/cancelorder", async (req, res) => {
  const pool = req.sqlPool;

  const items = req.body;

  try {
    items.forEach((item) => {
      pool.query(`
                UPDATE orders
                SET status = 'Cancelled'
                WHERE orderID = ${item.orderID}
                `);
    });
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

module.exports = orderRouter;
