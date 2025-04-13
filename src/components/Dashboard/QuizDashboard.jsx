import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const quizzes = [
  { id: 1, title: "React Basics", time: "Now", status: "Live", code: "QZ-REACT" },
  { id: 2, title: "CSS Challenge", time: "Ends in 30 min", status: "Live", code: "QZ-CSS" },
  { id: 3, title: "JavaScript Quiz", time: "Today at 5 PM", status: "Upcoming", code: "QZ-JS" },
  { id: 4, title: "Database MCQs", time: "Tomorrow 10 AM", status: "Upcoming", code: "QZ-DB" },
  { id: 5, title: "HTML Practice", time: "Yesterday", status: "Completed", code: "QZ-HTML" },
  { id: 6, title: "Node.js Basics", time: "Last week", status: "Completed", code: "QZ-NODE" },
];

const statusLabels = {
  Live: "Live Quizzes",
  Upcoming: "Upcoming Quizzes",
  Completed: "Past Quizzes",
};

function QuizDashboard() {
  const [searchCode, setSearchCode] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const quiz = quizzes.find(
      (q) => q.code.toLowerCase() === searchCode.trim().toLowerCase()
    );
    if (quiz) {
      alert(`Found Quiz: ${quiz.title}`);
      // navigate(`/quiz/${quiz.id}`);
    } else {
      alert("No quiz found with this code.");
    }
  };

  const getQuizzesByStatus = (status) =>
    quizzes.filter((q) => q.status === status);

  const renderSection = (status) => {
    const filtered = getQuizzesByStatus(status);
    return (
      <div key={status} className="mb-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          {statusLabels[status]}
        </h1>
        {filtered.length === 0 ? (
          <p className="text-gray-500 italic">No {status.toLowerCase()} quizzes available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {quiz.title}
                </h2>
                <p className="text-sm text-gray-500 mb-3">{quiz.time}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                    quiz.status === "Live"
                      ? "bg-[#B64870]/10 text-[#B64870]"
                      : quiz.status === "Upcoming"
                      ? "bg-red-100 text-red-500"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {quiz.status}
                </span>
                <button
                  onClick={() => {
                    if (quiz.status === "Live") {
                      navigate("/join");
                    } else if (quiz.status === "Upcoming") {
                      setSelectedQuiz(quiz);
                    }
                  }}
                  className={`w-full py-2 text-sm font-semibold rounded-xl transition duration-200 transform ${
                    quiz.status === "Live"
                      ? "bg-gradient-to-r from-[#B64870] to-[#4E0080] text-white hover:brightness-110 hover:scale-105"
                      : quiz.status === "Upcoming"
                      ? "bg-gradient-to-r from-red-400 to-red-700 text-white hover:brightness-110 hover:scale-105"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                  disabled={quiz.status === "Completed"}
                >
                  {quiz.status === "Live"
                    ? "Join Now"
                    : quiz.status === "Upcoming"
                    ? "View Details"
                    : "Completed"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Search Bar */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center gap-4 justify-center">
          <input
            type="text"
            placeholder="Enter Quiz Code (e.g. QZ-REACT)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full md:w-80 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 btn  text-white font-semibold rounded-xl transition"
          >
            Search Quiz
          </button>
        </div>

        {/* Quiz Sections */}
        {Object.keys(statusLabels).map((status) => renderSection(status))}

        {/* Modal for View Details */}
        {selectedQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-xl rounded-2xl shadow-lg p-6 relative">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedQuiz.title}</h2>
              <p className="mb-2 text-gray-700"><strong>Scheduled Time:</strong> {selectedQuiz.time}</p>
              <p className="mb-2 text-gray-700"><strong>Status:</strong> {selectedQuiz.status}</p>
              <p className="mb-2 text-gray-700"><strong>Code:</strong> {selectedQuiz.code}</p>
              <p className="mb-4 text-gray-600">
                <strong>Description:</strong> This quiz is a great way to test and grow your skills in this subject. 
                Stay sharp and be ready for the challenge!
              </p>
              <div className="text-right">
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizDashboard;
