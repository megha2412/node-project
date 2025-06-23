const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error-handler');

dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use(errorHandler);


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
