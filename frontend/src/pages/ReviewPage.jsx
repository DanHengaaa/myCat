import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/index';

export default function ReviewPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pendingCats, setPendingCats] = useState([]);
  const [pendingLocations, setPendingLocations] = useState([]);
  const [error, setError] = useState('');

  // 仅管理员可访问
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchPending();
  }, [user, navigate]);

  const fetchPending = async () => {
    try {
      // 获取待审核猫咪（需要后端提供接口，若后端还没有，请参考猫咪审核改造）
      const catsRes = await api.get('/cats/admin/pending');
      setPendingCats(catsRes.data);
      // 获取待审核点位
      const locsRes = await api.get('/locations/admin/pending');
      setPendingLocations(locsRes.data);
    } catch (err) {
      setError('获取待审核数据失败');
    }
  };

  const handleReviewCat = async (id, status) => {
    try {
      await api.put(`/cats/${id}/review`, { status });
      // 刷新列表
      fetchPending();
    } catch (err) {
      setError('操作失败');
    }
  };

  const handleReviewLocation = async (id, status) => {
    try {
      await api.put(`/locations/${id}/review`, { status });
      fetchPending();
    } catch (err) {
      setError('操作失败');
    }
  };

  if (!user) return <div className="p-4">请先登录</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">审核管理</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* 猫咪审核 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">待审核猫咪档案</h2>
        {pendingCats.length === 0 ? (
          <p className="text-gray-500">暂无待审核猫咪</p>
        ) : (
          <div className="space-y-3">
            {pendingCats.map(cat => (
              <div key={cat.id} className="border rounded p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{cat.name}</h3>
                    <p className="text-sm text-gray-600">性别: {cat.gender} | 毛色: {cat.color}</p>
                    <p className="text-sm text-gray-600">性格: {cat.personality_tags?.join(', ')}</p>
                    <p className="text-sm text-gray-600">健康: {cat.health_status}</p>
                    <p className="text-sm text-gray-600">{cat.description}</p>
                    {cat.submitted_by && <p className="text-xs text-gray-400 mt-1">提交者: {cat.nickname || cat.username}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleReviewCat(cat.id, 'approved')}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">通过</button>
                    <button onClick={() => handleReviewCat(cat.id, 'rejected')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">拒绝</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 点位审核 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">待审核点位</h2>
        {pendingLocations.length === 0 ? (
          <p className="text-gray-500">暂无待审核点位</p>
        ) : (
          <div className="space-y-3">
            {pendingLocations.map(loc => (
              <div key={loc.id} className="border rounded p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{loc.name}</h3>
                    <p className="text-sm text-gray-600">坐标: ({loc.latitude}, {loc.longitude})</p>
                    <p className="text-sm text-gray-600">{loc.description}</p>
                    {loc.submitted_by && <p className="text-xs text-gray-400 mt-1">提交者: {loc.nickname || loc.username}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleReviewLocation(loc.id, 'approved')}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">通过</button>
                    <button onClick={() => handleReviewLocation(loc.id, 'rejected')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">拒绝</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}