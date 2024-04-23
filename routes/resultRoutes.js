const express = require('express');
const router = express.Router();
const { calculateResult } = require('../controllers/resultController');

// Créer un nouveau résultat
router.get('/:id_examen/:id_etudiant', calculateResult);

// Obtenir tous les résultats

module.exports = router;