import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile } from '../api/auth';
import { getCheckins } from '../api/checkins';
//import { getAchievements } from '../api/leaderboard'; // 我们之前把成就放在了 leaderboard 路由，但实际后端是 /achievements/me，需修正
// 注意：我们之前后端实现了 achievements 接口，却在 leaderboard 路由中导出，实际应引用独立的 achievements api。为了简单，这里重新导入一个新的 achievements 文件，或者直接用 fetch。
import api from '../api/index';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [achievements, setAchievements] = useState(null);

  useEffect(() => {
    if (!user) return;
    getProfile().then(res => setProfile(res.data));
    getCheckins({ user_id: user.id }).then(res => setCheckins(res.data.checkins));
    // 获取成就数据（使用api直接请求，因为可能没有在 api 文件中导出）
    api.get('/achievements/me').then(res => setAchievements(res.data));
  }, [user]);

  if (!user) return <div className="p-4">请先登录</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">个人中心</h1>
      <div className="bg-white rounded shadow p-4 mb-4">
        <p>用户名: {user.username}</p>
        <p>昵称: {profile?.nickname}</p>
        <p>邮箱: {profile?.email}</p>
      </div>

      {achievements && (
        <div className="bg-white rounded shadow p-4 mb-4">
          <h2 className="text-lg font-bold">图鉴进度</h2>
          <p>{achievements.collectedCount} / {achievements.totalCats} 已收集</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {achievements.cats.map(cat => (
              <div key={cat.cat_id} className={`p-2 rounded border text-center ${cat.collected ? 'bg-green-100 border-green-400' : 'bg-gray-100'}`}>
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs">{cat.collected ? '✓ 已打卡' : '未打卡'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-bold mb-2">我的打卡记录</h2>
        {checkins.length === 0 ? <p className="text-gray-500">暂无记录</p> : (
          checkins.map(ch => (
            <div key={ch.id} className="border-b py-2">
              <span className="text-sm text-gray-500">{new Date(ch.created_at).toLocaleString()}</span>
              <span className="ml-2 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">{ch.type === 'sighting' ? '偶遇' : '投喂'}</span>
              <span className={`ml-2 text-xs ${ch.status === 'approved' ? 'text-green-600' : ch.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                {ch.status === 'approved' ? '已通过' : ch.status === 'rejected' ? '已拒绝' : '待审核'}
              </span>
              <p className="mt-1">{ch.note}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}