const Examen =require('../models/examenModel')
const Utilisateur =require('../models/userModel')
const Question =require('../models/questionModel')
const ReponseEtudiant  =require('../models/ReponseEtudiant')

// Calculate the result for a given exam and student
exports.calculateResult = async (req, res) => {
  try {
    const { id_examen, id_etudiant } = req.params;

    // Fetch exam details
    const examen = await Examen.findByPk(id_examen);
    if (!examen) {
      return res.status(404).json({ error: 'Examen not found' });
    }

    // Fetch student details
    const utilisateur = await Utilisateur.findByPk(id_etudiant);
    if (!utilisateur || utilisateur.type_utilisateur !== 'etudiant') {
      return res.status(404).json({ error: 'Étudiant not found or invalid type' });
    }

    // Fetch all questions for the exam
    const questions = await Question.findAll({ where: { id_examen } });

    // Fetch all student responses for the exam
    const studentResponses = await ReponseEtudiant.findAll({
      where: { id_examen, id_etudiant },
    });

    // Calculate total points based on correct answers
    let totalPoints = 0;
    for (const question of questions) {
      const studentResponse = studentResponses.find(response => response.id_question === question.id);
      if (!studentResponse) {
        continue; // Student did not answer this question
      }

      if (question.type === 'choix_unique') {
        if (studentResponse.reponse === question.Reponse_correcte) {
          totalPoints += question.points;
        }
      } else if (question.type === 'choix_multiple') {
        // Logic for handling multiple choice questions
        const correctAnswers = question.Reponse_correcte.split(','); // Assuming correct answers are comma-separated
        const selectedAnswers = studentResponse.reponse.split(','); // Assuming selected answers are comma-separated
        const fractionOfPoints = question.points / correctAnswers.length; // Divide points by the number of correct answers

        for (const answer of selectedAnswers) {
          if (correctAnswers.includes(answer)) {
            totalPoints += fractionOfPoints; // Add fraction of points for each correct selected answer
          }
        }
      } else if (question.type === 'vrai_faux') {
        if (studentResponse.reponse === question.Reponse_correcte) {
          totalPoints += question.points;
        }
      } else {
        // Add logic to handle other question types if needed
      }
    }

    // Calculate the score percentage
    const maxPoints = questions.reduce((sum, question) => sum + question.points, 0);
    const scorePercentage = (totalPoints / maxPoints) * 100;

    res.status(200).json({ totalPoints, maxPoints, scorePercentage });
  } catch (error) {
    console.error('Error calculating result:', error);
    res.status(500).json({ error: 'An error occurred while calculating the result' });
  }
};
