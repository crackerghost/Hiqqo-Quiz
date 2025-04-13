import React, { useState } from "react";

const quizzes = [
  {
    id: 1,
    title: "Data structure and algorithm with C++ (Quiz)",
    author: "Jaya Kishori",
    time: "14:29 PM, 25 August",
    status: "Published", // Published or Draft
  },
  {
    id: 2,
    title: "Operating system (Quiz)",
    author: "Jaya Kishori",
    time: "14:23 PM, 25 August",
    status: "Draft",
  },
  {
    id: 3,
    title: "Weekly coding test (Quiz)",
    author: "Jaya Kishori",
    time: "14:23 PM, 25 August",
    status: "Published",
  },
  {
    id: 4,
    title: "System design with Java (Quiz)",
    author: "Jaya Kishori",
    time: "14:23 PM, 25 August",
    status: "Draft",
  },
  {
    id: 5,
    title: "Web dev daily coding test (Quiz)",
    author: "Jaya Kishori",
    time: "14:23 PM, 25 August",
    status: "Published",
  },
];

const MyLibrary = () => {
  const [activeTab, setActiveTab] = useState("Published");

  // Filter quizzes based on their status
  const filteredQuizzes = quizzes.filter(
    (quiz) => quiz.status === activeTab
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded text-base font-medium transition duration-200 ${
            activeTab === "Published"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("Published")}
        >
          Published
        </button>
        <button
          className={`px-4 py-2 rounded text-base font-medium transition duration-200 ${
            activeTab === "Draft"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("Draft")}
        >
          Draft
        </button>
      </div>

      {/* Quiz List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {filteredQuizzes.length === 0 ? (
          <div className="p-4 text-gray-500">No quizzes available.</div>
        ) : (
          filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center py-4 px-5 border-b last:border-b-0 hover:bg-gray-50 transition duration-200"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {quiz.author} • {quiz.time}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="ml-4 flex items-center space-x-4">
                <button className="px-4 py-2 border-2 border-gray-900 text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition duration-200">
                  👁 Preview
                </button>
                <button className="px-4 py-2 btn bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition duration-200">
                  📡 Live quiz
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  ⋮
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyLibrary;
