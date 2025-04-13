// Preview.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FillPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div className="text-center mt-10 text-red-500">No quiz data found!</div>;

  const { quizCode, fields } = state;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Quiz Preview</h1>
        <p className="text-center mb-4 text-lg">
          <strong>Quiz Code:</strong>{" "}
          <span className="text-yellow-500 font-bold">{quizCode}</span>
        </p>

        <div className="space-y-6">
          {fields.map((q, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border border-gray-300">
              <p className="font-semibold mb-2">Q{index + 1}: {q.question}</p>
              <p className="text-gray-700">Answer: <span className="font-medium">{q.answer}</span></p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("./dashboard")}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default FillPreview;
