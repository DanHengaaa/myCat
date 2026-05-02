import { useEffect, useState } from 'react';
import { getCatLeaderboard, getUserLeaderboard } from '../api/leaderboard';

export default function LeaderboardPage() {
  const [cats, setCats] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getCatLeaderboard(10).then(res => setCats(res.data));
    getUserLeaderboard('all', 10).then(res => setUsers(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">🏆 明星猫咪排行</h2>
        {cats.map((cat, idx) => (
          <div key={cat.cat_id} className="flex justify-between items-center border-b py-2">
            <div>
              <span className="font-bold text-lg mr-2">{idx + 1}</span>
              <span>{cat.name}</span>
            </div>
            <span className="text-gray-500">{cat.checkin_count}次打卡</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">🎖️ 积极用户榜</h2>
        {users.map((u, idx) => (
          <div key={u.user_id} className="flex justify-between items-center border-b py-2">
            <div>
              <span className="font-bold text-lg mr-2">{idx + 1}</span>
              <span>{u.nickname || u.username}</span>
            </div>
            <span className="text-gray-500">{u.checkin_count}次打卡</span>
          </div>
        ))}
      </div>
    </div>
  );
}