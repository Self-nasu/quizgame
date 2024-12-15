import React, { useEffect, useState } from "react";
import "./Quiz.css";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebaseConfig";


export default function QuizPage() {
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState(false);
  const [selectedAns, setSelectedAns] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestionsFromFirestore() {
      try {
        const querySnapshot = await getDocs(collection(db, "quiz_questions"));
        const allQuestions = querySnapshot.docs.map(doc => doc.data());
        
        // Shuffle and select 5 random questions
        const randomQuestions = allQuestions
          .sort(() => Math.random() - 0.5) // Shuffle
          .slice(0, 7); // Select 5 questions
        setQuestions(randomQuestions);
      } catch (error) {
        console.error("Error fetching questions from Firestore:", error);
        setQuestions([]);
      }
    }
    fetchQuestionsFromFirestore();
  }, []);

  const handleNext = () => {
    if (selectedAns) {
      if (selectedAns === questions[quizIndex].correct_answer) {
        setScore(score + 100);
      }

      setSelectedAns(null);

      if (quizIndex + 1 < questions.length) {
        setQuizIndex(quizIndex + 1);
      } else {
        setQuizState(true);
      }
    } else {
      alert("Please select an option.");
    }
  };

  const handleRestart = () => {
    setQuizIndex(0);
    setScore(0);
    setQuizState(false);
  };

  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const renderQuestion = () => {
    if (questions.length === 0 || !questions[quizIndex]) {
      return <p>Error loading questions or no questions available.</p>;
    }

    const currentQuestion = questions[quizIndex];
    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    allAnswers.sort();

    return (
      <div className="quiz-container">
        <h3 className="mb-4">{`Question ${quizIndex + 1} of ${questions.length}`}</h3>
        <p className="question fs-5 fw-bold">{decodeHTML(currentQuestion.question)}</p>
        <div className="btn-group-vertical w-100 mt-3 gap-2" role="group">
          {allAnswers.map((answer, index) => (
            <label
              key={index}
              className={`btn btn-outline-primary text-start ${selectedAns === answer ? "active" : ""}`}
              onClick={() => setSelectedAns(answer)}
            >
              <input
                type="radio"
                id={`answer-${index}`}
                name="answer"
                value={answer}
                checked={selectedAns === answer}
                onChange={() => setSelectedAns(answer)}
                style={{ display: "none" }}
              />
              {decodeHTML(answer)}
            </label>
          ))}
        </div>
        <button
          className="btn btn-primary mt-4"
          onClick={handleNext}
          disabled={!selectedAns}
        >
          {quizIndex + 1 < questions.length ? "Next" : "Submit"}
        </button>
      </div>
    );
  };

  const renderCompletionScreen = () => (
    <div className="quiz-container">
      <h2>Quiz Completed!</h2>
      <p>Your Score: {score} / {questions.length * 100}</p>
      <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={handleRestart}>Restart Quiz</button>
         <button className="btn btn-secondary" onClick={() => navigate("/")}>Back to Home</button>
      </div>

    </div>
  );

  return (
    <>
      <div id="score" className="position-absolute">
        <div className="input-group">
          <div className="input-group-text">Score</div>
          <p className="form-control m-0 w-auto">{score}</p>
        </div>
      </div>

      <div id="main-area" className="container d-flex justify-content-center align-items-center">
        <div id="QuizArea" className="container bg-light d-flex shadow-lg rounded-2 p-3">
          {questions.length === 0 ? (
            <p>Loading...</p>
          ) : quizState ? (
            renderCompletionScreen()
          ) : (
            renderQuestion()
          )}
        </div>
      </div>
    </>
  );
}
