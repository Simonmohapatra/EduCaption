const express = require('express');
const router = express.Router();
const { saveTranscript, getTranscripts, health } = require('../controllers/captionController');

router.get('/health', health);
router.post('/captions', saveTranscript);
router.get('/transcripts', getTranscripts);

module.exports = router;