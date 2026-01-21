const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware-uri esentiale
app.use(helmet()); 
app.use(cors());   
app.use(express.json()); 

//Sistem de logging (Morgan)
app.use(morgan('dev')); 

//Ruta de test pentru verificare
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'Online',
        message: 'Backend-ul Task Manager este configurat corect' 
    });
});

//Pornire server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT} în modul ${process.env.NODE_ENV}`);
});