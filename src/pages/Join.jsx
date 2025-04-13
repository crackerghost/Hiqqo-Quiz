import React from "react";
import { useNavigate } from "react-router-dom";

const JoinPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="h-screen bg-white flex justify-center items-center overflow-hidden">
      {/* Join Box - white card with shadow */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-300">
        <h1 className="text-3xl font-bold text-black text-center mb-6">
          Enter a join code
        </h1>

        <div className="flex justify-center space-x-2 mb-6">
          <input
            type="text"
            placeholder="Enter code"
            className="px-4 py-2 rounded-full w-64 text-black outline-none border border-gray-300"
          />
          <button className="btn bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full transition">
            Join
          </button>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            className="btn bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
