let InvoiceModel = require("../models/InvoiceModel");
let TransactionModel = require("../models/TransactionModel");

let InvoiceController = {
  all: (req, res) => {
    InvoiceModel.find({}, (err, data) => {
      if (err) {
        res.status(400).json({ err });
      } else {
        // console.log(data);
        res.json(data);
      }
    }).populate("transactions");
    // });
  },

  create: async (req, res) => {
    // console.log(req.body);
    let invoice = req.body;

    let newInvoice = new InvoiceModel(req.body);
    // console.log({ newInvoice });

    let newTransactions;
    if (invoice.transactions.length) {
      newTransactions = invoice.transactions.map((i) => {
        i.line_total = i.quantity * i.price;
        newInvoice.total_amount =
          Number(newInvoice.total_amount) + Number(i.line_total);
        newInvoice.total_quantity =
          Number(newInvoice.total_quantity) + Number(i.quantity);

        i.invoice_id = newInvoice._id;
        return new TransactionModel(i);
      });
      // console.log({ newTransactions });
      newInvoice.transactions = newTransactions;
    }

    // console.log({ newInvoice, newTransactions });
    // res.send(newInvoice);

    try {
      TransactionModel.collection.insertMany(newTransactions);
      let savedInvoice = await newInvoice.save();

      // console.log({ savedInvoice });
      res.send(savedInvoice);
      // res.send(newInvoice);
      // res.json("Invoice Added");
    } catch (err) {
      res.status(400).json("Error: " + err);
    }
  },

  find: (req, res) => {
    console.log(req.params);
    InvoiceModel.find({ _id: req.params.id }, (err, data) => {
      if (err) {
        res.status(400).json({ err });
      } else {
        // console.log(data);
        res.json(data);
      }
    }).populate("transactions");
    // });
  },

  update: async (req, res) => {
    // console.log(req.params, req.body);
    let data = req.body;
    // let newInvoice = req.body;

    data?.date && delete data.date;

    let newInvoice = InvoiceModel({ ...data, _id: req.params.id });
    let oldInvoice = await InvoiceModel.find({ _id: req.params.id });
    //   .populate(
    //   "transactions"
    // );

    if (!oldInvoice.length) {
      res
        .status(400)
        .json({ _id: "No Invoice present at ID: " + req.params.id });
      return;
    }

    // console.log({ newInvoice, data, oldInvoice });

    // Transaction to remove
    let prevT = data.transactions?.map((t) => t._id);
    let remT = oldInvoice[0].transactions?.filter(
      (ot) => !prevT.includes(String(ot._id || ot))
    );

    // console.log({ prevT, remT });

    let newTransactions;
    if (data.transactions.length) {
      newTransactions = data.transactions.map((i) => {
        i.line_total = i.quantity * i.price;
        newInvoice.total_amount =
          Number(newInvoice.total_amount) + Number(i.line_total);
        newInvoice.total_quantity =
          Number(newInvoice.total_quantity) + Number(i.quantity);
        i.invoice_id = newInvoice._id;
        // if (i._id) {
        //   return TransactionModel(i);
        // } else {
        return new TransactionModel(i);
        // }
      });
      // console.log({ newTransactions });
      newInvoice.transactions = newTransactions;
    }

    // console.log({ newInvoice, newTransactions });
    let opsArr = [];
    try {
      opsArr = newTransactions.map((t) => ({
        updateOne: {
          filter: { _id: t._id },
          update: { $set: t },
          upsert: true,
        },
      }));

      remT.map((t) => {
        let d = {
          deleteOne: {
            filter: { _id: t._id },
          },
        };

        opsArr.push(d);
      });

      // console.log({ opsArr });
      let savedTransactions = await TransactionModel.collection.bulkWrite(
        opsArr
      );

      let savedInvoice = await InvoiceModel.updateOne(
        { _id: req.params.id },
        newInvoice
      );

      console.log({ savedTransactions, savedInvoice });
      // res.send({ savedTransactions, savedInvoice });
      res.send({ newInvoice });
      // res.json("Invoice Added");
      // res.json({status:"Invoice Added",data:{ _id: req.params.id, savedTransactions, savedInvoice} }))
    } catch (err) {
      res.status(400).json({ err });
    }
  },

  delete: (req, res) => {
    console.log(req.params);
    InvoiceModel.findByIdAndDelete(req.params.id)
      .then(() => res.send("Invoice Deleted"))
      // .then(() => res.json({status:"Invoice Deleted",data:{ _id: req.params.id} }))
      .catch((err) => res.status(400).json({ err }));
  },
};

module.exports = InvoiceController;
