import React, { useState, useEffect } from "react";
import { FaFilter, FaSort, FaUsers, FaTrash, FaSearch, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const generateQuizzes = () => {
  const topics = ["Data Structures", "Algorithms", "React", "Node.js", "CSS", "JavaScript"];
  const types = ["Quiz", "Assessment", "Practice Test", "Final Exam"];
  const statuses = ["Completed", "Ongoing", "Draft"];
  
  return new Array(20).fill().map((_, i) => {
    const status = statuses[i % statuses.length];
    const isDraft = status === "Draft";
    
    return {
      id: `quiz-${i + 1}`,
      title: `${topics[i % topics.length]} ${types[i % types.length]} #${i + 1}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      participants: isDraft ? 0 : Math.floor(Math.random() * 100) + 5,
      progress: isDraft ? 0 : Math.floor(Math.random() * 100),
      status,
      avgScore: isDraft ? null : Math.floor(Math.random() * 30) + 50,
      duration: `${Math.floor(Math.random() * 30) + 15} mins`,
      questions: Math.floor(Math.random() * 20) + 5
    };
  });
};

const Reports = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
    participants: "",
    progress: ""
  });
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const data = generateQuizzes();
    setQuizzes(data);
    setFilteredQuizzes(data);
  }, []);

  useEffect(() => {
    let results = [...quizzes];

    if (searchTerm) {
      results = results.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status) {
      results = results.filter(quiz => quiz.status === filters.status);
    }
    if (filters.dateRange) {
      const now = new Date();
      if (filters.dateRange === "last-week") {
        results = results.filter(quiz => {
          const quizDate = new Date(quiz.date);
          return quizDate > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        });
      } else if (filters.dateRange === "last-month") {
        results = results.filter(quiz => {
          const quizDate = new Date(quiz.date);
          return quizDate > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        });
      }
    }
    if (filters.participants) {
      if (filters.participants === "high") {
        results = results.filter(quiz => quiz.participants >= 50 && quiz.status !== "Draft");
      } else {
        results = results.filter(quiz => quiz.participants < 50 && quiz.status !== "Draft");
      }
    }
    if (filters.progress) {
      if (filters.progress === "high") {
        results = results.filter(quiz => quiz.progress >= 70 && quiz.status !== "Draft");
      } else if (filters.progress === "medium") {
        results = results.filter(quiz => quiz.progress >= 30 && quiz.progress < 70 && quiz.status !== "Draft");
      } else {
        results = results.filter(quiz => quiz.progress < 30 && quiz.status !== "Draft");
      }
    }

    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredQuizzes(results);
  }, [quizzes, searchTerm, filters, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      dateRange: "",
      participants: "",
      progress: ""
    });
    setSearchTerm("");
  };

  const deleteQuiz = (id) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-6">Quiz Reports</h1>
       {/* 👇 Summary Stats Block */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 p-4 rounded-xl shadow text-center">
          <p className="text-sm text-indigo-800 font-medium">Total Quizzes</p>
          <p className="text-2xl font-bold text-indigo-900">{quizzes.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-xl shadow text-center">
          <p className="text-sm text-green-800 font-medium">Avg. Score</p>
          <p className="text-2xl font-bold text-green-900">
            {
              quizzes.filter(q => q.avgScore !== null).length > 0
                ? `${Math.round(quizzes.reduce((sum, q) => sum + (q.avgScore || 0), 0) / quizzes.filter(q => q.avgScore !== null).length)}%`
                : "N/A"
            }
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-xl shadow text-center">
          <p className="text-sm text-yellow-800 font-medium">Total Participants</p>
          <p className="text-2xl font-bold text-yellow-900">
            {quizzes.reduce((sum, q) => sum + (q.participants || 0), 0)}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-xl shadow text-center">
          <p className="text-sm text-purple-800 font-medium">Completed Quizzes</p>
          <p className="text-2xl font-bold text-purple-900">
            {quizzes.filter(q => q.status === "Completed").length}
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-xl flex items-center space-x-2 ${showFilters ? "bg-indigo-100 border-indigo-500" : ""}`}
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filter Quizzes</h3>
            <button onClick={resetFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
              Reset all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Time</option>
                <option value="last-week">Last Week</option>
                <option value="last-month">Last Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
              <select
                value={filters.participants}
                onChange={(e) => handleFilterChange("participants", e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All</option>
                <option value="high">50+ Participants</option>
                <option value="low">Below 50</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
              <select
                value={filters.progress}
                onChange={(e) => handleFilterChange("progress", e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All</option>
                <option value="high">High (70%+)</option>
                <option value="medium">Medium (30-70%)</option>
                <option value="low">Low (Below 30%)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sort Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredQuizzes.length} of {quizzes.length} quizzes
        </p>
        <div className="flex space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button
            onClick={() => handleSort("date")}
            className={`text-sm px-3 py-1 rounded ${sortConfig.key === "date" ? "bg-indigo-100 text-indigo-700" : "text-gray-600"}`}
          >
            Date {sortConfig.key === "date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("participants")}
            className={`text-sm px-3 py-1 rounded ${sortConfig.key === "participants" ? "bg-indigo-100 text-indigo-700" : "text-gray-600"}`}
          >
            Participants {sortConfig.key === "participants" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("progress")}
            className={`text-sm px-3 py-1 rounded ${sortConfig.key === "progress" ? "bg-indigo-100 text-indigo-700" : "text-gray-600"}`}
          >
            Progress {sortConfig.key === "progress" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* Quiz List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredQuizzes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No quizzes match your filters.</p>
            <button onClick={resetFilters} className="mt-2 text-indigo-600 hover:text-indigo-800">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 hover:bg-gray-50 transition cursor-pointer"
                onClick={() => setSelectedQuiz(quiz)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-3 md:mb-0 md:w-1/3">
                    <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FaCalendarAlt className="mr-1" />
                      <span>{formatDate(quiz.date)}</span>
                      <span className="mx-2">•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        quiz.status === "Completed" ? "bg-green-100 text-green-800" :
                        quiz.status === "Ongoing" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {quiz.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 md:w-2/3">
                    {quiz.status === "Draft" ? (
                      <>
                        <div className="flex-1"></div>
                        <div className="text-sm text-gray-400 italic">Not published</div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 w-24">
                          <FaUsers />
                          <span>{quiz.participants}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  quiz.progress >= 70 ? "bg-green-500" :
                                  quiz.progress >= 30 ? "bg-yellow-500" :
                                  "bg-red-500"
                                }`}
                                style={{ width: `${quiz.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm w-12">{quiz.progress}%</span>
                          </div>
                        </div>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to delete this quiz?")) {
                          deleteQuiz(quiz.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz Detail Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{selectedQuiz.title}</h2>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FaCalendarAlt className="mr-1" />
                    <span>{formatDate(selectedQuiz.date)}</span>
                    <span className="mx-2">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedQuiz.status === "Completed" ? "bg-green-100 text-green-800" :
                      selectedQuiz.status === "Ongoing" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {selectedQuiz.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {selectedQuiz.status !== "Draft" ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                      <FaChartLine className="mr-2" /> Performance Overview
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Average Score</p>
                        <p className="font-semibold">{selectedQuiz.avgScore}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${selectedQuiz.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{selectedQuiz.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">Draft Preview</h3>
                    <p className="text-sm text-gray-600">
                      This quiz hasn't been published yet. Publish it to make it available to participants.
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Quiz Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold">{selectedQuiz.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Questions</p>
                      <p className="font-semibold">{selectedQuiz.questions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold">{selectedQuiz.duration}</p>
                    </div>
                    {selectedQuiz.status !== "Draft" && (
                      <div>
                        <p className="text-sm text-gray-500">Participants</p>
                        <p className="font-semibold">{selectedQuiz.participants}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-700 mb-2">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedQuiz.status !== "Draft" && (
                    <>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        View Detailed Report
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Export Data
                      </button>
                    </>
                  )}
                  {selectedQuiz.status === "Draft" && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Publish Quiz
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete this ${selectedQuiz.status.toLowerCase()} quiz?`)) {
                        deleteQuiz(selectedQuiz.id);
                        setSelectedQuiz(null);
                      }
                    }}
                    className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    Delete Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;