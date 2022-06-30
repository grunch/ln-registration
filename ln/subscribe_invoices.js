const { subscribeToInvoices } = require("lightning");
const path = require("path");
const { homedir } = require("os");
const Datastore = require("nedb-promises");

const lnd = require("./connect");
const logger = require("../logger");

const { DATABASE_FILE, APP_DIR } = process.env;
const ds = Datastore.create(path.join(homedir(), APP_DIR, DATABASE_FILE));

const subscribeInvoices = async () => {
  try {
    const sub = subscribeToInvoices({ lnd });
    sub.on("invoice_updated", async (invoice) => {
      if (!invoice.is_confirmed) return;
      ds.loadDatabase();
      // Una vez una invoice generada por el nodo haya sido pagada
      // guardamos en base de datos la invoice como pagada
      await ds.update(
        { hash: invoice.id },
        { $set: { paid: true, preimage: invoice.secret } },
        { multi: false }
      );
      logger.info(`Invoice ${invoice.id} paid!`);
    });
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports = subscribeInvoices;
