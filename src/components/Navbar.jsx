const Navbar = () => {
  return (
    <div className="w-full border-b border-zinc-800 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-wide">
          QuizSync
        </h1>

        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-zinc-300 text-sm">
            Real-Time Multiplayer
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;