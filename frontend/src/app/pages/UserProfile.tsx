import { Settings, Heart, Award, CheckCircle, ChevronRight, Target, Edit3 } from "lucide-react";
import { Link } from "react-router";
import { mockCats } from "../../data/mock";

export default function UserProfile() {
  const favoriteCats = mockCats.slice(0, 2);

  return (
    <div className="w-full min-h-full bg-stone-50 p-6 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column: Profile Card & Actions */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Profile Info Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden relative">
              <div className="h-32 bg-orange-500 relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
                <div className="absolute top-4 right-4">
                  <button className="w-9 h-9 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 backdrop-blur-sm transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 pb-8 relative">
                <div className="flex justify-between items-end -mt-12 mb-4">
                  <img src="https://ui-avatars.com/api/?name=Li&background=random&color=fff&size=200" alt="User" className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" />
                  <button className="flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full hover:bg-stone-200 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                    编辑资料
                  </button>
                </div>
                
                <h1 className="text-2xl font-bold text-stone-800">小李同学 (Li)</h1>
                <p className="text-sm text-stone-500 mt-1">计算机科学系 · 加入于 2023-09</p>
                
                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-orange-50 px-4 py-3.5 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold text-orange-900 text-sm">当前等级</span>
                    </div>
                    <span className="font-bold text-orange-600">Lv.4 资深猫奴</span>
                  </div>
                  <div className="flex items-center justify-between bg-yellow-50 px-4 py-3.5 rounded-xl border border-yellow-100">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-900 text-sm">我的积分</span>
                    </div>
                    <span className="font-bold text-yellow-600">1,240 pt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action List Menu */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors border-b border-stone-100 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="font-semibold text-stone-700">排行榜 (Leaderboard)</span>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-300" />
              </button>
              <button className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="font-semibold text-stone-700">我的打卡记录 (Records)</span>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-300" />
              </button>
            </div>
          </div>

          {/* Right Column: Stats Grid & Favorites */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Stats Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8 flex justify-between items-center">
              <div className="text-center flex-1 border-r border-stone-100">
                <p className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">42</p>
                <p className="text-sm font-medium text-stone-500 mt-2">已打卡 (Check-ins)</p>
              </div>
              <div className="text-center flex-1 border-r border-stone-100">
                <p className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">18</p>
                <p className="text-sm font-medium text-stone-500 mt-2">解锁猫咪 (Cats)</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">5</p>
                <p className="text-sm font-medium text-stone-500 mt-2">投喂次数 (Feeds)</p>
              </div>
            </div>

            {/* Favorites Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8 flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  特别关注 (Favorites)
                </h2>
                <span className="text-sm font-medium text-stone-400 cursor-pointer hover:text-stone-600 transition-colors">查看全部</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteCats.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={`/cat/${cat.id}`} 
                    className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex items-center gap-4 hover:shadow-md hover:border-orange-200 transition-all duration-200 group"
                  >
                    <img src={cat.imageUrl} alt={cat.name} className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <div className="flex-1">
                      <h4 className="font-bold text-stone-800 group-hover:text-orange-600 transition-colors">{cat.name}</h4>
                      <p className="text-xs text-stone-500 mt-1">{cat.zone} · {cat.color}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-orange-50 transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
