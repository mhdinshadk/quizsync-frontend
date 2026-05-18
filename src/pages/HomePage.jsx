import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

  // CREATE ROOM

  const [createName, setCreateName] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  // JOIN ROOM

  const [joinName, setJoinName] =
    useState("");

  const [roomCode, setRoomCode] =
    useState("");

  // CREATE ROOM

  const createRoom = async () => {
    if (!createName.trim()) return;

    try {
      setCreating(true);

      const response = await axios.post(
       "https://quizsync-backend-gswt.onrender.com/api/rooms/create",
        {
          hostName: createName,
        }
      );

      const room = response.data.room;

      localStorage.setItem(
        "playerName",
        createName
      );

      localStorage.setItem(
        "roomCode",
        room.roomCode
      );

      navigate(`/room/${room.roomCode}`);
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  // JOIN ROOM

  const joinRoom = () => {
    if (
      !joinName.trim() ||
      !roomCode.trim()
    ) {
      return;
    }

    localStorage.setItem(
      "playerName",
      joinName
    );

    localStorage.setItem(
      "roomCode",
      roomCode
    );

    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-20 items-center">

        {/* LEFT */}

        <div>
          <div className="inline-flex items-center gap-3 border border-zinc-800 rounded-full px-5 py-2 mb-8 bg-zinc-900">

            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

            <span className="text-sm text-zinc-300">
              Real-Time Multiplayer Quiz
            </span>
          </div>

          <h1 className="text-7xl font-black leading-tight mb-8">
            QuizSync
          </h1>

          <p className="text-zinc-400 text-xl leading-relaxed max-w-xl">
            Create live quiz rooms,
            invite players, compete in
            real-time and experience
            synchronized multiplayer
            gameplay.
          </p>
        </div>

        {/* RIGHT */}

        <div className="space-y-8">

          {/* CREATE ROOM */}

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-3xl font-black mb-6">
              Create Room
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Enter your name"
                value={createName}
                onChange={(e) =>
                  setCreateName(
                    e.target.value
                  )
                }
                className="w-full bg-black border border-zinc-800 rounded-2xl p-5 outline-none"
              />

              <button
                onClick={createRoom}
                disabled={creating}
                className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg hover:scale-[1.01] transition-all duration-300"
              >
                {creating
                  ? "Creating..."
                  : "Create Quiz Room"}
              </button>
            </div>
          </div>

          {/* JOIN ROOM */}

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-3xl font-black mb-6">
              Join Room
            </h2>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Enter your name"
                value={joinName}
                onChange={(e) =>
                  setJoinName(
                    e.target.value
                  )
                }
                className="w-full bg-black border border-zinc-800 rounded-2xl p-5 outline-none"
              />

              <input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(
                    e.target.value.toUpperCase()
                  )
                }
                className="w-full bg-black border border-zinc-800 rounded-2xl p-5 outline-none uppercase"
              />

              <button
                onClick={joinRoom}
                className="w-full border border-zinc-700 py-5 rounded-2xl font-black text-lg hover:bg-zinc-900 transition-all duration-300"
              >
                Join Quiz Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;