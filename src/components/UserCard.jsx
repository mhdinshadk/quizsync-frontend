const UserCard = ({ user }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold text-lg">
            {user.name}
          </h3>

          <p className="text-zinc-400 text-sm">
            Player Connected
          </p>
        </div>
      </div>

      {user.isHost && (
        <div className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">
          HOST
        </div>
      )}
    </div>
  );
};

export default UserCard;