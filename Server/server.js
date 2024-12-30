const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authenticateToken = require('./middleware/authenticateToken');
const authRoutes = require('./routes/authRoutes');
const employerRoutes = require('./routes/employerRoutes');
const jobSeekerRoutes = require('./routes/jobSeekerRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/jobify', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongodb successfully"))
  .catch((err) => console.log("Cannot connect to mongodb:", err));

// Routes
app.use('/auth', authRoutes);
app.use('/employer', authenticateToken, employerRoutes);
app.use('/jobseeker', authenticateToken, jobSeekerRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
