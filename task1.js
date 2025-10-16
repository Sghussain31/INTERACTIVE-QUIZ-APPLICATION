import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/components/ui/card";
import { Button } from "/components/ui/button";
import { Label } from "/components/ui/label";
import { RadioGroup, RadioGroupItem } from "/components/ui/radio-group";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QuizApp = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      explanation: "Paris is the capital and most populous city of France."
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      explanation: "Mars appears red due to iron oxide (rust) on its surface."
    },
    {
      id: 3,
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correctAnswer: 1,
      explanation: "The blue whale is the largest animal ever known to have existed."
    },
    {
      id: 4,
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
      correctAnswer: 1,
      explanation: "Oxygen is essential for most life forms and has atomic number 8."
    },
    {
      id: 5,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: 1,
      explanation: "William Shakespeare wrote this famous tragedy in the late 16th century."
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setShowFeedback(false);
    setTimeLeft(30);
    setTimerActive(true);
  };

  const handleAnswerSelect = (value: string) => {
    if (showFeedback) return;
    
    const answerIndex = parseInt(value);
    setSelectedAnswer(answerIndex);
    setTimerActive(false);
    
    // Check if answer is correct
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setShowFeedback(true);
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(30);  
      setTimerActive(true);
    } else {
      setQuizCompleted(true);
      setTimerActive(false);
    }
  };

  const handleRestartQuiz = () => {
    startQuiz();
  };

  const getAnswerColor = (index: number) => {
    if (!showFeedback) return "";
    
    if (index === currentQuestion.correctAnswer) {
      return "bg-green-100 border-green-500 text-green-900";
    } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
      return "bg-red-100 border-red-500 text-red-900";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Quiz Challenge</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Test your knowledge with this interactive quiz
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            {!quizCompleted ? (
              <>
                {/* Progress and Score */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    Score: {score}
                  </div>
                </div>

                {/* Timer */}
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Time remaining:</Label>
                    <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}`}>
                      {timeLeft}s
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(timeLeft / 30) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <Card className="mb-6 bg-white border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      {currentQuestion.question}
                    </h3>
                  </CardContent>
                </Card>

                {/* Answer Options */}
                <RadioGroup 
                  value={selectedAnswer !== null ? selectedAnswer.toString() : ""}
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        getAnswerColor(index) || 
                        (selectedAnswer === index ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:border-blue-300")
                      }`}
                      onClick={() => !showFeedback && handleAnswerSelect(index.toString())}
                    >
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`}
                        disabled={showFeedback}
                      />
                      <Label 
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer text-lg font-medium"
                      >
                        {option}
                      </Label>
                      {showFeedback && index === currentQuestion.correctAnswer && (
                        <span className="text-green-600 font-bold">✓ Correct</span>
                      )}
                      {showFeedback && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                        <span className="text-red-600 font-bold">✗ Incorrect</span>
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {/* Feedback */}
                {showFeedback && (
                  <Card className={`mt-6 border-l-4 ${
                    selectedAnswer === currentQuestion.correctAnswer ? 
                    'border-l-green-500 bg-green-50' : 
                    'border-l-red-500 bg-red-50'
                  }`}>
                    <CardContent className="p-4">
                      <h4 className={`font-semibold mb-2 ${
                        selectedAnswer === currentQuestion.correctAnswer ? 
                        'text-green-700' : 'text-red-700'
                      }`}>
                        {selectedAnswer === currentQuestion.correctAnswer ? 
                         "Correct! Well done!" : "Incorrect. Better luck next time!"}
                      </h4>
                      <p className="text-muted-foreground">
                        {currentQuestion.explanation}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation */}
                <div className="flex justify-end mt-6">
                  {showFeedback ? (
                    <Button 
                      onClick={handleNextQuestion}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 
                       "Next Question" : "Finish Quiz"}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={handleTimeUp}
                      disabled={selectedAnswer !== null}
                      className="border-red-500 text-red-600 hover:bg-red-50"
                    >
                      Skip Question
                    </Button>
                  )}
                </div>
              </>
            ) : (
              /* Quiz Results */
              <div className="text-center py-8">
                <div className="mb-6">
                  <img 
                    src="https://placeholder-image-service.onrender.com/image/200x200?prompt=Trophy%20with%20gold%20medal%20and%20sparkles%20celebrating%20achievement&id=quiz-trophy-12345" 
                    alt="Golden trophy with celebration sparkles representing quiz completion achievement"
                    className="mx-auto mb-4 rounded-lg"
                  />
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Quiz Completed!
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    You've finished the quiz challenge
                  </p>
                </div>

                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {score} / {questions.length}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      Final Score
                    </div>
                    <div className="mt-4 text-sm text-blue-500">
                      {score === questions.length ? "Perfect score! Amazing!" :
                       score >= questions.length * 0.8 ? "Excellent performance!" :
                       score >= questions.length * 0.6 ? "Good job!" :
                       "Keep practicing!"}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={handleRestartQuiz}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-2"
                  >
                    Share Results
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start Quiz Button (only show when not started) */}
        {currentQuestionIndex === 0 && selectedAnswer === null && !quizCompleted && !timerActive && (
          <div className="text-center mt-6">
            <Button 
              onClick={startQuiz}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              Start Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;
