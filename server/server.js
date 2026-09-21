const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const problemRoutes = require('./routes/problemRoutes');
const Problem = require('./models/Problem');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/problems', problemRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auto-seed if database is empty on start
const autoSeedIfEmpty = async () => {
  try {
    const count = await Problem.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Seeding initial DSA problems...');
      const { seedProblems } = require('./controllers/problemController');
      // call mock req, res
      await seedProblems({ query: {} }, { json: (data) => console.log('✅ Seed result:', data.message), status: () => ({ json: console.error }) });
    }
  } catch (err) {
    console.error('Seed check failed:', err.message);
  }
};

setTimeout(autoSeedIfEmpty, 2000);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
