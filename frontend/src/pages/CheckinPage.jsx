import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckin } from '../api/checkins';
import { getCats } from '../api/cats';
import { getLocations } from '../api/locations';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

const TIANDITU_KEY = '01c5845db0eb91889d42399c5a5b4f16';

function MapClickHandler({ onClick }) {
  useMapEvents({ click: e => onClick(e.latlng) });
  return null;
}

function FlyToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 13);
  }, [coords]);
  return null;
}

export default function CheckinPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('sighting');
  const [catId, setCatId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  const [cats, setCats] = useState([]);
  const [locations, setLocations] = useState([]);

  const [userCoords, setUserCoords] = useState(null); // GPS or picked
  const [manualCoords, setManualCoords] = useState(null);
  const [locating, setLocating] = useState(true);

  useEffect(() => {
    getCats({ limit: 200 }).then(res => setCats(res.data.cats));
    getLocations().then(res => setLocations(res.data));
  }, []);

  // GPS
  useEffect(() => {
    if (!navigator.geolocation) { setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // 自动匹配最近点位（当用户坐标变化时）
  useEffect(() => {
    if (!userCoords || locations.length === 0) return;
    let minDist = Infinity, nearestId = '';
    locations.forEach(loc => {
      const d = Math.hypot(loc.latitude - userCoords.lat, loc.longitude - userCoords.lng);
      if (d < minDist) { minDist = d; nearestId = loc.id; }
    });
    setLocationId(nearestId.toString());
  }, [userCoords, locations]);

  const handleMapClick = (latlng) => {
    const coords = { lat: latlng.lat, lng: latlng.lng };
    setManualCoords(true);
    setUserCoords(coords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createCheckin({
        type,
        cat_id: catId ? parseInt(catId) : null,
        location_id: locationId ? parseInt(locationId) : null,
        note,
        latitude: userCoords?.lat,
        longitude: userCoords?.lng,
        photo_url: photo ? URL.createObjectURL(photo) : ''
      });
      alert('打卡成功！');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || '打卡失败');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">🐾 打卡</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">类型</label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="sighting">偶遇</option>
            <option value="feeding">投喂</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">猫咪</label>
          <select value={catId} onChange={e => setCatId(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="">-- 未知猫咪 --</option>
            {cats.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">位置</label>
          <div className="h-48 w-full rounded border mb-2">
            {userCoords ? (
              <MapContainer center={[userCoords.lat, userCoords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer url={`https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${TIANDITU_KEY}`} />
                <Marker position={[userCoords.lat, userCoords.lng]} />
                <MapClickHandler onClick={handleMapClick} />
                <FlyToLocation coords={userCoords} />
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                {locating ? '定位中...' : '无法定位，请点击地图选择'}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">坐标: {userCoords ? `${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)}` : '未获取'}</p>
          <select value={locationId} onChange={e => setLocationId(e.target.value)} className="w-full border rounded px-3 py-2 mt-2">
            <option value="">-- 不关联固定点位 --</option>
            {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1">备注</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows="2" className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div>
          <label className="block mb-1">照片</label>
          <input type="file" accept="image/*" capture="environment" onChange={e => setPhoto(e.target.files[0])} className="w-full border rounded px-3 py-2" />
        </div>
        <button className="w-full bg-green-600 text-white py-2 rounded">提交打卡</button>
      </form>
    </div>
  );
}