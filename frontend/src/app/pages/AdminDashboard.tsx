import { useState } from "react";
import { Users, Cat, BarChart3, CheckSquare, Search, LayoutDashboard, Menu, LogOut, MoreVertical } from "lucide-react";
import { Link } from "react-router";
import { mockCats, mockCheckIns } from "../../data/mock";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "图书馆区", uv: 4000, pv: 2400, amt: 2400 },
  { name: "理科楼区", uv: 3000, pv: 1398, amt: 2210 },
  { name: "宿舍区", uv: 2000, pv: 9800, amt: 2290 },
  { name: "食堂区", uv: 2780, pv: 3908, amt: 2000 },
  { name: "操场区", uv: 1890, pv: 4800, amt: 2181 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans text-stone-900 w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 hidden md:flex flex-col z-20 shadow-sm shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-stone-200">
          <Cat className="w-6 h-6 text-orange-600 mr-2" />
          <h1 className="text-lg font-bold text-stone-800 tracking-tight">后台管理 (Admin)</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<LayoutDashboard />} label="数据看板 (Dashboard)" />
          <NavItem active={activeTab === "cats"} onClick={() => setActiveTab("cats")} icon={<Cat />} label="档案管理 (Cats)" />
          <NavItem active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={<Users />} label="用户管理 (Users)" />
          <NavItem active={activeTab === "audit"} onClick={() => setActiveTab("audit")} icon={<CheckSquare />} label="打卡审核 (Audit)" badge={5} />
          <NavItem active={activeTab === "stats"} onClick={() => setActiveTab("stats")} icon={<BarChart3 />} label="点位热力 (Heatmap)" />
        </nav>

        <div className="p-4 border-t border-stone-200">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-stone-500 hover:bg-stone-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">返回前台 (Exit App)</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[#f8f9fa]">
        {/* Header */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-stone-500 hover:bg-stone-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="搜索猫咪或用户..."
                className="w-full bg-stone-100 border-none rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none placeholder:text-stone-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-stone-800">管理员 (Admin)</p>
              <p className="text-xs text-stone-400">超级权限</p>
            </div>
            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-9 h-9 rounded-full ring-2 ring-stone-100" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 sm:p-8 flex-1 overflow-x-hidden">
          {activeTab === "dashboard" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-stone-800">概览数据 (Overview)</h2>
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="校园猫咪总数" value="42" change="+3" type="up" icon={<Cat className="w-6 h-6 text-orange-500" />} />
                <StatCard title="注册用户数" value="1,204" change="+12" type="up" icon={<Users className="w-6 h-6 text-blue-500" />} />
                <StatCard title="累计打卡" value="8,932" change="+156" type="up" icon={<CheckSquare className="w-6 h-6 text-green-500" />} />
                <StatCard title="待审核工单" value="5" change="-2" type="down" icon={<AlertIcon className="w-6 h-6 text-red-500" />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 lg:col-span-2">
                  <h3 className="text-lg font-bold text-stone-800 mb-4">区域活跃热度 (Activity per Zone)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="pv" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} name="打卡次数" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Approvals / Audits */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-stone-800">最新打卡 (Recent)</h3>
                    <button onClick={() => setActiveTab("audit")} className="text-xs font-medium text-orange-600 hover:text-orange-700">查看全部</button>
                  </div>
                  <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    {mockCheckIns.map(record => (
                      <div key={record.id} className="flex gap-3 pb-4 border-b border-stone-100 last:border-0">
                        <img src={record.userAvatar} alt="user" className="w-10 h-10 rounded-full shrink-0 bg-stone-100" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-stone-800 truncate">{record.userName}</p>
                          <p className="text-xs text-stone-500 truncate mt-0.5">打卡: <span className="text-orange-600 font-medium">{mockCats.find(c => c.id === record.catId)?.name}</span></p>
                          <p className="text-xs text-stone-400 mt-1">{record.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cats" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-stone-800">档案管理 (Cat Profiles)</h2>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-xl shadow-sm hover:bg-orange-600 text-sm font-medium transition-colors">
                  + 新增猫咪 (Add Cat)
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold border-b border-stone-200">猫咪 (Cat)</th>
                      <th className="p-4 font-semibold border-b border-stone-200 hidden sm:table-cell">特征 (Features)</th>
                      <th className="p-4 font-semibold border-b border-stone-200">常驻区 (Zone)</th>
                      <th className="p-4 font-semibold border-b border-stone-200 hidden md:table-cell">状态 (Status)</th>
                      <th className="p-4 font-semibold border-b border-stone-200 text-right">操作 (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {mockCats.map(cat => (
                      <tr key={cat.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0" />
                            <div>
                              <p className="font-bold text-stone-800 text-sm">{cat.name}</p>
                              <p className="text-xs text-stone-500">{cat.gender}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <p className="text-sm text-stone-700">{cat.color}</p>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                            {cat.zone}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex gap-2">
                            {cat.neutered && <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5" title="已绝育"></span>}
                            {cat.vaccinated && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" title="已免疫"></span>}
                            {!cat.neutered && !cat.vaccinated && <span className="text-xs text-stone-400">未处理</span>}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-stone-400 hover:text-stone-600 p-1">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {["users", "audit", "stats"].includes(activeTab) && (
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-96 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50">
              <Cat className="w-12 h-12 text-stone-300 mb-4" />
              <h3 className="text-lg font-bold text-stone-500">模块开发中 (Under Development)</h3>
              <p className="text-sm text-stone-400 mt-2">The {activeTab} module will be available soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
        active ? "bg-orange-50 text-orange-600 font-bold" : "text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900"
      }`}
    >
      <div className="flex items-center gap-3 text-sm">
        <span className={`${active ? "text-orange-600" : "text-stone-400"}`}>{icon}</span>
        {label}
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{badge}</span>
      )}
    </button>
  );
}

function StatCard({ title, value, change, type, icon }: { title: string; value: string; change: string; type: "up" | "down"; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <p className="text-3xl font-bold text-stone-800 mt-2">{value}</p>
        <div className="flex items-center gap-1 mt-2">
          <span className={`text-xs font-bold ${type === "up" ? "text-green-500" : "text-red-500"}`}>
            {change}
          </span>
          <span className="text-xs text-stone-400">vs 上周 (last week)</span>
        </div>
      </div>
      <div className="p-3 bg-stone-50 rounded-xl">
        {icon}
      </div>
    </div>
  );
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
}
