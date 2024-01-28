const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const contactsRouter = require("./routes/contactsRouter");
const favoriteRouter = require('./routes/favoriteRouter');
const db = require("./services/db"); // Імпортуємо об'єкт підключення до бази даних

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/favorite-contacts", favoriteRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

// Використовуємо метод `once` для обробки успішного підключення до бази даних
db.once('open', () => {
  console.log('Database connection successful');
  // Запускаємо сервер тільки після успішного підключення до бази даних
  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
});

// Обробляємо помилку підключення до бази даних
db.on('error', (err) => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
