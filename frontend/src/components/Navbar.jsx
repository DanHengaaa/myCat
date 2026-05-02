import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-green-600">🐱 校园猫咪助手</Link>
      <div className="space-x-4">
        <Link to="/leaderboard" className="text-gray-600">排行榜</Link>
        {user ? (
          <>
            <Link to="/checkin" className="text-blue-600">打卡</Link>
            <Link to="/profile" className="text-gray-600">{user.nickname}</Link>
            <Link to="/add-cat" className="text-green-600">添加猫咪</Link>
            <Link to="/add-location" className="text-green-600">添加点位</Link>
            {user.role === 'admin' && (
              <>
                <Link to="/review" className="text-orange-500">审核管理</Link>
                <Link to="/dashboard" className="text-red-500">数据看板</Link>
              </>
            )}
            <button onClick={handleLogout} className="text-gray-400">退出</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600">登录</Link>
            <Link to="/register" className="text-gray-600">注册</Link>
          </>
        )}
      </div>
    </nav>
  );
}