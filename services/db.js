const mongoose = require('mongoose');

const DB_URI = `mongodb+srv://artem:xGIAlfkCniCroUvw@cluster0.caxdkz9.mongodb.net/db-contacts`;

mongoose.connect(DB_URI);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Connection error:', err.message);
  process.exit(1);
});

db.once('open', () => {
  console.log('Database connection successful');
});

module.exports = db;
