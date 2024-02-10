const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require('path');
const mongoose = require("mongoose");
const contactsRouter = require("./routes/contactsRouter");
const favoriteRouter = require("./routes/favoriteRouter");
const userRouter = require('./routes/userRouter');
const db = require("./services/db");

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/contacts", favoriteRouter);
app.use('/users', userRouter);



app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.use(express.static(path.join(__dirname, 'public')));



const PORT = process.env.PORT || 3000;

db.once('open', () => {
  console.log('Database connection successful');
  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
});

db.on('error', (err) => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
