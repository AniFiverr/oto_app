const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

let InvoiceSchema = new Schema(
  {
    customer: String,
    date: {
      // type: Date,
      // default: Date.now,
      type: String,
      default: function () {
        return moment().format("YYYY-MM-DD");
        // return moment(Date.now()).format("YYYY-MM-DD");
      },
    },
    total_quantity: { type: Number, default: 0 },
    total_amount: { type: Number, default: 0 },
    transactions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  }
  // { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
