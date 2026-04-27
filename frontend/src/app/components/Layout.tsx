import { Outlet, NavLink } from "react-router";
import { Map, Camera, User, Cat, LayoutDashboard } from "lucide-react";
import { clsx } from "clsx";

export default function Layout() {
  return (
    <div className="w-full min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans text-stone-900">
      {/* Mobile Header */}
      <header className="md:hidden px-4 py-3 bg-orange-50 border-b border-orange-100 flex items-center justify-between z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-2 text-orange-600 font-semibold text-lg">
          <Cat className="w-6 h-6" />
          <span>校园流浪猫图鉴</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 h-screen sticky top-0 z-20 shadow-sm shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-stone-200 shrink-0">
          <Cat className="w-6 h-6 text-orange-600 mr-2" />
          <h1 className="text-lg font-bold text-stone-800 tracking-tight">MeowCampus</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <DesktopNavLink to="/" icon={<Map className="w-5 h-5" />} label="地图探索 (Map)" />
          <DesktopNavLink to="/checkin" icon={<Camera className="w-5 h-5" />} label="快速打卡 (Check-in)" />
          <DesktopNavLink to="/profile" icon={<User className="w-5 h-5" />} label="个人中心 (Profile)" />
        </nav>

        <div className="p-4 border-t border-stone-200 shrink-0">
          <DesktopNavLink to="/admin" icon={<LayoutDashboard className="w-5 h-5" />} label="管理后台 (Admin)" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-h-0 bg-white overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-2 pb-safe z-20 flex justify-between items-center h-[70px] shrink-0">
        <MobileNavLink to="/" icon={<Map className="w-6 h-6" />} label="地图" />
        <MobileNavLink to="/checkin" icon={<Camera className="w-6 h-6" />} label="打卡" isCenter />
        <MobileNavLink to="/profile" icon={<User className="w-6 h-6" />} label="我的" />
      </nav>
    </div>
  );
}

function DesktopNavLink({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
          isActive
            ? "bg-orange-50 text-orange-600 shadow-sm border border-orange-100/50"
            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900 border border-transparent"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

function MobileNavLink({ to, icon, label, isCenter }: { to: string, icon: React.ReactNode, label: string, isCenter?: boolean }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        clsx(
          "flex flex-col items-center gap-1",
          isCenter ? "relative -top-5" : "",
          isActive ? "text-orange-500" : "text-stone-400 hover:text-orange-400"
        )
      }
    >
      {isCenter ? (
        <>
          <div className="bg-orange-400 text-white p-3 rounded-full shadow-lg shadow-orange-200 ring-4 ring-white">
            {icon}
          </div>
          <span className="text-[10px] font-medium text-stone-500">{label}</span>
        </>
      ) : (
        <>
          {icon}
          <span className="text-[10px] font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}
