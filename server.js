const express = require('express');
const bodyParser = require('body-parser');
const resultRoutes = require('./routes/resultRoutes');
const cors = require('cors'); 
const sequelize = require('./models/resultModel'); // Assurez-vous d'importer correctement votre configuration Sequelize

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());
app.use(cors());

// Routes des résultats
app.use('', resultRoutes);

// Synchronisez votre modèle avec la base de données
sequelize.sync()
  .then(() => {
    console.log('Resultat model synced with database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing Resultat model:', error);
  });
