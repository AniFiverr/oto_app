const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err));
const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB Connected");
});
// db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const InvoiceController = require("./controllers/InvoiceController");
const TransactionController = require("./controllers/TransactionController");

app.get("/invoices", InvoiceController.all);
app.post("/invoices", InvoiceController.create);
app.get("/invoices/:id", InvoiceController.find);
app.put("/invoices/:id", InvoiceController.update);
app.delete("/invoices/:id", InvoiceController.delete);

app.get("/transactions", TransactionController.all);
// app.get("/transactions/:id", TransactionController.find);

app.get("*", (req, res) => {
  res.send("Hello!! 👋");
});

app.listen(PORT, () => console.log(`App Listining on port ${PORT}`));
