import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function QuizPage() {
    const [questions, setQuestions] = useState([]); // Store quiz questions
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
    const [score, setScore] = useState(0); // Track user score
    const [isQuizCompleted, setIsQuizCompleted] = useState(false); // To show score after completion
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple");
                const data = await response.json();
                setQuestions(data.results); // Store API results in questions
            } catch (error) {
                console.error("Error fetching quiz questions:", error);
            }
        }
        fetchQuestions();
    }, []);

    // Handle Next button click
    const handleNext = () => {
        if (selectedAnswer) {
            // Check if the selected answer is correct
            if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
                setScore(score + 1); // Increment score for a correct answer
            }

            setSelectedAnswer(null); // Reset selected answer

            // Move to the next question or complete the quiz
            if (currentQuestionIndex + 1 < questions.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setIsQuizCompleted(true); // Mark quiz as completed
            }
        } else {
            alert("Please select an answer before proceeding.");
        }
    };

    // Restart Quiz or Navigate Back
    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsQuizCompleted(false);
    };

    // Render quiz question
    const renderQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5); // Shuffle answers

        return (
            <div className="quiz-container">
                <h3>{`Question ${currentQuestionIndex + 1} of ${questions.length}`}</h3>
                <p className="question">{currentQuestion.question}</p>
                <div className="answers">
                    {allAnswers.map((answer, index) => (
                        <div key={index} className="answer-option">
                            <input
                                type="radio"
                                id={`answer-${index}`}
                                name="answer"
                                value={answer}
                                checked={selectedAnswer === answer}
                                onChange={() => setSelectedAnswer(answer)}
                            />
                            <label htmlFor={`answer-${index}`}>{answer}</label>
                        </div>
                    ))}
                </div>
                <button className="btn btn-primary" onClick={handleNext}>
                    {currentQuestionIndex + 1 < questions.length ? "Next" : "Submit"}
                </button>
            </div>
        );
    };

    // Render quiz completion screen
    const renderCompletionScreen = () => (
        <div className="quiz-container">
            <h2>Quiz Completed!</h2>
            <p>Your Score: {score} / {questions.length}</p>
            <button className="btn btn-secondary" onClick={handleRestart}>Restart Quiz</button>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>Back to Home</button>
        </div>
    );

    return (
        <div className="quiz-page">
            {questions.length === 0 ? (
                <p>Loading questions...</p>
            ) : isQuizCompleted ? (
                renderCompletionScreen()
            ) : (
                renderQuestion()
            )}
        </div>
    );
}
