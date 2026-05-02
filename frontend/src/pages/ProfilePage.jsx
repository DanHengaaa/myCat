import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/auth';
import { getCheckins } from '../api/checkins';
import api from '../api/index';

export default function ProfilePage() {
  const { user, loginSuccess } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [achievements, setAchievements] = useState(null);

  // 编辑表单状态
  const [editMode, setEditMode] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    getProfile().then(res => {
      setProfile(res.data);
      setNickname(res.data.nickname || '');
      setEmail(res.data.email || '');
    });
    getCheckins({ user_id: user.id, limit: 50 }).then(res => setCheckins(res.data.checkins));
    api.get('/achievements/me').then(res => setAchievements(res.data));
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    try {
      const data = {};
      if (nickname !== profile?.nickname) data.nickname = nickname;
      if (email !== profile?.email) data.email = email;
      if (newPassword) {
        if (!oldPassword) {
          setUpdateError('请输入旧密码');
          return;
        }
        data.oldPassword = oldPassword;
        data.newPassword = newPassword;
      }
      if (Object.keys(data).length === 0) {
        setUpdateError('没有改动');
        return;
      }
      const res = await updateProfile(data);
      setProfile(res.data);
      // 更新 AuthContext 中的信息（如果存了的话）
      loginSuccess(res.data, localStorage.getItem('token'));
      setOldPassword('');
      setNewPassword('');
      setUpdateSuccess('修改成功');
      setEditMode(false);
    } catch (err) {
      setUpdateError(err.response?.data?.message || '修改失败');
    }
  };

  if (!user) return <div className="p-4">请先登录</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">个人中心</h1>
      
      {/* 基本信息卡片 */}
      <div className="bg-white rounded shadow p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">基本信息</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-sm text-blue-600 hover:underline"
          >
            {editMode ? '取消编辑' : '编辑'}
          </button>
        </div>
        {!editMode ? (
          <div>
            <p>用户名: {user.username}</p>
            <p>昵称: {profile?.nickname}</p>
            <p>邮箱: {profile?.email}</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-3">
            {updateError && <p className="text-red-500 text-sm">{updateError}</p>}
            {updateSuccess && <p className="text-green-600 text-sm">{updateSuccess}</p>}
            <div>
              <label className="block text-sm mb-1">昵称</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">邮箱</label>
              <input
                className="w-full border rounded px-3 py-2"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">旧密码（如需改密码）</label>
              <input
                className="w-full border rounded px-3 py-2"
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="不改密码留空"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">新密码</label>
              <input
                className="w-full border rounded px-3 py-2"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="不改密码留空"
              />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              保存修改
            </button>
          </form>
        )}
      </div>

      {/* 成就卡片 */}
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

      {/* 打卡记录 */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-bold mb-2">我的打卡记录</h2>
        {checkins.length === 0 ? (
          <p className="text-gray-500">暂无记录</p>
        ) : (
          checkins.map(ch => (
            <div key={ch.id} className="border-b py-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{new Date(ch.created_at).toLocaleString()}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${ch.type === 'sighting' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                  {ch.type === 'sighting' ? '偶遇' : '投喂'}
                </span>
              </div>
              <p className="mt-1">🐱 猫咪：<span className="font-medium">{ch.cat_name || '未知猫咪'}</span></p>
              <p className="mt-1">📍 地点：<span className="font-medium">{ch.location_name || '未知地点'}</span></p>
              {ch.note && <p className="text-gray-600 mt-1">📝 {ch.note}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}