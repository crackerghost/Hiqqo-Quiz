const Quiz = require("../models/Quiz");

// Helper function to find a quiz by ID
const findQuizById = async (quizId) => {
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        return quiz;
    } catch (error) {
        throw error;
    }
};

// Helper function to handle errors
const handleError = (error, res) => {
    return res.status(500).json({ message: error.message });
};

// Create the quiz
const quizCreate = async (req, res) => {
    const { title, quizType } = req.body;
    try {
        const quiz = new Quiz({ title, quizType });
        await quiz.save();
        return res.status(200).json({ message: "Quiz Created successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// update the quiz
const updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const updateData = req.body;


        // Find and update the quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { ...updateData},
            { new: true, runValidators: true }
        );

        if (!updatedQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json({ message: "Quiz updated successfully", updatedQuiz });
    } catch (error) {
        res.status(500).json({ message: "Error updating quiz", error: error.message });
    }
};

const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const { questionText, options, correctAnswer, timeLimit } = req.body;
    try {
        const quiz = await findQuizById(quizId);
        const question = quiz.questions.id(questionId);
        if (!question) {
            throw new Error("Question not found");
        }
        question.questionText = questionText;
        question.options = options;
        question.correctAnswer = correctAnswer;
        question.timeLimit = timeLimit;
        await quiz.save();
        return res.status(200).json({ message: "Question updated successfully!" });
    } catch (error) {
        return handleError(error, res);
    }
};

// deleteQuiz the quiz
const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    try {
        const quiz = await Quiz.findByIdAndDelete(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        return res.status(200).json({ message: "Quiz deleted successfully!" });
    } catch (error) {
        return handleError(error, res);
    }
};

// Create the new question
const createQuestion = async (req, res) => {
    const { quizId } = req.params;
    const { questionText, options, correctAnswer, timeLimit } = req.body;
    try {
        const quiz = await findQuizById(quizId);

        // Create the new question
        const newQuestion = {
            questionText,
            options,
            correctAnswer,
            timeLimit
        };

        // Add the new question to the questions array
        quiz.questions.push(newQuestion);

        // Save the updated quiz
        await quiz.save();

        return res.status(200).json({ message: "Question added successfully!" });
    } catch (error) {
        return handleError(error, res);
    }
};

// delete the question
const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    try {
        const quiz = await findQuizById(quizId);

        // Check if the questionId exists in the questions array
        const question = quiz.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Remove the question
        quiz.questions = quiz.questions.filter(question => question._id.toString() !== questionId);

        // Save the updated quiz
        await quiz.save();

        return res.status(200).json({ message: "Question deleted successfully!" });
    } catch (error) {
        return handleError(error, res);
    }
};

module.exports = { quizCreate, updateQuiz, deleteQuiz, createQuestion, deleteQuestion ,updateQuestion};
