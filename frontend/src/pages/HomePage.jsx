import { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getCats } from '../api/cats';
import { getLocations } from '../api/locations';
import { getTodayCheckins } from '../api/checkins';
import { AuthContext } from '../context/AuthContext';
import CatCard from '../components/CatCard';
import L from 'leaflet';
import api from '../api/index';

const TIANDITU_KEY = '01c5845db0eb91889d42399c5a5b4f16';

// 固定点位的蓝色图标（与原来一致）
const fixedIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// 打卡点的绿色圆形图标（带猫爪表情）
const checkinIcon = L.divIcon({
  className: '',
  html: '<div style="background-color:#4CAF50; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:16px;">🐾</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [cats, setCats] = useState([]);
  const [locations, setLocations] = useState([]);
  const [todayCheckins, setTodayCheckins] = useState([]);

  useEffect(() => {
    getCats({ limit: 200 }).then(res => setCats(res.data.cats));
    getLocations().then(res => setLocations(res.data));
    getTodayCheckins()
      .then(response => {
        const data = response.data || [];
        setTodayCheckins(data);
      })
      .catch(() => setTodayCheckins([]));
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="flex-1 min-w-0">
        <MapContainer center={[31.9165, 118.781]} zoom={17} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url={`https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${TIANDITU_KEY}`}
          />

          {/* 固定点位：蓝色图标 */}
          {locations.map(loc => (
            <Marker key={`loc-${loc.id}`} position={[loc.latitude, loc.longitude]} icon={fixedIcon}>
              <Popup>
                <div>
                  <h3 className="font-bold">{loc.name}</h3>
                  <p>猫咪数量: {loc.cat_count}</p>
                  {user && (
                    <button
                      onClick={() => {
                        api.put(`/locations/${loc.id}/request-delete`)
                          .then(() => alert('删除请求已提交，管理员审核后将移除该点位'))
                          .catch(() => alert('请求失败'));
                      }}
                      className="mt-2 text-xs text-red-500 underline"
                    >
                      请求删除此点位
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* 今日打卡点：绿色猫爪图标，弹窗自适应图片 */}
          {(todayCheckins || []).map(ch => {
            const lat = parseFloat(ch.latitude);
            const lng = parseFloat(ch.longitude);
            if (!lat || !lng) return null;
            return (
              <Marker key={`ch-${ch.id}`} position={[lat, lng]} icon={checkinIcon}>
                <Popup maxWidth={400} minWidth={200} className="checkin-popup">
                  <div style={{ maxWidth: '100%' }}>
                    <p className="font-semibold">
                      {ch.user_nickname || '匿名'} {ch.type === 'sighting' ? '偶遇' : '投喂'}
                    </p>
                    {ch.cat_name && <p>🐱 {ch.cat_name}</p>}
                    {ch.note && <p>📝 {ch.note}</p>}
                    {ch.photo_url && (
                      <img
                        src={ch.photo_url.startsWith('http') ? ch.photo_url : `http://localhost:5000${ch.photo_url}`}
                        alt="打卡照片"
                        style={{ maxWidth: '100%', height: 'auto', marginTop: '8px', borderRadius: '6px', display: 'block' }}
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-1">{new Date(ch.created_at).toLocaleTimeString()}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="w-80 lg:w-96 overflow-y-auto bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white pb-2 border-b">🐱 猫咪档案</h2>
        {cats.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">暂无猫咪数据</p>
        ) : (
          <div className="space-y-3">
            {cats.map(cat => <CatCard key={cat.id} cat={cat} />)}
          </div>
        )}
      </div>
    </div>
  );
}