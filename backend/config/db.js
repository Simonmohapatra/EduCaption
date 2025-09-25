const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();

const hasMongo = !!process.env.MONGO_URI && process.env.MONGO_URI.trim() !== '';

async function connectMongoDB() {
  if (!hasMongo) {
    console.log('ℹ️  Skipping MongoDB: no MONGO_URI set');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
}

const sqliteDB = new sqlite3.Database('./transcripts.db', (err) => {
  if (err) {
    console.error('❌ SQLite connection error:', err.message);
  } else {
    console.log('✅ SQLite connected');
  }
});

sqliteDB.serialize(() => {
  sqliteDB.run(`
    CREATE TABLE IF NOT EXISTS transcripts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT,
      timestamp TEXT,
      text TEXT
    )
  `);
});

function mongoConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

module.exports = { connectMongoDB, sqliteDB, mongoConnected };