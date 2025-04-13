import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FillBlanks = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fields, setFields] = useState([{ question: "", answer: "" }]);
  const [quizCode, setQuizCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBack = () => navigate("/dashboard");

  const handleAdd = () => {
    if (count < 10) {
      setFields([...fields, { question: "", answer: "" }]);
      setCount(count + 1);
    }
  };

  const handleRemove = () => {
    if (count > 1) {
      const updatedFields = [...fields];
      updatedFields.pop();
      setFields(updatedFields);
      setCount(count - 1);
      if (currentIndex >= count - 1) setCurrentIndex(count - 2);
    }
  };

  const handleChange = (field, value) => {
    const updatedFields = [...fields];
    updatedFields[currentIndex][field] = value;
    setFields(updatedFields);
  };

  const generateQuizCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = () => {
    console.log("All Fill-in-the-Blanks:", fields);
    const newCode = generateQuizCode();
    setQuizCode(newCode);
    alert("Quiz created successfully!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(quizCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePreview = () => {
    navigate("/fillpreview", { state: { quizCode, fields } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-100 shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Fill in the Blanks Quiz
        </h1>

        {/* Counter */}
        <div className="flex items-center justify-center mb-6 space-x-4">
          <button onClick={handleRemove} className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition">-</button>
          <span className="text-lg font-semibold">Total: {count}</span>
          <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">+</button>
        </div>

        {/* Current Question */}
        <div>
          <h2 className="text-xl font-semibold text-center mb-4">
            Question {currentIndex + 1} of {count}
          </h2>

          <label className="block mb-1 text-gray-700 font-medium">Question (use `____` for blank):</label>
          <textarea
            rows={2}
            value={fields[currentIndex].question}
            onChange={(e) => handleChange("question", e.target.value)}
            placeholder="e.g. The capital of France is ____."
            className="w-full p-3 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block mb-1 text-gray-700 font-medium">Answer:</label>
          <input
            type="text"
            value={fields[currentIndex].answer}
            onChange={(e) => handleChange("answer", e.target.value)}
            placeholder="Answer"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={handleBack} className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition">Back</button>

          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentIndex === 0}
              className="bg-yellow-500 text-white px-5 py-2 rounded-full disabled:opacity-50"
            >
              Previous
            </button>

            {currentIndex < count - 1 ? (
              <button
                onClick={() => {
                  const { question, answer } = fields[currentIndex];
                  if (!question.trim() || !answer.trim()) {
                    alert("Please fill in both the question and answer before proceeding.");
                    return;
                  }
                  setCurrentIndex((prev) => prev + 1);
                }}
                className="bg-yellow-500 text-white px-5 py-2 rounded-full"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => {
                  const { question, answer } = fields[currentIndex];
                  if (!question.trim() || !answer.trim()) {
                    alert("Please fill in both the question and answer before submitting.");
                    return;
                  }
                  handleSubmit();
                }}
                className="btn bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
              >
                Generate code
              </button>
            )}
          </div>
        </div>

        {/* Quiz Code + Buttons */}
        {quizCode && (
          <div className="mt-6 text-center text-lg font-semibold">
            <p>Quiz Created! Use this code to access the quiz:</p>
            <div className="flex items-center justify-center mt-2 space-x-3">
              <span className="text-2xl text-yellow-500">{quizCode}</span>
              <button
                onClick={handleCopy}
                className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition"
              >
                Copy
              </button>
              <button
                onClick={handlePreview}
                className="bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700 transition"
              >
                Preview
              </button>
            </div>
            {copied && <p className="text-green-600 text-sm mt-1">Code copied to clipboard!</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FillBlanks;
