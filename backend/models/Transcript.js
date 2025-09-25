const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  text: { type: String, required: true },
});

module.exports = mongoose.model('Transcript', transcriptSchema);