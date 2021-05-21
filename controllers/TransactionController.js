let InvoiceModel = require("../models/InvoiceModel");
let TransactionModel = require("../models/TransactionModel");

let TransactionController = {
  all: (req, res) => {
    TransactionModel.find({}, (err, data) => {
      if (err) {
        res.status(400).json("Error: " + err);
      } else {
        // console.log(data);
        res.json(data);
      }
    });
    // }).populate("invoice_id");
  },
  // create: (req, res) => {
  //   // console.log(req.body);
  //   let invoice = req.body;

  //   let newInvoice = new InvoiceModel(req.body);
  //   // console.log({ newInvoice });

  //   let newTransactions;
  //   if (invoice.transactions.length) {
  //     newTransactions = invoice.transactions.map((i) => {
  //       i.line_total = i.quantity * i.price;
  //       newInvoice.total_amount =
  //         Number(newInvoice.total_amount) + Number(i.line_total);
  //       newInvoice.total_quantity =
  //         Number(newInvoice.total_quantity) + Number(i.quantity);
  //       return new TransactionModel(i);
  //     });
  //     // console.log({ newTransactions });
  //     newInvoice.transactions = newTransactions;
  //   }

  //   console.log({ newInvoice, newTransactions });
  //   // res.send(newInvoice);

  //   newInvoice.save((err) => {
  //     if (err) {
  //       res.status(400).json("Error: " + err);
  //     } else {
  //       res.json("Invoice Added");
  //     }
  //   });
  // },
  // find: (req, res) => {
  //   console.log(req.params);
  //   TransactionModel.find({ _id: req.params.id }, (err, data) => {
  //     if (err) {
  //       res.status(400).json("Error: " + err);
  //     } else {
  //       // console.log(data);
  //       res.json(data);
  //     }
  //   });
  // },
  // update: (req, res) => {
  //   console.log(req.params, req.body);

  //   InvoiceModel.updateOne({ _id: req.params.id }, req.body, (err, r) => {
  //     if (err) {
  //       res.status(400).json("Error: " + err);
  //     } else {
  //       res.json("Invoice Updated");
  //       console.log(r);
  //     }
  //   });
  // },
  // delete: (req, res) => {
  //   console.log(req.params);
  //   InvoiceModel.findByIdAndDelete(req.params.id)
  //     .then(() => res.json("Invoice Deleted."))
  //     .catch((err) => res.status(400).json("Error: " + err));
  // },
};

module.exports = TransactionController;
