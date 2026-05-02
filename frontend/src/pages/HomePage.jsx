import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getCats } from '../api/cats';
import { getLocations } from '../api/locations';
import CatCard from '../components/CatCard';

const TIANDITU_KEY = '01c5845db0eb91889d42399c5a5b4f16';   // ← 替换成你的真实密钥

export default function HomePage() {
  const [cats, setCats] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getCats({ limit: 200 }).then(res => setCats(res.data.cats));
    getLocations().then(res => setLocations(res.data));
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* ========== 左侧地图 ========== */}
      <div className="flex-1 min-w-0">
        <MapContainer
  center={[31.92, 118.79]}   // 河海大学江宁校区
  zoom={16}                   // 更聚焦校园
  style={{ height: '100%', width: '100%' }}
>
          <TileLayer
            url={`https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${TIANDITU_KEY}`}
          />
          {locations.map(loc => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup>
                <div>
                  <h3 className="font-bold">{loc.name}</h3>
                  <p>猫咪数量: {loc.cat_count}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ========== 右侧猫咪档案 ========== */}
      <div className="w-80 lg:w-96 overflow-y-auto bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white pb-2 border-b">
          🐱 猫咪档案
        </h2>
        {cats.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">暂无猫咪数据</p>
        ) : (
          <div className="space-y-3">
            {cats.map(cat => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}