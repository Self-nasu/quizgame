import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import QuizPage from "./Pages/QuizPage";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage></LoginPage>}></Route>
          <Route path="/quiz" element={<QuizPage></QuizPage>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
