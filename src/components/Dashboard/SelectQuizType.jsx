import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import api from "../../utils/axios";

const QuizTypeModal = ({ isOpen, onClose }) => {
  const [selectedQuizType, setSelectedQuizType] = useState("MCQ");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState(""); // New state for description
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quizTitle || !quizDescription || !selectedQuizType) {
      setError("Please fill out all fields.");
      return;
    }
    setError(""); // Clear error message if validation is successful
    try {
      const response = await api.post(
        "/quiz/create-quiz",
        { title: quizTitle, description: quizDescription, quizType: selectedQuizType },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        alert("Quiz created successfully!");
        setQuizTitle("");
        setQuizDescription(""); // Reset description
        // Redirect based on quiz type
        if (selectedQuizType === "MCQ") {
          navigate("/createQuiz");
        } else if (selectedQuizType === "Fill in the Blank") {
          navigate("/fillQuiz");
        }
      } else {
        setError(response.data.message || "Failed to create quiz. Please try again.");
      }
    } catch (error) {
      console.log("Error in quiz creation", error);
      setError(error.message);
    }
  };

  return (
    <div className="fixed w-screen z-50 h-screen inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-xl font-semibold">Enter quiz title</h2>
        <input
          type="text"
          name="quiz-title"
          className="pl-2 m-2 ml-0 border rounded-lg cursor-pointer w-full"
          onChange={(e) => setQuizTitle(e.target.value)}
          value={quizTitle}
          placeholder="Quiz Title"
        />
        <h2 className="text-xl font-semibold">Enter quiz description</h2>
        <textarea
          name="quiz-description"
          className="pl-2 m-2 ml-0 border rounded-lg cursor-pointer w-full h-24"
          onChange={(e) => setQuizDescription(e.target.value)}
          value={quizDescription}
          placeholder="Quiz Description"
        />
        <h2 className="text-xl font-semibold">Select a quiz type</h2>
        <p className="text-gray-500 text-sm">
          Choose from multiple choice or fill in the blanks
        </p>

        <div className="flex mt-4 space-x-4">
          <div
            className={`w-1/2 p-4 border rounded-lg cursor-pointer ${
              selectedQuizType === "MCQ" ? "border-black" : ""
            }`}
            onClick={() => setSelectedQuizType("MCQ")}
          >
            <div className="w-full h-24 bg-gray-200 rounded"></div>
            <div className="mt-2 flex justify-between items-center">
              <span className="font-semibold">Multiple choice</span>
              <input
                type="radio"
                name="quizType"
                checked={selectedQuizType === "MCQ"}
                className="accent-black"
                readOnly
              />
            </div>
            <p className="text-xs text-gray-500">
              Only with single select answer
            </p>
          </div>
          <div
            className={`w-1/2 p-4 border rounded-lg cursor-pointer ${
              selectedQuizType === "Fill in the Blank" ? "border-black" : ""
            }`}
            onClick={() => setSelectedQuizType("Fill in the Blank")}
          >
            <div className="w-full h-24 bg-gray-200 rounded"></div>
            <div className="mt-2 flex justify-between items-center">
              <span className="font-semibold">Fill in the blanks</span>
              <input
                type="radio"
                name="quizType"
                checked={selectedQuizType === "Fill in the Blank"}
                className="accent-black"
                readOnly
              />
            </div>
            <p className="text-xs text-gray-500">Fill the blanks</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded-lg"
            onClick={handleSubmit}
          >
            Select & Next
          </button>
        </div>
        {error && (
          <div className="mb-4 p-2 m-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTypeModal;