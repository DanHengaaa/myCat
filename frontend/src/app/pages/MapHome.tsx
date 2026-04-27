import { useState } from "react";
import { Search, MapPin, Layers, Flame } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { mockCats, Cat } from "../../data/mock";

export default function MapHome() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"points" | "heatmap">("points");

  const filteredCats = mockCats.filter(
    (cat) =>
      cat.name.includes(search) ||
      cat.personality.some((p) => p.includes(search)) ||
      cat.color.includes(search)
  );

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Search Bar overlay */}
      <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:w-96 z-10 space-y-3">
        <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-stone-200 flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-stone-400 mr-2" />
          <input
            type="text"
            placeholder="搜索猫咪姓名/颜色/性格..."
            className="flex-1 bg-transparent outline-none text-base text-stone-700 placeholder:text-stone-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setMode(mode === "points" ? "heatmap" : "points")}
            className="bg-white/90 shadow-md backdrop-blur-md px-4 py-2.5 rounded-full text-sm font-bold text-stone-700 flex items-center gap-2 border border-stone-200 active:bg-stone-100 hover:bg-stone-50 transition-colors"
          >
            {mode === "points" ? (
              <>
                <Flame className="w-4 h-4 text-orange-500" />
                切换热力图模式
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 text-blue-500" />
                切换点位模式
              </>
            )}
          </button>
        </div>
      </div>

      {/* Map Area Mock */}
      <div
        className="flex-1 bg-[#e0f2f1] relative overflow-hidden"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M0 0h100v100H0z\\' fill=\\'%23e0f2f1\\'/%3E%3Cpath d=\\'M10 10h80v80H10z\\' fill=\\'none\\' stroke=\\'%23b2dfdb\\' stroke-width=\\'2\\'/%3E%3Cpath d=\\'M50 0v100M0 50h100\\' stroke=\\'%23b2dfdb\\' stroke-width=\\'2\\' stroke-dasharray=\\'5,5\\'/%3E%3C/svg%3E')",
          backgroundSize: "200px 200px",
        }}
      >
        {/* Render Cat Pins */}
        {filteredCats.map((cat) => (
          <CatPin key={cat.id} cat={cat} />
        ))}
        
        {/* Heatmap overlay mock */}
        {mode === "heatmap" && (
          <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_30%_45%,_red_0%,_transparent_15%),radial-gradient(circle_at_60%_20%,_orange_0%,_transparent_20%),radial-gradient(circle_at_80%_70%,_red_0%,_transparent_10%),radial-gradient(circle_at_45%_80%,_yellow_0%,_transparent_25%)] mix-blend-multiply" />
        )}
      </div>

      {/* Floating Info / Stats panel */}
      <div className="absolute bottom-6 left-4 right-4 bg-white rounded-2xl shadow-xl p-4 border border-orange-50 z-10 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-stone-800 text-sm">校园猫咪总数: <span className="text-orange-600">42只</span></h3>
          <p className="text-xs text-stone-500 mt-1">今日新增打卡: 18次</p>
        </div>
        <Link to="/admin" className="text-xs px-3 py-1.5 bg-stone-100 rounded-lg text-stone-600 font-medium border border-stone-200 hover:bg-stone-200">
          管理后台
        </Link>
      </div>
    </div>
  );
}

function CatPin({ cat }: { cat: Cat }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute flex flex-col items-center z-20"
      style={{ left: `${cat.location.x}%`, top: `${cat.location.y}%`, transform: 'translate(-50%, -100%)' }}
    >
      {/* Tooltip / Popup */}
      {open && (
        <div className="absolute bottom-16 w-48 bg-white rounded-xl shadow-xl border border-stone-200 p-3 mb-2 animate-in fade-in zoom-in duration-200">
          <div className="flex gap-3">
            <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <h4 className="font-bold text-sm text-stone-800">{cat.name}</h4>
              <p className="text-[10px] text-stone-500">{cat.zone}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-1 flex-wrap">
            {cat.personality.slice(0,2).map(p => (
              <span key={p} className="text-[9px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-md">
                {p.split(' ')[0]}
              </span>
            ))}
          </div>
          <Link
            to={`/cat/${cat.id}`}
            className="block mt-2 text-center text-xs bg-orange-500 text-white py-1.5 rounded-md font-medium shadow-sm hover:bg-orange-600 transition-colors"
          >
            查看档案
          </Link>
          
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-stone-200" />
        </div>
      )}

      {/* Pin Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative group focus:outline-none"
      >
        <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg bg-orange-100 overflow-hidden transform transition-transform group-hover:scale-110">
          <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-white rounded-b-md shadow-md" />
        <MapPin className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-5 h-5 text-orange-600 drop-shadow-md" />
      </button>
    </motion.div>
  );
}
