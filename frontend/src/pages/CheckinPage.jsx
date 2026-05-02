import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckin } from '../api/checkins';
import { AuthContext } from '../context/AuthContext';

export default function CheckinPage() {
  const [type, setType] = useState('sighting');
  const [catId, setCatId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 此处暂时将图片 URL 设为空字符串，实际应用中需上传图片获取 URL
      await createCheckin({
        type,
        cat_id: catId ? Number(catId) : null,
        location_id: locationId ? Number(locationId) : null,
        note,
        photo_url: ''
      });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || '打卡失败');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">🐾 打卡</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-gray-700">类型</label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full border p-2 rounded">
            <option value="sighting">偶遇</option>
            <option value="feeding">投喂</option>
          </select>
        </div>
        <input className="w-full border p-2 mb-3 rounded" placeholder="猫咪ID（可选）" value={catId} onChange={e => setCatId(e.target.value)} />
        <input className="w-full border p-2 mb-3 rounded" placeholder="点位ID（可选）" value={locationId} onChange={e => setLocationId(e.target.value)} />
        <textarea className="w-full border p-2 mb-3 rounded" placeholder="备注" value={note} onChange={e => setNote(e.target.value)} />
        <div className="mb-3">
          <label className="block text-gray-700">上传照片</label>
          <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
        </div>
        <button className="w-full bg-green-600 text-white py-2 rounded">提交打卡</button>
      </form>
    </div>
  );
}