import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLocation } from '../api/locations';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';

const TIANDITU_KEY = '01c5845db0eb91889d42399c5a5b4f16';

// 点击地图选点
function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPick(lat, lng);
    },
  });
  return null;
}

// 飞行到指定坐标
function FlyToPoint({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.flyTo([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export default function AddLocationPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  // 地图中心（初始默认，GPS定位后更新）
  const [mapCenter, setMapCenter] = useState({ lat: 31.50, lng: 118.50 });
  // 当前选中的坐标（跟随点击）
  const [lat, setLat] = useState(31.50);
  const [lng, setLng] = useState(118.50);
  // 是否处于定位中
  const [locating, setLocating] = useState(true);

  // 登录检查
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // GPS 定位：成功后设置地图中心和初始坐标
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapCenter(coords);
        setLat(coords.lat);
        setLng(coords.lng);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // 地图点击选点
  const handlePick = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
  };

  // 提交点位
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('名称不能为空');
      return;
    }
    try {
      await createLocation({
        name: form.name,
        latitude: lat,
        longitude: lng,
        description: form.description,
      });
      alert('点位已提交，审核通过后显示');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '提交失败');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">添加新点位</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">名称 *</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">点击地图选择位置</label>
          <div className="h-64 w-full rounded overflow-hidden border">
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url={`https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${TIANDITU_KEY}`}
              />
              <Marker position={[lat, lng]} />
              <LocationPicker onPick={handlePick} />
              {/* GPS 定位成功后自动飞到定位点 */}
              {!locating && <FlyToPoint lat={lat} lng={lng} />}
            </MapContainer>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            已选坐标：{lat.toFixed(5)}, {lng.toFixed(5)}
          </p>
        </div>
        <div>
          <label className="block mb-1">描述</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows="2"
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded">提交</button>
      </form>
    </div>
  );
}