import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckin } from '../api/checkins';
import { getCats } from '../api/cats';
import { getLocations } from '../api/locations';
import api from '../api/index';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { AuthContext } from '../context/AuthContext';

const TIANDITU_KEY = '01c5845db0eb91889d42399c5a5b4f16';

// 只处理地图点击，不触发重新渲染
function MapClickHandler({ onClick }) {
  useMapEvents({ click: e => onClick(e.latlng) });
  return null;
}

// 监听外部坐标变化，飞行移动（不重新创建地图）
function FlyToPoint({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.flyTo([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export default function CheckinPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [type, setType] = useState('sighting');
  const [catId, setCatId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [cats, setCats] = useState([]);
  const [locations, setLocations] = useState([]);

  // 地图相关状态：center 是地图容器初始中心，markerPosition 是标记位置
  const [mapCenter, setMapCenter] = useState({ lat: 31.50, lng: 118.50 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locating, setLocating] = useState(true);

  // 登录检查
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // 加载猫咪和点位
  useEffect(() => {
    getCats({ limit: 200 }).then(res => setCats(res.data.cats));
    getLocations().then(res => setLocations(res.data));
  }, []);

  // GPS 定位：获取后设为地图中心和初始标记位置
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapCenter(coords);
        setMarkerPosition(coords);
        setLocating(false);
      },
      () => {
        setLocating(false);
        // 失败时沿用默认 mapCenter
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // 地图点击处理：更新标记位置，并传递给地图飞行
  const handleMapClick = (latlng) => {
    const coords = { lat: latlng.lat, lng: latlng.lng };
    setMarkerPosition(coords);
    setLocationId(''); // 清空关联点位
  };

  // 显示坐标文字
  const displayCoords = () => {
    if (locationId) {
      const loc = locations.find(l => l.id.toString() === locationId.toString());
      if (loc) return `点位坐标：${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`;
    }
    if (markerPosition) return `地图坐标：${markerPosition.lat.toFixed(5)}, ${markerPosition.lng.toFixed(5)}`;
    return '尚未选择位置';
  };

  // 提交打卡
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    let finalLat, finalLng;
    if (locationId) {
      const loc = locations.find(l => l.id.toString() === locationId.toString());
      if (loc) {
        finalLat = loc.latitude;
        finalLng = loc.longitude;
      } else {
        setError('所选点位不存在');
        setUploading(false);
        return;
      }
    } else if (markerPosition) {
      finalLat = markerPosition.lat;
      finalLng = markerPosition.lng;
    } else {
      setError('请在地图上点击选择位置，或关联一个已有点位');
      setUploading(false);
      return;
    }

    try {
      let photoUrl = '';
      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrl = uploadRes.data.url;
      }

      await createCheckin({
        type,
        cat_id: catId ? parseInt(catId) : null,
        location_id: locationId ? parseInt(locationId) : null,
        note,
        latitude: finalLat,
        longitude: finalLng,
        photo_url: photoUrl || null,
      });

      alert('打卡成功！');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || '打卡失败');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

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
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url={`https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${TIANDITU_KEY}`} />
              {markerPosition && <Marker position={[markerPosition.lat, markerPosition.lng]} />}
              <MapClickHandler onClick={handleMapClick} />
              {markerPosition && <FlyToPoint lat={markerPosition.lat} lng={markerPosition.lng} />}
            </MapContainer>
          </div>
          <p className="text-xs text-gray-500">{displayCoords()}</p>

          <select
            value={locationId}
            onChange={e => setLocationId(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-2"
          >
            <option value="">-- 不关联点位（使用地图坐标） --</option>
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
        <button type="submit" disabled={uploading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
          {uploading ? '上传中...' : '提交打卡'}
        </button>
      </form>
    </div>
  );
}