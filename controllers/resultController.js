// Import des modèles nécessaires
const Examen = require('../models/examenModel');
const Utilisateur = require('../models/userModel');
const Question = require('../models/questionModel');
const ReponseEtudiant = require('../models/ReponseEtudiant');

// Fonction asynchrone pour calculer le résultat de l'examen pour un étudiant spécifique
exports.calculateResult = async (req, res) => {
    try {
        // Extraire les identifiants de l'examen et de l'étudiant à partir des paramètres de la requête
        const { id_examen, id_etudiant } = req.params;

        // Récupérer les détails de l'examen à partir de l'ID
        const examen = await Examen.findByPk(id_examen);
        if (!examen) {
            return res.status(404).json({ error: 'Examen introuvable' });
        }

        // Récupérer les détails de l'étudiant à partir de l'ID
        const utilisateur = await Utilisateur.findByPk(id_etudiant);
        if (!utilisateur || utilisateur.type_utilisateur !== 'etudiant') {
            return res.status(404).json({ error: 'Étudiant introuvable ou type invalide' });
        }

        // Récupérer toutes les questions de l'examen
        const questions = await Question.findAll({ where: { id_examen } });

        // Récupérer toutes les réponses de l'étudiant pour l'examen
        const studentResponses = await ReponseEtudiant.findAll({
            where: { id_examen, id_etudiant },
        });

        // Calculer le nombre total de points basé sur les réponses correctes de l'étudiant
        let totalPoints = 0;
        for (const question of questions) {
            const studentResponse = studentResponses.find(response => response.id_question === question.id);
            if (!studentResponse) {
                continue; // L'étudiant n'a pas répondu à cette question
            }

            if (question.type_question === 'choix_multiple') {
                // Vérifier si toutes les réponses sélectionnées par l'étudiant sont correctes
                const studentSelectedResponses = studentResponse.reponses.split(',').map(res => res.trim());
                const correctResponses = question.Reponse_correcte.split(',').map(res => res.trim());
                const allCorrect = studentSelectedResponses.every(selectedResponse =>
                    correctResponses.includes(selectedResponse)
                );
                if (allCorrect) {
                    totalPoints += question.points; // Toutes les réponses sont correctes, attribuer les points
                } else {
                    totalPoints += 0; // Aucune réponse ou réponse incorrecte, aucun point attribué
                }
            } else if (question.type_question === 'choix_unique') {
                // Vérifier si la réponse sélectionnée par l'étudiant est correcte
                if (studentResponse.reponse === question.Reponse_correcte) {
                    totalPoints += question.points;
                }
            }
        }

        // Calculer le pourcentage de score
        const maxPoints = questions.reduce((sum, question) => sum + question.points, 0);
        const scorePercentage = (totalPoints / maxPoints) * 100;

        // Retourner les résultats du calcul
        res.status(200).json({ totalPoints, maxPoints, scorePercentage });
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors du calcul du résultat :', error);
        res.status(500).json({ error: 'Une erreur s\'est produite lors du calcul du résultat' });
    }
};
