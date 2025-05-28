const axios = require('axios');
const ChatSession = require('../../database/models/ChatSession');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.chatWithGemini = async (req, res) => {
  try {
  const { message, sessionId, userId } = req.body;

    if (!message || !sessionId || !userId) {
      return res.status(400).json({ error: 'Use must login to use service' });
    }

    // Get or create chat session
    let session = await ChatSession.findOne({ sessionId, userId });
    if (!session) {
      session = await ChatSession.create({ sessionId, userId, messages: [] });
    }

    // Add user message to history
    session.messages.push({ role: 'user', text: message });

    // Build conversation history for Gemini
    const geminiMessages = session.messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Call Gemini
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: geminiMessages },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    session.messages.push({ role: 'assistant', text: reply });
    await session.save();

    res.json({ sessionId, reply, history: session.messages });
  } catch (err) {
    console.error('Gemini Error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Gemini AI error', detail: err?.response?.data });
  }
};

exports.getChatHistory = async (req, res) => {
    try {
        const { sessionId, userId } = req.query;
    
        if (!sessionId || !userId) {
        return res.status(400).json({ error: 'Missing sessionId or userId' });
        }
    
        const session = await ChatSession.findOne({ sessionId, userId });
        if (!session) {
        return res.status(404).json({ error: 'Chat session not found' });
        }
    
        res.json({ sessionId, history: session.messages });
    } catch (err) {
        console.error('Get Chat History Error:', err.message);
        res.status(500).json({ error: 'Server error', detail: err.message });
    }
}   
