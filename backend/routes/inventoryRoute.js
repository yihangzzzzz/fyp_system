const express = require("express");
const sql = require("mssql");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const { json } = require("express");
const { log } = require("console");
const { pictureupload } = require("../functions/picture.js");

const inventoryRouter = express.Router();

// ======================================= GET =============================================

// GETTING ALL RECORDS
inventoryRouter.get("/", async (req, res) => {
  const pool = req.sqlPool;
  try {
    pool
      .query(
        `
            SELECT *
            FROM warehouse
        `
      )
      .then((res1) => {
        return res.json(res1);
      });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

// GET 1 RECORD
inventoryRouter.get("/:itemID", async (req, res) => {
  const pool = req.sqlPool;

  const itemID = req.params.itemID;

  try {
    const data = pool.query(`SELECT *
                                FROM warehouse
                                WHERE itemID = ${itemID}`);
    data.then((res1) => {
      return res.json(res1);
    });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

// ========================= POST ======================================================================

// ADD 1 ITEM
inventoryRouter.post(
  "/newitem",
  pictureupload.single("picture"),
  async (req, res) => {
    const pool = req.sqlPool;

    try {
      const { name, quantity, description } = req.body;
      const picture = req.file.filename;

      pool.query(`INSERT INTO warehouse (itemName, cabinet, picture, description)
                   VALUES ('${name}', ${quantity}, '${picture}', '${description}')`);

      res.send("Image uploaded and saved to database");
    } catch (err) {
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ================================= DELETE ====================================================

// DELETE ONE RECORD
inventoryRouter.delete("/:itemID", async (req, res) => {
  const pool = req.sqlPool;
  try {
    const { itemID } = req.params;
    await pool.query(`DELETE FROM warehouse WHERE itemID = ${itemID}`);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// ===================================== PUT ===================================================

// UPDATE ORDERED QUANTITY
inventoryRouter.put("/order", async (req, res) => {
  const pool = req.sqlPool;

  const orders = req.body;

  try {
    orders.forEach((order) => {
      const name = order.name;
      const ordered = order.quantity;
      pool.query(`UPDATE warehouse
                SET ordered = ordered + ${ordered}
                WHERE itemName = '${name}'`);
    });

    res.status(200).json({ message: "Items updated successfully" });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

// UPDATE LOW STOCK
inventoryRouter.put("/lowstock", async (req, res) => {
  const pool = req.sqlPool;

  const { itemID, newLowStock } = req.body;

  try {
    pool.query(`UPDATE warehouse
                SET lowStock = ${newLowStock}
                WHERE itemID = ${itemID}`);

    res.status(200).json({ message: "Items updated successfully" });
  } catch (error) {
    console.log("error is " + error.message);
    res.send({ message: error.message });
  }
});

// UPDATE 1 ITEM DETAILS
inventoryRouter.put(
  "/:itemID",
  pictureupload.single("picture"),
  async (req, res) => {
    const pool = req.sqlPool;

    const { itemID } = req.params;

    const oldItemName = req.params.itemName;
    const picture = req.file ? req.file.filename : req.body.picture;
    console.log("file name is", picture);
    const itemName = req.body.itemName;

    const cabinet = req.body.cabinet;
    const counter = req.body.counter;
    const description = req.body.description;
    const ordered = req.body.ordered;
    const lostDamaged = req.body.lostDamaged;
    const remarks = req.body.remarks;

    try {
      pool.query(`UPDATE warehouse
            SET itemName = '${itemName}',
                description = '${description}',
                cabinet = ${cabinet},
                counter = ${counter},
                lostDamaged = ${lostDamaged},
                ordered = ${ordered},
                remarks = '${remarks}',
                picture = '${picture}'
            WHERE itemID = ${itemID}`);

      pool.query(`UPDATE orders
            SET itemName = '${itemName}'
            WHERE itemID = ${itemID}`);

      pool.query(`UPDATE transferItems
            SET itemName = '${itemName}'
            WHERE itemID = ${itemID}`);

      res.send({ message: "success" });
    } catch (error) {
      console.log("error is " + error.message);
      res.send({ message: error.message });
    }
  }
);

module.exports = inventoryRouter;
