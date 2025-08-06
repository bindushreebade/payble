const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const insightRoutes = require('./routes/insight');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/insight', insightRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// Routes
app.use('/api/insight', require('./routes/insight'));

app.listen(5050, () => console.log('✅ Server running on http://localhost:5050'));

