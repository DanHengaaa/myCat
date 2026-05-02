import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/index';
import { AuthContext } from '../context/AuthContext';

export default function EditCatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 未登录跳转
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 加载当前猫咪数据
  useEffect(() => {
    if (!id) return;
    api.get(`/cats/${id}`)
      .then(res => {
        const cat = res.data;
        setForm({
          name: cat.name || '',
          gender: cat.gender || '未知',
          color: cat.color || '',
          personality_tags: cat.personality_tags?.join(', ') || '',
          health_status: cat.health_status || '',
          neutered: cat.neutered || false,
          description: cat.description || '',
          main_photo_url: cat.main_photo_url || '',
        });
      })
      .catch(() => {
        setError('无法加载猫咪信息');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 将性格标签字符串转为数组
    const tags = form.personality_tags
      .split(/[,，、]/)
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      name: form.name,
      gender: form.gender,
      color: form.color,
      personality_tags: tags,
      health_status: form.health_status,
      neutered: form.neutered,
      description: form.description,
      main_photo_url: form.main_photo_url || null,
    };

    try {
      await api.put(`/cats/${id}/edit-request`, payload);
      alert('编辑请求已提交，等待管理员审核。');
      navigate(`/cats/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (!form) return <div className="p-4 text-center">加载中...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">编辑猫咪档案</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-1">名字 *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">性别</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="未知">未知</option>
            <option value="公">公</option>
            <option value="母">母</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">毛色</label>
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="例如：橘白"
          />
        </div>
        <div>
          <label className="block mb-1">性格标签（多个用逗号分隔）</label>
          <input
            name="personality_tags"
            value={form.personality_tags}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="亲人, 贪吃, 社恐"
          />
        </div>
        <div>
          <label className="block mb-1">健康状态</label>
          <input
            name="health_status"
            value={form.health_status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="健康、轻微口炎等"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="neutered"
            checked={form.neutered}
            onChange={handleChange}
          />
          <label>已绝育</label>
        </div>
        <div>
          <label className="block mb-1">描述</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">代表照片链接（可选）</label>
          <input
            name="main_photo_url"
            value={form.main_photo_url}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="https://..."
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '提交中...' : '提交编辑请求'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/cats/${id}`)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}