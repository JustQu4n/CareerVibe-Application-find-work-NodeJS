const express = require('express');
const router = express.Router();
const {  chatWithGemini, getChatHistory, summarizeJobDescription } = require('../controllers/chatbot/chatbotController');
const  protect = require('../middlewares/authMiddleware');


// Route với lịch sử trò chuyện
router.post('/chat', chatWithGemini);
router.get('/history', getChatHistory);
// Add to your routes file
router.post('/summarize-jd', summarizeJobDescription);

module.exports = router;