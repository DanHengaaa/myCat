import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLocation } from '../api/locations';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const TIANDITU_KEY = '01c5845db0eb91889d42399c5a5b4f16';

function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPick(lat, lng);
    },
  });
  return null;
}

export default function AddLocationPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: ''
  });
  const [lat, setLat] = useState(31.92);
  const [lng, setLng] = useState(118.79);
  const [error, setError] = useState('');

  if (!user) { navigate('/login'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { setError('名称不能为空'); return; }
    try {
      await createLocation({
        name: form.name,
        latitude: lat,
        longitude: lng,
        description: form.description
      });
      alert('点位已提交，审核通过后显示');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '提交失败');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">添加新点位</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">名称 *</label>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">点击地图选择位置</label>
          <div className="h-64 w-full rounded overflow-hidden border">
            <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url={`https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${TIANDITU_KEY}`} />
              <Marker position={[lat, lng]} />
              <LocationPicker onPick={(latVal, lngVal) => { setLat(latVal); setLng(lngVal); }} />
            </MapContainer>
          </div>
          <p className="text-xs text-gray-500 mt-1">已选坐标：{lat.toFixed(5)}, {lng.toFixed(5)}</p>
        </div>
        <div>
          <label className="block mb-1">描述</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            rows="2" className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded">提交</button>
      </form>
    </div>
  );
}