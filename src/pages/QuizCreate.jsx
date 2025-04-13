import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QuizCreate = () => {
  const [numQuestions, setNumQuestions] = useState(1);
  const [quizData, setQuizData] = useState([
    { question: "", options: ["", "", "", ""], answer: null },
  ]);
  const [quizCode, setQuizCode] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState({ type: "", message: "" });
  const [focusedOption, setFocusedOption] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Clear errors when user corrects invalid inputs
    const current = quizData[currentQuestion];
    if (error.type === "question" && current.question.trim()) {
      setError({ type: "", message: "" });
    } else if (
      error.type === "options" &&
      !current.options.some((opt) => !opt.trim())
    ) {
      setError({ type: "", message: "" });
    } else if (error.type === "answer" && current.answer !== null) {
      setError({ type: "", message: "" });
    }
  }, [quizData, currentQuestion, error.type]);

  const increaseQuestions = () => {
    if (numQuestions < 100) {
      const newNum = numQuestions + 1;
      setNumQuestions(newNum);
      setQuizData((prevData) => [
        ...prevData,
        { question: "", options: ["", "", "", ""], answer: null },
      ]);
    }
  };

  const decreaseQuestions = () => {
    if (numQuestions > 1) {
      const newNum = numQuestions - 1;
      setNumQuestions(newNum);
      setQuizData((prevData) => prevData.slice(0, newNum));
      if (currentQuestion >= newNum) {
        setCurrentQuestion(newNum - 1);
      }
    }
  };

  const handleQuestionChange = (index, value) => {
    setQuizData((prevData) => {
      const newData = [...prevData];
      newData[index].question = value;
      return newData;
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuizData((prevData) => {
      const newData = [...prevData];
      newData[questionIndex].options[optionIndex] = value;
      return newData;
    });
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setQuizData((prevData) => {
      const newData = [...prevData];
      newData[questionIndex].answer = optionIndex;
      return newData;
    });
  };

  const handleKeyDown = (e, optionIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (optionIndex < 3) {
        setFocusedOption(optionIndex + 1);
        document
          .getElementById(`option-${currentQuestion}-${optionIndex + 1}`)
          ?.focus();
      }
    }
  };

  const validateCurrentQuestion = () => {
    const current = quizData[currentQuestion];

    // Validate question input
    if (!current.question.trim()) {
      setError({ type: "question", message: "Please enter a question." });
      return false;
    }

    // Validate options
    if (current.options.some((opt) => !opt.trim())) {
      setError({ type: "options", message: "Please fill in all options." });
      return false;
    }

    // Validate answer selection
    if (current.answer === null) {
      setError({ type: "answer", message: "Please select the correct answer." });
      return false;
    }

    setError({ type: "", message: "" });
    return true;
  };

  const handleNext = () => {
    // Validate current question before moving to the next
    if (!validateCurrentQuestion()) return;

    if (currentQuestion < numQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setFocusedOption(0);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(currentQuestion - 1);
    setFocusedOption(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateCurrentQuestion()) return;
    const code = `QZ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setQuizCode(code);
  };

  const handlePreviewClick = () => {
    navigate("/preview", {
      state: {
        quizData,
        quizCode,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-800">
      <div className="mt-10 bg-gray-100 p-8 rounded-3xl shadow-md max-w-xl sm:w-full md:w-[550px] lg:w-[600px] mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">Create a New Quiz</h1>

        {/* Question Controls */}
        <div className="mt-4">
          <label className="block text-xl font-semibold mb-1">
            Number of Questions
          </label>
          <div className="flex items-center">
            <button
              onClick={decreaseQuestions}
              disabled={numQuestions <= 1}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              -
            </button>
            <div className="bg-white border border-gray-300 px-6 py-2 text-center font-semibold rounded-full mx-2">
              {numQuestions}
            </div>
            <button
              onClick={increaseQuestions}
              disabled={numQuestions >= 100}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>

        {/* Quiz Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xl font-semibold">
                Question {currentQuestion + 1}
              </label>
              <input
                type="text"
                placeholder="Enter your question here"
                value={quizData[currentQuestion].question}
                onChange={(e) =>
                  handleQuestionChange(currentQuestion, e.target.value)
                }
                className={`w-full p-2 mt-1 rounded-2xl text-gray-800 outline-none border ${
                  error.type === "question"
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label className="block text-xl font-semibold">Options</label>
              {quizData[currentQuestion].options.map((option, optionIndex) => (
                <div key={optionIndex} className="mt-1 flex items-center">
                  <input
                    type="radio"
                    name={`correct-answer-${currentQuestion}`}
                    checked={quizData[currentQuestion].answer === optionIndex}
                    onChange={() =>
                      handleAnswerSelect(currentQuestion, optionIndex)
                    }
                    className={`mr-3 w-6 h-6 cursor-pointer ${
                      error.type === "answer" ? "border-red-500" : ""
                    }`}
                  />
                  <input
                    id={`option-${currentQuestion}-${optionIndex}`}
                    type="text"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(
                        currentQuestion,
                        optionIndex,
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => handleKeyDown(e, optionIndex)}
                    className={`w-full p-2 rounded-2xl text-gray-800 outline-none border ${
                      error.type === "options"
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    autoFocus={optionIndex === focusedOption}
                  />
                </div>
              ))}
            </div>
          </div>

          {error.message && (
            <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error.message}
            </div>
          )}

          <div className="flex justify-between mt-3">
            {currentQuestion > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-gray-500 px-6 py-2 rounded-xl text-white font-semibold hover:bg-gray-600"
              >
                Previous
              </button>
            )}
            {currentQuestion < numQuestions - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-indigo-600 px-6 py-2 rounded-xl text-white font-semibold hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 btn text-white font-semibold mx-auto"
              >
                Generate Quiz Code
              </button>
            )}
          </div>
        </form>

        {quizCode && (
          <>
            <div className="mt-6 text-center text-lg font-semibold">
              <p>Quiz Created! Use this code to access the quiz:</p>
              <p className="text-2xl text-yellow-500">{quizCode}</p>
            </div>

            <div className="text-center mt-3">
              <button
                onClick={handlePreviewClick}
                className="bg-blue-600 btn text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Preview Quiz
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizCreate;