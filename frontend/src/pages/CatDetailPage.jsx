import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCatDetail } from '../api/cats';
import { getComments, postComment } from '../api/comments';
import { AuthContext } from '../context/AuthContext';
import api from '../api/index';

export default function CatDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [cat, setCat] = useState(null);
  const [comments, setComments] = useState([]);

  // 评论相关
  const [content, setContent] = useState('');
  const [commentPhoto, setCommentPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 编辑相关
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editPhotoFile, setEditPhotoFile] = useState(null);   // 新选择的照片文件
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    refreshCat();
    refreshComments();
  }, [id]);

  const refreshCat = () => {
    getCatDetail(id).then(res => {
      setCat(res.data);
      setEditForm({
        name: res.data.name || '',
        gender: res.data.gender || '未知',
        color: res.data.color || '',
        personality_tags: res.data.personality_tags?.join(', ') || '',
        health_status: res.data.health_status || '',
        neutered: res.data.neutered || false,
        description: res.data.description || '',
        main_photo_url: res.data.main_photo_url || '',
      });
      setEditPhotoFile(null);   // 重置
    });
  };

  const refreshComments = () => {
    getComments('cat', id).then(res => setComments(res.data.comments));
  };

  // 删除评论
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      alert('评论已删除');
      refreshComments();
    } catch (err) {
      alert(err.response?.data?.message || '删除失败');
    }
  };

  // 提交评论
  const handleSubmitComment = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      let photoUrl = '';
      if (commentPhoto) {
        const formData = new FormData();
        formData.append('photo', commentPhoto);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrl = uploadRes.data.url;
      }

      await postComment({
        target_type: 'cat',
        target_id: Number(id),
        content,
        photo_url: photoUrl || null,
      });

      refreshComments();
      setContent('');
      setCommentPhoto(null);
    } catch (err) {
      alert('评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 编辑表单处理
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 选择新照片
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    setEditPhotoFile(file || null);
  };

  // 提交编辑请求
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSubmitting(true);

    try {
      const tags = editForm.personality_tags
        .split(/[,，、]/)
        .map(t => t.trim())
        .filter(Boolean);

      // 先上传新照片（如果有）
      let photoUrl = editForm.main_photo_url; // 默认用原来的链接
      if (editPhotoFile) {
        const formData = new FormData();
        formData.append('photo', editPhotoFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrl = uploadRes.data.url;
      }

      const payload = {
        name: editForm.name,
        gender: editForm.gender,
        color: editForm.color,
        personality_tags: tags,
        health_status: editForm.health_status,
        neutered: editForm.neutered,
        description: editForm.description,
        main_photo_url: photoUrl || null,
      };

      await api.put(`/cats/${id}/edit-request`, payload);
      alert('编辑请求已提交，管理员审核后将更新档案。');
      setEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.message || '提交失败');
    } finally {
      setEditSubmitting(false);
    }
  };

  if (!cat) return <div className="p-4">加载中...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* 猫咪基本信息卡片 */}
      <div className="bg-white rounded-xl shadow p-6">
        {!editing ? (
          <>
            <h1 className="text-3xl font-bold mb-2">{cat.name}</h1>
            <p className="text-gray-600">性别: {cat.gender} | 毛色: {cat.color}</p>
            <p className="text-gray-600">性格: {cat.personality_tags?.join(', ')}</p>
            <p className="text-gray-600">健康: {cat.health_status} | {cat.neutered ? '已绝育' : '未绝育'}</p>
            {cat.description && <p className="mt-2">{cat.description}</p>}
            {cat.main_photo_url && (
              <img
                src={cat.main_photo_url.startsWith('http') ? cat.main_photo_url : `http://localhost:5000${cat.main_photo_url}`}
                alt={cat.name}
                className="mt-3 rounded-lg max-h-48 object-cover"
              />
            )}
            {cat.locations && cat.locations.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">常驻地</h3>
                <ul className="list-disc ml-4">
                  {cat.locations.map(loc => <li key={loc.id}>{loc.name}</li>)}
                </ul>
              </div>
            )}
            {user && (
              <button
                onClick={() => setEditing(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                编辑档案
              </button>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmitEdit}>
            <h2 className="text-2xl font-bold mb-4">编辑猫咪档案</h2>
            {editError && <p className="text-red-500 mb-3">{editError}</p>}
            <div className="space-y-3">
              <div>
                <label className="block mb-1">名字 *</label>
                <input name="name" value={editForm.name} onChange={handleEditChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1">性别</label>
                <select name="gender" value={editForm.gender} onChange={handleEditChange} className="w-full border rounded px-3 py-2">
                  <option value="未知">未知</option>
                  <option value="公">公</option>
                  <option value="母">母</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">毛色</label>
                <input name="color" value={editForm.color} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1">性格标签（逗号分隔）</label>
                <input name="personality_tags" value={editForm.personality_tags} onChange={handleEditChange} className="w-full border rounded px-3 py-2" placeholder="亲人, 贪吃" />
              </div>
              <div>
                <label className="block mb-1">健康状态</label>
                <input name="health_status" value={editForm.health_status} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="neutered" checked={editForm.neutered} onChange={handleEditChange} />
                <label>已绝育</label>
              </div>
              <div>
                <label className="block mb-1">描述</label>
                <textarea name="description" value={editForm.description} onChange={handleEditChange} rows="3" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1">当前照片</label>
                {editForm.main_photo_url ? (
                  <img
                    src={editForm.main_photo_url.startsWith('http') ? editForm.main_photo_url : `http://localhost:5000${editForm.main_photo_url}`}
                    alt="当前照片"
                    className="h-24 object-cover rounded border mb-2"
                  />
                ) : (
                  <p className="text-sm text-gray-500">暂无照片</p>
                )}
                <label className="block mb-1">上传新照片（可选）</label>
                <input type="file" accept="image/*" onChange={handleEditFileChange} className="w-full border rounded px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700" />
                {editPhotoFile && <p className="text-xs text-gray-500 mt-1">已选择：{editPhotoFile.name}</p>}
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={editSubmitting} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
                  {editSubmitting ? '提交中...' : '提交编辑请求'}
                </button>
                <button type="button" onClick={() => { setEditing(false); setEditError(''); }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">取消</button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* 故事墙 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3">故事墙</h2>
        {user && (
          <div className="mb-4 bg-gray-50 p-3 rounded-lg">
            <textarea
              className="w-full border rounded px-3 py-2 mb-2"
              rows="2"
              placeholder="分享你和它的故事..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => setCommentPhoto(e.target.files[0])} className="hidden" />
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">📷 添加图片</span>
                {commentPhoto && <span className="text-xs text-gray-500">{commentPhoto.name}</span>}
              </label>
              <button
                onClick={handleSubmitComment}
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? '发布中...' : '发布'}
              </button>
            </div>
          </div>
        )}

        {comments.map(c => (
          <div key={c.id} className="bg-white rounded p-3 mb-2 shadow-sm flex justify-between items-start">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{c.user_nickname}</span>
                <span>{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-1">{c.content}</p>
              {c.photo_url && (
                <img
                  src={c.photo_url.startsWith('http') ? c.photo_url : `http://localhost:5000${c.photo_url}`}
                  alt="评论图片"
                  style={{ maxWidth: '200px', maxHeight: '150px', marginTop: '8px', borderRadius: '6px' }}
                />
              )}
            </div>
            {user && (user.id === c.user_id || user.role === 'admin') && (
              <button
                onClick={() => handleDeleteComment(c.id)}
                className="ml-3 text-red-500 text-sm hover:underline shrink-0"
              >
                删除
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}