import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      loginSuccess(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '登录失败');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">登录</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="w-full border p-2 mb-3 rounded" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="w-full border p-2 mb-3 rounded" type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">登录</button>
      </form>
      <p className="mt-3 text-sm">还没有账号？<Link to="/register" className="text-blue-600">注册</Link></p>
    </div>
  );
}