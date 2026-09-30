require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDataStore } = require('./models/dataStore');

const studentRoutes = require('./routes/studentRoutes');
const resultRoutes = require('./routes/resultRoutes');
const searchRoutes = require('./routes/searchRoutes');
const benchmarkRoutes = require('./routes/benchmarkRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const configRoutes = require('./routes/configRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    project: 'Student Ranking and Result Processing System (DAA Academic Project)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/benchmark', benchmarkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/config', configRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
async function startServer() {
  await initDataStore();
  app.listen(PORT, () => {
    console.log(`🚀 DAA Student Ranking & Result Processing Backend running on port ${PORT}`);
  });
}

startServer();
