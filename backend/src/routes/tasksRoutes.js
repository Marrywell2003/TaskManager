//date din baza de date pt tasks 

const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebaseAdmin'); // Avem nevoie de admin pentru Timestamp
const verifyToken = require('../middleware/authMiddleware');

router.post('/create', verifyToken, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      assignedTo, 
      assignedToName, 
      priority, 
      dueDate 
    } = req.body;

    // 1. Verificăm permisiunile managerului
    const managerDoc = await db.collection('users').doc(req.user.uid).get();
    if (!managerDoc.exists || managerDoc.data().role !== 'Manager') {
      return res.status(403).json({ error: 'Acces interzis. Doar managerii pot crea sarcini.' });
    }

    // 2. Construim obiectul task conform structurii tale
    const newTask = {
      title,
      description,
      assignedTo,      // UID String
      assignedToName,  // Nume String (Denormalizat)
      createdBy: req.user.uid, // UID-ul managerului curent
      status: 'todo',  // Valoare fixă la creare
      priority: priority || 'medium',
      // Convertim data primită în Firebase Timestamp sau folosim null
      dueDate: dueDate ? admin.firestore.Timestamp.fromDate(new Date(dueDate)) : null,
      createdAt: admin.firestore.Timestamp.now() // Data creării
    };

    const docRef = await db.collection('tasks').add(newTask);
    
    res.status(201).json({ 
      id: docRef.id, 
      ...newTask,
      // Trimitem înapoi datele formatate pentru frontend
      createdAt: newTask.createdAt.toDate(),
      dueDate: newTask.dueDate ? newTask.dueDate.toDate() : null
    });
  } catch (error) {
    console.error("Task Creation Error:", error);
    res.status(500).json({ error: 'Eroare la crearea task-ului.' });
  }
});

module.exports = router;