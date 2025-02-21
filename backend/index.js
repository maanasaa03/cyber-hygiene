const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const WHOIS_API_KEY = process.env.WHOIS_API_KEY;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['authorization'];
  if (!token) return res.status(403).send('A token is required for authentication');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};

// SignUp Endpoint
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ user_id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '2h' });
      return res.status(200).json({ token });
    }
    res.status(400).send('Invalid credentials');
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
});

// Verify Token Endpoint
app.post('/verify-token', verifyToken, (req, res) => {
  res.status(200).json({ isValid: true });
});

// Chatbot Endpoint (Gemini API)
app.post('/chatbot', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to fetch response from chatbot' });
  }
});

// Website Analysis Endpoint
app.post('/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url || !/^https?:\/\/.+\..+$/.test(url)) {
    return res.status(400).json({ error: 'Valid URL is required' });
  }

  try {
    // Fetch website content with headers to mimic a browser
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const textContent = response.data;

    // AI-based content analysis
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const aiResult = await model.generateContent([
      "Analyze the following website content for security, readability, spelling errors, and quality:",
      textContent.slice(0, 5000)
    ]);
    const aiAnalysis = aiResult.response.text();

    // Website security check
    let securityScore = 100;
    let isSecure = url.startsWith('https');
    if (!isSecure) securityScore -= 30;

    try {
      const virusTotalResponse = await axios.get(
        `https://www.virustotal.com/api/v3/urls/${encodeURIComponent(url)}`,
        { headers: { 'x-apikey': VIRUSTOTAL_API_KEY } }
      );
      if (virusTotalResponse.data.data.attributes.last_analysis_stats.malicious > 0) {
        securityScore -= 50;
      }
    } catch (error) {
      console.warn('VirusTotal API Error:', error.response?.data || error.message);
    }

    try {
      const whoisResponse = await axios.get(
        `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${WHOIS_API_KEY}&domainName=${url}`
      );
      const domainAge = whoisResponse.data.WhoisRecord?.createdDate;
      if (domainAge) {
        const ageInYears = (new Date() - new Date(domainAge)) / (1000 * 60 * 60 * 24 * 365);
        if (ageInYears < 1) securityScore -= 20;
      }
    } catch (error) {
      console.warn('WHOIS API Error:', error.response?.data || error.message);
    }

    const riskKeywords = [
      "scam", "phishing", "malware", "unsafe", "low credibility",
      "spelling errors", "poor readability", "grammar errors",
      "fake", "unverified", "fraud", "suspicious","not secure","does not have an SSL certificate"
    ];
    let aiRiskDetected = riskKeywords.some(keyword => aiAnalysis.includes(keyword));
    
    if (aiRiskDetected) {
      securityScore -= 30; // Reduce score further if AI detects risks
    }

    // Prevent negative scores
    securityScore = Math.max(securityScore, 0);

    res.json({ securityScore, analysis: aiAnalysis });
  } catch (error) {
    console.error('Website Analysis Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to analyze website. The website may block automated requests.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



