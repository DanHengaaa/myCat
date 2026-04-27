import { useParams, Link } from "react-router";
import { ChevronLeft, Share2, Heart, HeartCrack, Info, BookOpen } from "lucide-react";
import { useState } from "react";
import { mockCats, mockCheckIns } from "../../data/mock";

export default function CatDetail() {
  const { id } = useParams();
  const cat = mockCats.find((c) => c.id === id);
  const [liked, setLiked] = useState(false);

  if (!cat) return <div className="p-8 text-center text-stone-500">猫咪走丢了 (Cat Not Found)</div>;

  const catCheckIns = mockCheckIns.filter(c => c.catId === cat.id);

  return (
    <div className="w-full min-h-full bg-stone-50 md:p-8 flex items-start justify-center">
      <div className="w-full max-w-5xl bg-white md:rounded-3xl md:shadow-sm md:border border-stone-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Header Image & Actions */}
        <div className="relative w-full md:w-1/2 h-72 md:h-auto md:min-h-[600px] shrink-0">
          <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute top-0 left-0 right-0 p-4 pt-safe md:pt-4 flex justify-between bg-gradient-to-b from-black/50 to-transparent">
            <Link to="/" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setLiked(!liked)} 
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                {liked ? <Heart className="w-5 h-5 fill-red-500 text-red-500" /> : <HeartCrack className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Info & Records */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col h-full md:max-h-[600px] overflow-y-auto relative">
          
          {/* Mobile floating card effect removed, integrated into regular flow */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 flex items-center gap-3">
                {cat.name}
                <span className="text-sm font-normal text-stone-500 px-3 py-1 bg-stone-100 rounded-full">{cat.gender}</span>
              </h1>
              <p className="text-sm md:text-base text-stone-500 mt-2">{cat.color} · 常驻: {cat.zone}</p>
            </div>
            <Link to={`/checkin?catId=${cat.id}`} className="inline-flex justify-center items-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl shadow-md transition-colors shrink-0">
              去打卡
            </Link>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-orange-50 p-4 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-orange-600/80 font-medium">健康状态</p>
                <p className="text-sm font-semibold text-orange-900 mt-1">
                  {cat.neutered ? '已绝育' : '未绝育'} · {cat.vaccinated ? '已免疫' : '未免疫'}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl flex flex-col gap-2">
              <p className="text-xs text-blue-600/80 font-medium">性格标签</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.personality.map(p => (
                  <span key={p} className="text-xs bg-blue-100/50 text-blue-700 px-2 py-1 rounded-md">{p.split(' ')[0]}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Story Wall & Records */}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              打卡动态 ({catCheckIns.length})
            </h2>
            <div className="space-y-4">
              {catCheckIns.length > 0 ? catCheckIns.map(record => (
                <div key={record.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={record.userAvatar} alt="User" className="w-10 h-10 rounded-full bg-stone-200" />
                    <div>
                      <h4 className="text-sm font-medium text-stone-800">{record.userName}</h4>
                      <p className="text-xs text-stone-400">{new Date(record.timestamp).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 mb-3">{record.comment}</p>
                  {record.photoUrl && (
                    <img src={record.photoUrl} alt="Check-in photo" className="w-full h-48 object-cover rounded-xl border border-stone-100" />
                  )}
                </div>
              )) : (
                <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-stone-400 text-sm">暂无打卡记录，快来偶遇吧~</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
