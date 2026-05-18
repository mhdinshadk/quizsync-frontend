import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { socket } from "../socket";

import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import UserCard from "../components/UserCard";

const RoomPage = () => {
  const navigate = useNavigate();

  const { roomCode } = useParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const playerName =
    localStorage.getItem("playerName");

  useEffect(() => {
    if (!roomCode || !playerName) {
      navigate("/");
      return;
    }

    socket.emit("join_room", {
      roomCode,
      playerName,
    });

    socket.on("room_users", (roomUsers) => {
      setUsers(roomUsers || []);
      setLoading(false);
    });

socket.on("new_question", (data) => {
  localStorage.setItem(
    "currentQuestion",
    JSON.stringify(data)
  );

  navigate("/quiz");
});

    return () => {
      socket.off("room_users");
      socket.off("new_question");
    };
  }, []);

  const startQuiz = () => {
    socket.emit("start_quiz", {
      roomCode,
    });
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(
      roomCode
    );

    alert("Room Code Copied");
  };

  const isHost =
    users[0]?.name === playerName;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">

          <div>
            <h1 className="text-5xl font-black mb-3">
              Room Lobby
            </h1>

            <p className="text-zinc-400 text-lg">
              Waiting for players to join...
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-5">

            <div>
              <p className="text-zinc-400 text-sm">
                ROOM CODE
              </p>

              <h2 className="text-3xl font-black tracking-widest">
                {roomCode}
              </h2>
            </div>

            <button
              onClick={copyRoomCode}
              className="bg-white text-black px-5 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300"
            >
              Copy
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">

              {users.map((user, index) => (
                <UserCard
                  key={index}
                  user={user}
                />
              ))}
            </div>

            {isHost && (
              <button
                onClick={startQuiz}
                disabled={users.length < 2}
                className={`w-full py-6 rounded-3xl text-2xl font-black transition-all duration-300

                ${
                  users.length < 2
                    ? "bg-zinc-700 cursor-not-allowed"
                    : "bg-white text-black hover:scale-[1.01]"
                }
                `}
              >
                {users.length < 2
                  ? "Waiting For Players..."
                  : "Start Quiz"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoomPage;