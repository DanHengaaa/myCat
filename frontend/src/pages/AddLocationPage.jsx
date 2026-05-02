import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLocation } from '../api/locations';
import { AuthContext } from '../context/AuthContext';

export default function AddLocationPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    latitude: '',
    longitude: '',
    description: ''
  });
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.latitude || !form.longitude) {
      setError('名称和坐标不能为空');
      return;
    }
    try {
      await createLocation({
        name: form.name,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        description: form.description
      });
      alert('点位已提交，管理员审核通过后将在首页显示');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '提交失败');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">添加新点位</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">名称 *</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">纬度 *</label>
          <input name="latitude" value={form.latitude} onChange={handleChange} required
            type="number" step="any" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">经度 *</label>
          <input name="longitude" value={form.longitude} onChange={handleChange} required
            type="number" step="any" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">描述</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows="2" className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded">提交</button>
      </form>
    </div>
  );
}