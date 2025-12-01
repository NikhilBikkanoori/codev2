const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes - wrapped in try-catch
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/sessions', require('./routes/sessions'));
  app.use('/api/admin', require('./routes/admin'));
  app.use('/api/admin/data', require('./routes/adminData'));
  app.use('/api/students', require('./routes/students'));
  app.use('/api/mentors', require('./routes/mentors'));
  console.log('✅ All routes loaded');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
  process.exit(1);
}

app.get('/', (req, res) => res.send({ ok: true, msg: 'Drop Shield Backend running' }));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Express error handler to log stacks for debugging
app.use((err, req, res, next) => {
  console.error('Express error handler caught:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ msg: 'Server error' });
});
