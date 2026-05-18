import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomCode" element={<RoomPage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  );
}

export default App;