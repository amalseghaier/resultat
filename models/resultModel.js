const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('examen', 'root', 'mysqlserver', {
  dialect: 'mysql',
  host: 'localhost',
});

const Utilisateur = require('./userModel'); // Assurez-vous d'importer correctement le modèle Utilisateur
const Examen = require('./examenModel'); // Assurez-vous d'importer correctement le modèle Examen
const Question = require('./questionModel'); // Assurez-vous d'importer correctement le modèle Question
const ReponseEtudiant = require('./ReponseEtudiant'); // Assurez-vous d'importer correctement le modèle ReponseEtudiant

// Définition du modèle Resultat
const Resultat = sequelize.define('resultat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_examen: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_question: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_etudiant: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_points: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  max_points: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  score_percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  id_reponse_etudiant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ReponseEtudiant,
      key: 'id',
    },
  },
});

// Définition des relations

ReponseEtudiant.belongsTo(Utilisateur, { 
  foreignKey: 'id_etudiant', 
  as: 'utilisateurs', // Modifier le nom de la relation à 'utilisateurs'
  constraints: false, // Désactiver les contraintes de type par défaut
  scope: {
    type_utilisateur: 'etudiant', // Filtrer par type d'utilisateur (ex: 'etudiant')
  },
});

Resultat.belongsTo(Examen, { foreignKey: 'id_examen', as: 'examen' });
Resultat.belongsTo(Question, { foreignKey: 'id_question', as: 'question' });
Resultat.belongsTo(ReponseEtudiant, { foreignKey: 'id_reponse_etudiant', as: 'reponseEtudiant' });

// Synchronisation du modèle avec la base de données pour créer la table
sequelize.sync()
  .then(() => {
    console.log('Table "resultats" créée avec succès.');
  })
  .catch((error) => {
    console.error('Erreur lors de la création de la table "resultats":', error);
  });

module.exports = Resultat;
