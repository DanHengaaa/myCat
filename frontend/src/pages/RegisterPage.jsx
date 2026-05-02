import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password, nickname, email });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '注册失败');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">注册</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="w-full border p-2 mb-3 rounded" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="w-full border p-2 mb-3 rounded" type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} required />
        <input className="w-full border p-2 mb-3 rounded" placeholder="昵称" value={nickname} onChange={e => setNickname(e.target.value)} />
        <input className="w-full border p-2 mb-3 rounded" placeholder="邮箱" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">注册</button>
      </form>
      <p className="mt-3 text-sm">已有账号？<Link to="/login" className="text-blue-600">登录</Link></p>
    </div>
  );
}