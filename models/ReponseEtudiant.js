const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('examen', 'root', 'mysqlserver', {
  dialect: 'mysql',
  host: 'localhost',
});

const Utilisateur = require('./userModel');
const Examen = require('./examenModel');
const Question = require('./questionModel');

const ReponseEtudiant = sequelize.define('reponse_etudiant', {
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
  reponse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define associations after all models have been defined
ReponseEtudiant.belongsTo(Utilisateur, {
  foreignKey: 'id_etudiant',
  as: 'etudiant', // Changed 'utilisateurs' to 'etudiant' for clarity
  constraints: false,
  scope: {
    type_utilisateur: 'etudiant',
  },
});

ReponseEtudiant.belongsTo(Examen, { foreignKey: 'id_examen', as: 'examen' });
ReponseEtudiant.belongsTo(Question, { foreignKey: 'id_question', as: 'question' });

sequelize.sync()
  .then(() => {
    console.log('Table "reponse_etudiant" créée avec succès.');
  })
  .catch((error) => {
    console.error('Erreur lors de la création de la table "reponse_etudiant":', error);
  });

module.exports = ReponseEtudiant;
