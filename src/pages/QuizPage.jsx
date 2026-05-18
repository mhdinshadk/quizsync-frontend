import { useEffect, useState } from "react";
import { socket } from "../socket";

const QuizPage = () => {
  const [questionData, setQuestionData] =
    useState(() => {
      const saved = localStorage.getItem(
        "currentQuestion"
      );

      return saved
        ? JSON.parse(saved)
        : null;
    });

  const [timer, setTimer] =
    useState(10);

  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const [scores, setScores] =
    useState({});

  const [liveScores, setLiveScores] =
    useState({});

  const [quizEnded, setQuizEnded] =
    useState(false);

  const roomCode =
    localStorage.getItem("roomCode");

  const playerName =
    localStorage.getItem("playerName");

  // SOCKET EVENTS

  useEffect(() => {
    socket.on("new_question", (data) => {
      localStorage.setItem(
        "currentQuestion",
        JSON.stringify(data)
      );

      setQuestionData(data);

      setSelectedAnswer("");

      setSubmitted(false);
    });

    socket.on(
      "timer_update",
      (timeLeft) => {
        setTimer(timeLeft);
      }
    );

    socket.on(
      "score_update",
      (scoresData) => {
        setLiveScores(scoresData);
      }
    );

    socket.on(
      "quiz_ended",
      (data) => {
        setQuizEnded(true);

        setScores(data.scores);
      }
    );

    return () => {
      socket.off("new_question");

      socket.off("timer_update");

      socket.off("score_update");

      socket.off("quiz_ended");
    };
  }, []);

  // SELECT ANSWER

  const selectAnswer = (option) => {
    if (submitted) return;

    setSelectedAnswer(option);
  };

  // SUBMIT ANSWER

  const submitAnswer = () => {
    if (!selectedAnswer) return;

    socket.emit("submit_answer", {
      roomCode,
      answer: selectedAnswer,
      playerName,
    });

    setSubmitted(true);
  };

  // BACK TO HOME

  const goHome = () => {
    localStorage.removeItem(
      "currentQuestion"
    );

    localStorage.removeItem(
      "roomCode"
    );

    window.location.href = "/";
  };

  // FINAL RESULT SCREEN

  if (quizEnded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl p-10">

          <h1 className="text-5xl font-black text-center mb-10">
            Quiz Results
          </h1>

          {/* FINAL LEADERBOARD */}

          <div className="space-y-5 mb-10">
            {Object.entries(scores)
              .sort((a, b) => b[1] - a[1])
              .map(
                ([name, score], index) => (
                  <div
                    key={name}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-5">

                      <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-xl font-black">
                        #{index + 1}
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold">
                          {name}
                        </h2>

                        <p className="text-zinc-400">
                          Player
                        </p>
                      </div>
                    </div>

                    <div className="text-4xl font-black">
                      {score} /{" "}
                      {
                        questionData?.totalQuestions
                      }
                    </div>
                  </div>
                )
              )}
          </div>

          {/* HOME BUTTON */}

          <button
            onClick={goHome}
            className="w-full bg-white text-black py-5 rounded-2xl text-2xl font-black hover:scale-[1.01] transition-all duration-300"
          >
            Back To Home
          </button>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl p-10">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-10">

          <div>
            <p className="text-zinc-400 mb-2 uppercase tracking-widest">
              Live Quiz
            </p>

            <h2 className="text-3xl font-black">
              Question{" "}
              {
                questionData?.questionNumber
              }{" "}
              /
              {
                questionData?.totalQuestions
              }
            </h2>
          </div>

          {/* TIMER */}

          <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-4xl font-black">
            {timer}
          </div>
        </div>

        {/* LIVE LEADERBOARD */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-10">

          <h2 className="text-xl font-black mb-4">
            Live Leaderboard
          </h2>

          <div className="space-y-3">
            {Object.entries(liveScores)
              .sort((a, b) => b[1] - a[1])
              .map(([name, score]) => (
                <div
                  key={name}
                  className="flex justify-between items-center bg-black rounded-xl px-4 py-3"
                >
                  <span className="font-bold">
                    {name}
                  </span>

                  <span className="text-2xl font-black">
                    {score}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* QUESTION */}

        <h1 className="text-5xl font-black leading-snug mb-12">
          {
            questionData?.question
              ?.question
          }
        </h1>

        {/* OPTIONS */}

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {questionData?.question?.options.map(
            (option) => (
              <button
                key={option}
                onClick={() =>
                  selectAnswer(option)
                }
                disabled={submitted}
                className={`p-6 rounded-2xl text-xl font-bold border transition-all duration-300

                ${
                  selectedAnswer === option
                    ? "bg-white text-black border-white scale-[1.02]"
                    : "bg-zinc-900 border-zinc-800 hover:bg-white hover:text-black"
                }

                ${
                  submitted
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }
                `}
              >
                {option}
              </button>
            )
          )}
        </div>

        {/* SUBMIT BUTTON */}

        <button
          onClick={submitAnswer}
          disabled={
            !selectedAnswer || submitted
          }
          className={`w-full py-5 rounded-2xl text-2xl font-black transition-all duration-300

          ${
            !selectedAnswer || submitted
              ? "bg-zinc-700 cursor-not-allowed"
              : "bg-white text-black hover:scale-[1.01]"
          }
          `}
        >
          {submitted
            ? "Answer Submitted"
            : "Submit Answer"}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;