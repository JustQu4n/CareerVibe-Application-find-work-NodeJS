const express = require('express');
const router = express.Router();
const {  chatWithGemini, getChatHistory } = require('../controllers/chatbot/chatbotController');
const  protect = require('../middlewares/authMiddleware');


// Route với lịch sử trò chuyện
router.post('/chat', chatWithGemini);
router.get('/history', getChatHistory);

module.exports = router;