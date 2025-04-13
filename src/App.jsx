import "./App.css";
import "animate.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/LandingPage/Landing";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import JoinPage from "./pages/Join";
import QuizPage from "./pages/QuizPage";
import QuizCreate from "./pages/QuizCreate";
import QuizPreview from "./pages/QuizPreview";
import Error from "./components/Common/Error";
import Navbar from "./components/Common/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import FillBlanks from "./pages/FillBlanks";
import FillPreview from "./pages/FillPreview";
import { createContext, useState } from "react";

export const DataProvider = createContext() 

function App() {
  const [page, setPage] = useState("dashboard");
  // const [page,setPage] = useState(0)
  const [token,setToken] = useState(localStorage.getItem("token") || null)

  return (
    <DataProvider.Provider value={{page,setPage,token,setToken}}>
    <BrowserRouter>
      <Navbar />
      <div className="my-20">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-pass" element={<ForgotPassword />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/fillblanks" element={<FillBlanks/>} />
          <Route path="/quizpage" element={<QuizPage />} />
          <Route path="/createQuiz" element={<QuizCreate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preview" element={<QuizPreview />} />
          <Route path="/fillpreview" element={<FillPreview/>} />
          
          <Route path="*" element={<Error />} />
        </Routes>
      </div>

      <footer className="bg-[rgb(8,25,72)] text-white  p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 QuizMaster. All rights reserved.</p>
        </div>
      </footer>
    </BrowserRouter>
    </DataProvider.Provider>
  );
}

export default App;
