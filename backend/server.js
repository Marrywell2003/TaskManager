const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(helmet()); 
app.use(cors());   
app.use(express.json()); 

app.use(morgan('dev')); 
//ruta de test
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'Online',
        message: 'Backend-ul Task Manager este configurat corect' 
    });
});
//ruta noua pt detalii task-uri
app.get('/api/stats/summary', (req, res) => {
    res.json({
        totalTasks: 15,
        completedTasks: 10,
        pendingTasks: 5,
        efficiencyRate: '66%',
        lastUpdated: new Date().toLocaleTimeString()
    });
});
//pt activitate user sau manager
app.get('/api/activity', (req, res) => {
    const activities = [
        { id: 1, user: 'Manager', action: 'A aprobat Task-ul #102', time: '10 min ago' },
        { id: 2, user: 'User1', action: 'A finalizat "Documentație API"', time: '2h ago' },
        { id: 3, user: 'User2', action: 'A adăugat un task nou', time: '5h ago' }
    ];
    res.json(activities);
});

const PORT = process.env.PORT || 5000;

app.use((req, res) => {
    res.status(404).json({ message: "Ruta nu a fost găsită!" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Ceva s-a stricat în backend!" });
});

app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT} în modul ${process.env.NODE_ENV}`);
});