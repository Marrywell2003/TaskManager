
//varianta curata 

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const userRoutes=require('./src/routes/userRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');


const app = express();

app.use(helmet()); 
app.use(cors());   
app.use(express.json()); 
app.use(morgan('dev')); 

app.get('/api/status', (req, res) => {
    res.json({ status: 'Online' });
});

app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/activity', activityRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});