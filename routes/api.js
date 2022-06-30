const express = require("express");
const router = express.Router();
const { createInvoice, getInvoice } = require("lightning");
const path = require("path");
const { homedir } = require("os");
const Datastore = require("nedb-promises");

const lnd = require("../ln/connect");
const logger = require("../logger");

const { DATABASE_FILE, APP_DIR } = process.env;
const ds = Datastore.create(path.join(homedir(), APP_DIR, DATABASE_FILE));

// creates lightning invoice
router.post("/invoice", async (req, res) => {
  const { name, lastname, email } = req.body;
  if (!name || !lastname || !email) {
    return res.status(400).json({
      success: false,
      error: "All fields are mandatory",
    });
  }
  try {
    const prefix = process.env.INVOICE_PREFIX || "";
    const description = prefix + "#LightningHackday POAP";
    const invoice = await createInvoice({
      lnd,
      description,
      tokens: process.env.TICKET_AMOUNT,
    });
    // We save user data
    await ds.insert({
      hash: invoice.id,
      name,
      lastname,
      email,
      paid: false,
      preimage: "",
      created: Date.now(),
    });

    return res.status(200).json({
      hash: invoice.id,
      request: invoice.request,
      description,
      amount: process.env.TICKET_AMOUNT,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ success: false });
  }
});

// lookup invoice status by hash
router.get("/invoice/:hash", async (req, res) => {
  const { hash } = req.params;
  if (!hash) {
    return res.status(200).json({
      success: false,
      error: "The invoice hash is mandatory",
    });
  }
  try {
    const invoice = await getInvoice({
      lnd,
      id: hash,
    });
    if (invoice.is_confirmed) {
      return res.status(200).json({
        paid: invoice.is_confirmed,
        preimage: invoice.secret,
        description: invoice.description,
        success: true,
      });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (e) {
    return res.status(200).json({ success: false });
  }
});

router.get("/user/:hash", async (req, res) => {
  const { hash } = req.params;
  if (!hash) {
    return res.status(200).json({
      success: false,
      error: "The invoice hash is mandatory",
    });
  }
  try {
    ds.loadDatabase();
    const userData = await ds.findOne({ hash });
    if (userData) {
      return res.status(200).json({ success: true, data: { ...userData } });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (e) {
    return res.status(200).json({ success: false });
  }
});

router.get("/verify/:preimage", async (req, res) => {
  const { preimage } = req.params;
  if (!preimage) {
    return res.status(200).json({
      success: false,
      error: "The preimage is mandatory",
    });
  }
  try {
    ds.loadDatabase();
    const userData = await ds.findOne({ preimage });
    if (userData) {
      return res.status(200).json({ success: true, data: { ...userData } });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (e) {
    return res.status(200).json({ success: false });
  }
});

module.exports = router;
