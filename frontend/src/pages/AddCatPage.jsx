import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCat } from '../api/cats';
import { AuthContext } from '../context/AuthContext';
import api from '../api/index';

export default function AddCatPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    gender: '未知',
    color: '',
    personality_tags: '',
    health_status: '',
    neutered: false,
    description: '',
  });
  const [photoFile, setPhotoFile] = useState(null);   // 选中的文件
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('猫咪名字不能为空');
      return;
    }

    try {
      let photoUrl = '';
      // 如果选择了照片，先上传
      if (photoFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('photo', photoFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photoUrl = uploadRes.data.url;
      }

      // 处理标签
      const tags = form.personality_tags
        .split(/[,，、]/)
        .map(t => t.trim())
        .filter(Boolean);

      // 创建猫咪
      await createCat({
        name: form.name,
        gender: form.gender,
        color: form.color,
        personality_tags: tags,
        health_status: form.health_status,
        neutered: form.neutered,
        description: form.description,
        main_photo_url: photoUrl || null
      });

      alert('猫咪档案创建成功！');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '操作失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">添加猫咪档案</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">名字 *</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">性别</label>
          <select name="gender" value={form.gender} onChange={handleChange}
            className="w-full border rounded px-3 py-2">
            <option value="未知">未知</option>
            <option value="公">公</option>
            <option value="母">母</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">毛色</label>
          <input name="color" value={form.color} onChange={handleChange}
            placeholder="例如：橘白、三花" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">性格标签（多个用逗号分隔）</label>
          <input name="personality_tags" value={form.personality_tags} onChange={handleChange}
            placeholder="亲人, 贪吃, 社恐" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">健康状态</label>
          <input name="health_status" value={form.health_status} onChange={handleChange}
            placeholder="例如：健康、轻微口炎" className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="neutered" checked={form.neutered} onChange={handleChange} />
          <label>已绝育</label>
        </div>
        <div>
          <label className="block mb-1">描述</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows="3" className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div>
          <label className="block mb-1">代表照片</label>
          <input type="file" accept="image/*" onChange={handleFileChange}
            className="w-full border rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-50 file:text-green-700" />
          {photoFile && <p className="text-sm text-gray-500 mt-1">已选择：{photoFile.name}</p>}
        </div>
        <button type="submit" disabled={uploading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
          {uploading ? '上传中...' : '提交'}
        </button>
      </form>
    </div>
  );
}