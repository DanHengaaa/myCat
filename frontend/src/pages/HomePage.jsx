import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getCats } from '../api/cats';
import { getLocations } from '../api/locations';
import CatCard from '../components/CatCard';

const TIANDITU_KEY = '01c5845db0eb91889d42399c5a5b4f16';

function MapWithLocations() {
  const map = useMap();
  // 可在此调整地图中心等，暂时不需要
  return null;
}

export default function HomePage() {
  const [cats, setCats] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getCats({ limit: 200 }).then(res => setCats(res.data.cats));
    getLocations().then(res => setLocations(res.data));
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="h-1/2 w-full">
        <MapContainer center={[39.9042, 116.4074]} zoom={15} style={{ height: '100%', width: '100%' }}>
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
          <MapWithLocations />
        </MapContainer>
      </div>
      <div className="p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">校园猫咪档案</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cats.map(cat => <CatCard key={cat.id} cat={cat} />)}
        </div>
      </div>
    </div>
  );
}