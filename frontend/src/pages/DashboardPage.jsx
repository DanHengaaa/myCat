import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getDashboard } from '../api/dashboard';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { isAdmin } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    getDashboard().then(res => setStats(res.data));
  }, [isAdmin, navigate]);

  if (!stats) return <div className="p-4">加载中...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">数据看板</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.totalCats}</p>
          <p className="text-gray-600">猫咪总数</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.totalLocations}</p>
          <p className="text-gray-600">点位总数</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{stats.totalCheckins}</p>
          <p className="text-gray-600">打卡总数</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.activeUsers}</p>
          <p className="text-gray-600">活跃用户</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-3">热门猫咪 Top5</h2>
          {stats.topCats?.map(cat => (
            <div key={cat.cat_id} className="flex justify-between border-b py-1">
              <span>{cat.name}</span>
              <span className="text-gray-500">{cat.checkin_count}次打卡</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-3">热门点位 Top5</h2>
          {stats.topLocations?.map(loc => (
            <div key={loc.location_id} className="flex justify-between border-b py-1">
              <span>{loc.name}</span>
              <span className="text-gray-500">{loc.checkin_count}次打卡</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}