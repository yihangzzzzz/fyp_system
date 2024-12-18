const express = require("express");
const sql = require("mssql");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const { json } = require("express");
const { log } = require("console");
const { upload } = require("../functions/picture.js");
const {
  sendTransferEmail,
  updateTransferDocument,
} = require("../functions/email.js");

const transferRoute = express.Router();

// GETTING ALL RECORDS
transferRoute.get("/", async (req, res) => {
  const pool = req.sqlPool;

  try {
    const transfers = (await pool.query(`SELECT * FROM transfers`)).recordset;
    const transferItems = (await pool.query(`SELECT * from transferItems`))
      .recordset;

    const transfersDict = {};
    transfers.forEach((transfer) => {
      transfer.items = [];
      transfersDict[transfer.transferID] = transfer;
    });
    transferItems.forEach((transferItem) => {
      transfersDict[transferItem.transferID].items.push(transferItem);
    });

    const result = {
      outbound: Object.entries(transfersDict)
        .filter(
          ([key, transfer]) =>
            transfer.type === "Transfer Out" || transfer.type === "Loan"
        )
        .map(([key, transfer]) => transfer),
      inbound: Object.entries(transfersDict)
        .filter(([key, transfer]) => transfer.type === "Transfer In")
        .map(([key, transfer]) => transfer),
      miscellaneous: Object.entries(transfersDict)
        .filter(([key, transfer]) => transfer.type === "Miscellaneous")
        .map(([key, transfer]) => transfer),
    };

    return res.json(result);
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

transferRoute.get("/labs", async (req, res) => {
  const pool = req.sqlPool;

  try {
    const data = pool.query(`SELECT * from LABS`);
    data.then((res1) => {
      return res.json(res1);
    });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

// GET 1 PDF

transferRoute.get("/pdf/:filename", (req, res) => {
  const pool = req.sqlPool;
  const db = req.query.db;
  const { filename } = req.params;
  const options = {
    root: path.join(__dirname, `../documents/${db}/transferForms`),
  };

  res.sendFile(filename, options, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("File not found");
    }
  });
});

// GET EACH ITEM TRANSFER FOR GRAPH
transferRoute.get("/transfergraph", async (req, res) => {
  const pool = req.sqlPool;

  try {
    const result = await pool.query(`
            SELECT t.transferID, t.date, ti.itemName, ti.quantity
            FROM transfers t JOIN transferItems ti
            ON t.transferID = ti.transferID    
        `);
    return res.json(result);
  } catch (error) {
    console.log("error is le " + error.message);
    res.send({ message: error.message });
  }
});
// ====================== POST ==================================

// ADDING NEW TRANSFER RECORD
transferRoute.post("/newtransfer", async (req, res) => {
  const pool = req.sqlPool;
  const db = req.query.db;
  const { info, items, labs, url } = req.body;

  console.log("labs are", labs);

  let status;
  switch (info.type) {
    case "Miscellaneous":
      status = "Acknowledged";
      break;
    default:
      status = "Pending";
      break;
  }

  let database;
  switch (db) {
    case "sw":
      database = "SPL";
      break;
    default:
      database = "HPL";
      break;
  }

  const handleOneTransfer = async (lab) => {
    console.log("lab is", lab);
    // Uptdaing TRANSFERS table
    let from, to;
    if (info.type === "Transfer In") {
      from = lab.lab;
      to = database;
    } else {
      from = database;
      to = lab.lab;
    }
    const result =
      await pool.query(`INSERT INTO transfers (type, date, source, destination, recipient, email, status, remarks, sender) 
            VALUES ('${info.type}', '${info.date}', '${from}', '${to}', '${lab.recipient}', '${lab.email}', '${status}', '${info.remarks}', '${info.sender}')
            SELECT SCOPE_IDENTITY() AS transferID`);

    console.log("stuck 1");

    const transferID = result.recordset[0].transferID;
    let transferDocument;

    console.log("stuck 1");

    const emailDetails = await pool.query(`
                SELECT * 
                FROM emailTemplates
                WHERE templateName = 'transfer'    
            `);
    console.log("email details is ", emailDetails.recordset[0]);

    if (info.type != "Miscellaneous") {
      transferDocument = await sendTransferEmail(
        info.type,
        info,
        items,
        transferID,
        info.db,
        emailDetails.recordset[0],
        lab,
        url
      );
    }

    pool.query(`UPDATE transfers
                SET transferDocument =  '${transferDocument}'
                WHERE transferID = ${transferID}`);

    items.forEach((item) => {
      // UPDATE transferItems table
      pool.query(`INSERT INTO transferItems (transferID, itemName, quantity, itemID) 
                    VALUES (${transferID}, '${item.name}', ${item.quantity}, ${item.itemID})`);

      // UPDATE inventory table if type is Miscellaneous
      if (lab.lab.includes("Counter")) {
        pool.query(`UPDATE warehouse
                        SET cabinet = cabinet - ${item.quantity},
                            counter = counter + ${item.quantity}
                        WHERE itemID = ${item.itemID}`);
      } else if (lab.lab.includes("Cabinet")) {
        pool.query(`UPDATE warehouse
                        SET cabinet = cabinet + ${item.quantity},
                            counter = counter - ${item.quantity}
                        WHERE itemID = ${item.itemID}`);
      } else if (lab.lab.includes("Lost/Damaged")) {
        pool.query(`UPDATE warehouse
                        SET cabinet = cabinet - ${item.quantity},
                            lostDamaged = lostDamaged + ${item.quantity}
                        WHERE itemID = ${item.itemID}`);
      }
    });
  };

  labs.forEach((lab) => {
    try {
      handleOneTransfer(lab);
    } catch (error) {
      console.log("error is le " + error.message);
      res.send({ message: error.message });
    }
  });
  res.status(200).json({ message: "Items updated successfully" });
});

// ADDING NEW TRANSFER ITEMS RECORD
transferRoute.post("/newtransfer/additems", async (req, res) => {
  const pool = req.sqlPool;

  const transferID = req.query.transferID;
  const items = req.body;

  try {
    items.forEach((item) => {
      pool.query(`INSERT INTO transferItems (transferID, itemName, quantity) 
            VALUES (${transferID}, '${item.name}', ${item.quantity})`);
    });

    res.status(200).json({ message: "Items updated successfully" });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});
// DELETE ONE RECORD
transferRoute.delete("/:itemName", async (req, res) => {
  const pool = req.sqlPool;
  try {
    const { itemName } = req.params;
    // Replace this with your actual SQL query to delete the item
    await pool.query(`DELETE FROM warehouse WHERE itemName = ${itemName}`);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// =========================== PUT =========================================

// UPDATE ONE RECORD
transferRoute.put("/manualstatuschange", async (req, res) => {
  const pool = req.sqlPool;

  const newStatus = req.body.status;
  const transferID = req.body.id;
  const type = req.body.type;
  const db = req.query.db;
  try {
    const result = await pool.query(`
            SELECT *
            FROM transferItems
            WHERE transferID = ${transferID}
        `);

    await pool.query(`
            UPDATE transfers
            SET status = '${newStatus}'
            WHERE transferID = ${transferID}
        `);

    if (newStatus === "Returned") {
      result.recordset.forEach((item) => {
        pool.query(`
                    UPDATE warehouse
                    SET cabinet = cabinet + ${item.quantity}
                    WHERE itemID = ${item.itemID}
                `);
      });

      updateTransferDocument(transferID, db, "Loan Return");
    } else if (newStatus === "Acknowledged") {
      if (type === "Transfer Out") {
        result.recordset.forEach((item) => {
          pool.query(`
                        UPDATE warehouse
                        SET cabinet = cabinet - ${item.quantity}
                        WHERE itemID = ${item.itemID}
                    `);
        });
      } else if (type === "Transfer In") {
        result.recordset.forEach((item) => {
          pool.query(`
                        UPDATE warehouse
                        SET cabinet = cabinet - ${item.quantity}
                        WHERE itemID = ${item.itemID}
                    `);
        });
      }
    }

    res.status(200).json({ message: "Items updated successfully" });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

transferRoute.put("/updateinventory", async (req, res) => {
  const pool = req.sqlPool;

  const type = req.query.type;
  // res.send({message : type});

  try {
    if (type === "counter") {
      req.body.forEach((item) => {
        pool.query(`UPDATE warehouse 
                    SET cabinet = cabinet - ${item.quantity},
                        counter = counter + ${item.quantity}
                    WHERE itemName = '${item.name}'`);
      });
    } else if (type === "cabinet") {
      req.body.forEach((item) => {
        pool.query(`UPDATE warehouse 
                    SET cabinet = cabinet + ${item.quantity},
                        counter = counter - ${item.quantity}
                    WHERE itemName = '${item.name}'`);
      });
    } else if (type === "unaccounted") {
      req.body.forEach((item) => {
        pool.query(`UPDATE warehouse 
                    SET lostDamaged = lostDamaged + ${item.quantity},
                        cabinet = cabinet - ${item.quantity}
                    WHERE itemName = '${item.name}'`);
      });
    }

    await pool.query(`UPDATE transfers
            SET status = 'Acknowledged'
            WHERE transferID = ${req.body.id}`);

    res.status(200).json({ message: "Items updated successfully" });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

transferRoute.put("/accepttransfer/:transferID", async (req, res) => {
  const pool = req.sqlPool;
  const db = req.query.db;
  const type = req.query.type;
  const { transferID } = req.params;

  try {
    const status = await pool.query(`
            SELECT status
            FROM transfers
            WHERE transferID = ${transferID}
        `);

    if (status.recordset[0].status === "Pending") {
      updateTransferDocument(transferID, db, type);

      const result = await pool.query(`
                SELECT *
                FROM transferItems
                WHERE transferID = ${transferID}
            `);

      if (type === "Transfer In") {
        result.recordset.forEach((item) => {
          pool.query(`
                        UPDATE warehouse
                        SET cabinet = cabinet + ${item.quantity}
                        WHERE itemID = ${item.itemID}
                    `);
        });
      } else {
        result.recordset.forEach((item) => {
          pool.query(`
                        UPDATE warehouse
                        SET cabinet = cabinet - ${item.quantity}
                        WHERE itemID = ${item.itemID}
                    `);
        });
      }

      let newStatus;
      if (type === "Loan") {
        newStatus = "On Loan";
      } else {
        newStatus = "Acknowledged";
      }

      pool.query(`
                UPDATE transfers
                SET status = '${newStatus}'
                WHERE transferID = ${transferID}
            `);
    }

    res.status(200).json({ message: "Items updated successfully" });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

module.exports = transferRoute;
