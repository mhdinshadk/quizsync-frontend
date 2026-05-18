import { questions } from "../data/questions.js";

const roomQuizState = {};

export const quizSocketHandler = (
  io,
  socket
) => {

  // START QUIZ

  socket.on(
    "start_quiz",
    ({ roomCode }) => {

      roomQuizState[roomCode] = {
        currentQuestionIndex: 0,

        scores: {},

        answeredPlayers: [],
      };

      startQuestion(io, roomCode);
    }
  );

  // SUBMIT ANSWER

  socket.on(
    "submit_answer",
    ({
      roomCode,
      answer,
      playerName,
    }) => {

      const roomState =
        roomQuizState[roomCode];

      if (!roomState) return;

      // prevent multiple answers

      if (
        roomState.answeredPlayers.includes(
          playerName
        )
      ) {
        return;
      }

      roomState.answeredPlayers.push(
        playerName
      );

      const currentQuestion =
        questions[
          roomState.currentQuestionIndex
        ];

      // initialize score

      if (
        roomState.scores[playerName] ===
        undefined
      ) {
        roomState.scores[playerName] = 0;
      }

      // CORRECT ANSWER = +1

      if (
        answer === currentQuestion.answer
      ) {
        roomState.scores[playerName] += 1;
      }

      // WRONG ANSWER = +0

      io.to(roomCode).emit(
        "score_update",
        roomState.scores
      );
    }
  );
};

// START QUESTION

const startQuestion = (
  io,
  roomCode
) => {

  const roomState =
    roomQuizState[roomCode];

  if (!roomState) return;

  // reset answered players

  roomState.answeredPlayers = [];

  const question =
    questions[
      roomState.currentQuestionIndex
    ];

  // SEND QUESTION

  io.to(roomCode).emit(
    "new_question",
    {
      question,

      questionNumber:
        roomState.currentQuestionIndex +
        1,

      totalQuestions:
        questions.length,
    }
  );

  // TIMER

  let timeLeft = 10;

  const timerInterval = setInterval(
    () => {

      io.to(roomCode).emit(
        "timer_update",
        timeLeft
      );

      timeLeft--;

      // NEXT QUESTION

      if (timeLeft < 0) {

        clearInterval(timerInterval);

        roomState.currentQuestionIndex++;

        // QUIZ END

        if (
          roomState.currentQuestionIndex >=
          questions.length
        ) {

          io.to(roomCode).emit(
            "quiz_ended",
            {
              scores:
                roomState.scores,
            }
          );

          delete roomQuizState[
            roomCode
          ];

          return;
        }

        // NEXT QUESTION

        startQuestion(io, roomCode);
      }
    },
    1000
  );
};