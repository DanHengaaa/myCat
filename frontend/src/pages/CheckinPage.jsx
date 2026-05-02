import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckin } from '../api/checkins';
import { getCats } from '../api/cats';
import { getLocations } from '../api/locations';

export default function CheckinPage() {
  const navigate = useNavigate();

  const [type, setType] = useState('sighting');
  const [catId, setCatId] = useState('');          // 选中的猫咪ID
  const [locationId, setLocationId] = useState(''); // 选中的点位ID
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  const [cats, setCats] = useState([]);            // 猫咪列表
  const [locations, setLocations] = useState([]);  // 点位列表
  const [loading, setLoading] = useState(false);

  // 当前 GPS 定位信息
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(true);   // 正在定位中

  // 获取猫咪列表、点位列表
  useEffect(() => {
    getCats({ limit: 200 }).then(res => setCats(res.data.cats));
    getLocations().then(res => setLocations(res.data));
  }, []);

  // 获取 GPS 位置，并尝试自动匹配最近点位
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setUserLocation(coords);
        setLocating(false);
        // 自动选择最近点位（可选）
        // 如果点位列表已加载，寻找最近的点位
        if (locations.length > 0) {
          let minDist = Infinity;
          let nearestId = '';
          locations.forEach(loc => {
            const dist = Math.hypot(
              loc.latitude - coords.latitude,
              loc.longitude - coords.longitude
            );
            if (dist < minDist) {
              minDist = dist;
              nearestId = loc.id;
            }
          });
          setLocationId(nearestId.toString());
        }
      },
      (err) => {
        console.warn('定位失败:', err);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [locations]); // 当点位列表加载后，尝试匹配最近点位

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createCheckin({
        type,
        cat_id: catId ? parseInt(catId) : null,
        location_id: locationId ? parseInt(locationId) : null,
        note,
        photo_url: photo ? URL.createObjectURL(photo) : ''  // 临时本地预览，实际需上传
      });
      alert('打卡成功！');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || '打卡失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">🐾 打卡</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 类型 */}
        <div>
          <label className="block mb-1">类型</label>
          <select value={type} onChange={e => setType(e.target.value)}
            className="w-full border rounded px-3 py-2">
            <option value="sighting">偶遇</option>
            <option value="feeding">投喂</option>
          </select>
        </div>

        {/* 猫咪下拉 */}
        <div>
          <label className="block mb-1">选择猫咪（可选）</label>
          <select value={catId} onChange={e => setCatId(e.target.value)}
            className="w-full border rounded px-3 py-2">
            <option value="">-- 未知猫咪 --</option>
            {cats.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name} {cat.color ? `(${cat.color})` : ''}</option>
            ))}
          </select>
        </div>

        {/* 点位：显示定位状态，并提供下拉选择 */}
        <div>
          <label className="block mb-1">打卡位置</label>
          {locating ? (
            <p className="text-sm text-gray-500">正在获取位置...</p>
          ) : userLocation ? (
            <p className="text-sm text-green-600">
              📍 已定位到 ({(userLocation.latitude).toFixed(4)}, {(userLocation.longitude).toFixed(4)})
            </p>
          ) : (
            <p className="text-sm text-red-500">无法获取位置，请手动选择点位</p>
          )}
          <select value={locationId} onChange={e => setLocationId(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1">
            <option value="">-- 不关联点位 --</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
          {userLocation && (
            <p className="text-xs text-gray-400 mt-1">
              已自动匹配最近点位，可手动更改
            </p>
          )}
        </div>

        {/* 备注 */}
        <div>
          <label className="block mb-1">备注</label>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            rows="2" className="w-full border rounded px-3 py-2"></textarea>
        </div>

        {/* 拍照上传（可选） */}
        <div>
          <label className="block mb-1">拍照上传</label>
          <input type="file" accept="image/*" capture="environment"
            onChange={e => setPhoto(e.target.files[0])}
            className="w-full border rounded px-3 py-2" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
          {loading ? '提交中...' : '提交打卡'}
        </button>
      </form>
    </div>
  );
}