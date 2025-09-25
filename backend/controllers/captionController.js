const Transcript = require('../models/Transcript');
const { sqliteDB, mongoConnected } = require('../config/db');

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDB.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function allSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDB.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

const saveTranscript = async (req, res) => {
  const { subject, text, timestamp } = req.body || {};
  if (!subject || !text) {
    return res.status(400).json({ error: 'subject and text are required' });
  }
  const isoTime = timestamp || new Date().toISOString();

  let mongoResult = { tried: false, saved: false, id: null, error: null };
  if (mongoConnected()) {
    mongoResult.tried = true;
    try {
      const doc = await Transcript.create({ subject, text, timestamp: isoTime });
      mongoResult.saved = true;
      mongoResult.id = doc._id;
    } catch (e) {
      mongoResult.error = e.message;
    }
  }

  let sqliteResult = { saved: false, id: null, error: null };
  try {
    const r = await runSql(
      'INSERT INTO transcripts (subject, timestamp, text) VALUES (?, ?, ?)',
      [subject, isoTime, text]
    );
    sqliteResult.saved = true;
    sqliteResult.id = r.lastID;
  } catch (e) {
    sqliteResult.error = e.message;
  }

  if (!mongoResult.saved && !sqliteResult.saved) {
    return res.status(500).json({ error: 'Failed to save in both databases', mongoResult, sqliteResult });
  }

  return res.status(201).json({
    message: 'Saved',
    mongo: mongoResult,
    sqlite: sqliteResult,
    data: { subject, text, timestamp: isoTime }
  });
};

const getTranscripts = async (_req, res) => {
  let mongo = [];
  let mongoStatus = 'skipped';
  if (mongoConnected()) {
    try {
      mongo = await Transcript.find().sort({ timestamp: -1 });
      mongoStatus = 'ok';
    } catch (e) {
      mongoStatus = 'error: ' + e.message;
    }
  }

  try {
    const sqlite = await allSql(
      'SELECT id, subject, timestamp, text FROM transcripts ORDER BY datetime(timestamp) DESC'
    );
    return res.json({
      mongoStatus,
      mongoCount: mongo.length,
      sqliteCount: sqlite.length,
      mongo,
      sqlite
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const health = (_req, res) => {
  res.json({ server: 'ok', mongoConnected: mongoConnected(), sqlite: 'ok' });
};

module.exports = { saveTranscript, getTranscripts, health };