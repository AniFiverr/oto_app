const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({
  product: String,
  quantity: Number,
  price: Number,
  line_total: Number,
  invoice_id: {
    type: mongoose.Types.ObjectId,
    ref: "Invoice",
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
