import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/index';

export default function ReviewPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pendingCats, setPendingCats] = useState([]);          // 待审核创建猫咪
  const [pendingLocations, setPendingLocations] = useState([]); // 待审核创建点位
  const [pendingEdits, setPendingEdits] = useState([]);         // 待审核编辑猫咪
  const [pendingDeletes, setPendingDeletes] = useState([]);     // 待审核删除点位
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAll();
  }, [user, navigate]);

  const fetchAll = async () => {
    try {
      const catsRes = await api.get('/cats/admin/pending');
      setPendingCats(catsRes.data);
      const locsRes = await api.get('/locations/admin/pending');
      setPendingLocations(locsRes.data);
      const editsRes = await api.get('/cats/admin/pending-edits');
      setPendingEdits(editsRes.data);
      const deletesRes = await api.get('/locations/admin/pending-deletes');
      setPendingDeletes(deletesRes.data);
    } catch (err) {
      setError('获取待审核数据失败');
    }
  };

  // 审核创建猫咪
  const handleReviewCat = async (id, status) => {
    try {
      await api.put(`/cats/${id}/review`, { status });
      fetchAll();
    } catch (err) {
      setError('操作失败');
    }
  };

  // 审核创建点位
  const handleReviewLocation = async (id, status) => {
    try {
      await api.put(`/locations/${id}/review`, { status });
      fetchAll();
    } catch (err) {
      setError('操作失败');
    }
  };

  // 审核编辑猫咪
  const handleReviewEdit = async (id, action) => {
    try {
      await api.put(`/cats/${id}/review-edit`, { action });
      fetchAll();
    } catch (err) {
      setError('操作失败');
    }
  };

  // 审核删除点位
  const handleReviewDelete = async (id, action) => {
    try {
      await api.put(`/locations/${id}/review-delete`, { action });
      fetchAll();
    } catch (err) {
      setError('操作失败');
    }
  };

  if (!user) return <div className="p-4">请先登录</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">审核管理</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* 待审核创建猫咪 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">待审核猫咪档案（新建）</h2>
        {pendingCats.length === 0 ? (
          <p className="text-gray-500">暂无</p>
        ) : (
          <div className="space-y-3">
            {pendingCats.map(cat => (
              <div key={cat.id} className="border rounded p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{cat.name}</h3>
                    <p className="text-sm text-gray-600">性别: {cat.gender} | 毛色: {cat.color}</p>
                    <p className="text-sm text-gray-600">性格: {cat.personality_tags?.join(', ')}</p>
                    <p className="text-sm text-gray-600">{cat.description}</p>
                    {cat.nickname && <p className="text-xs text-gray-400 mt-1">提交者: {cat.nickname || cat.username}</p>}
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

      {/* 待审核创建点位 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">待审核点位（新建）</h2>
        {pendingLocations.length === 0 ? (
          <p className="text-gray-500">暂无</p>
        ) : (
          <div className="space-y-3">
            {pendingLocations.map(loc => (
              <div key={loc.id} className="border rounded p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{loc.name}</h3>
                    <p className="text-sm text-gray-600">坐标: ({loc.latitude}, {loc.longitude})</p>
                    <p className="text-sm text-gray-600">{loc.description}</p>
                    {loc.nickname && <p className="text-xs text-gray-400 mt-1">提交者: {loc.nickname || loc.username}</p>}
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

      {/* 待审核编辑猫咪 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">待审核编辑（猫咪档案修改）</h2>
        {pendingEdits.length === 0 ? (
          <p className="text-gray-500">暂无</p>
        ) : (
          <div className="space-y-3">
            {pendingEdits.map(cat => {
              const changes = cat.pending_changes || {};
              return (
                <div key={cat.id} className="border rounded p-4 bg-white shadow-sm">
                  <h3 className="font-bold">{cat.name}（修改请求）</h3>
                  <p className="text-xs text-gray-400 mb-2">提交者: {cat.nickname || cat.username}</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    {changes.name && <p>名字改为: <span className="font-medium">{changes.name}</span></p>}
                    {changes.gender && <p>性别改为: {changes.gender}</p>}
                    {changes.color && <p>毛色改为: {changes.color}</p>}
                    {changes.personality_tags && <p>性格改为: {changes.personality_tags.join(', ')}</p>}
                    {changes.health_status && <p>健康改为: {changes.health_status}</p>}
                    {changes.neutered !== undefined && <p>绝育改为: {changes.neutered ? '是' : '否'}</p>}
                    {changes.description && <p>描述改为: {changes.description}</p>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleReviewEdit(cat.id, 'approve')}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">通过修改</button>
                    <button onClick={() => handleReviewEdit(cat.id, 'reject')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">拒绝</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 待审核删除点位 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">待审核删除点位</h2>
        {pendingDeletes.length === 0 ? (
          <p className="text-gray-500">暂无</p>
        ) : (
          <div className="space-y-3">
            {pendingDeletes.map(loc => (
              <div key={loc.id} className="border rounded p-4 bg-white shadow-sm">
                <h3 className="font-bold">{loc.name}</h3>
                <p className="text-sm text-gray-600">坐标: ({loc.latitude}, {loc.longitude})</p>
                <p className="text-xs text-gray-400">请求删除者: {loc.nickname || loc.username}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleReviewDelete(loc.id, 'approve')}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">确认删除</button>
                  <button onClick={() => handleReviewDelete(loc.id, 'reject')}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">取消请求</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}