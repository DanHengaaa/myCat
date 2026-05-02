import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getCatDetail } from '../api/cats';
import { getComments, postComment } from '../api/comments';
import { AuthContext } from '../context/AuthContext';
import api from '../api/index';   // 上传用

export default function CatDetailPage() {
  const { id } = useParams();
  const [cat, setCat] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [commentPhoto, setCommentPhoto] = useState(null);   // 文件对象
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getCatDetail(id).then(res => setCat(res.data));
    getComments('cat', id).then(res => setComments(res.data.comments));
  }, [id]);

  const handleSubmitComment = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      let photoUrl = '';
      // 如果有图片，先上传
      if (commentPhoto) {
        const formData = new FormData();
        formData.append('photo', commentPhoto);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photoUrl = uploadRes.data.url;
      }

      await postComment({
        target_type: 'cat',
        target_id: Number(id),
        content,
        photo_url: photoUrl || null
      });

      // 刷新评论列表
      const res = await getComments('cat', id);
      setComments(res.data.comments);
      setContent('');
      setCommentPhoto(null);
    } catch (err) {
      alert('评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCommentPhoto(file || null);
  };

  if (!cat) return <div className="p-4">加载中...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-2">{cat.name}</h1>
        <p className="text-gray-600">性别: {cat.gender} | 毛色: {cat.color}</p>
        <p className="text-gray-600">性格: {cat.personality_tags?.join(', ')}</p>
        <p className="text-gray-600">健康: {cat.health_status} | {cat.neutered ? '已绝育' : '未绝育'}</p>
        <p className="mt-2">{cat.description}</p>
        {cat.locations && cat.locations.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">常驻地</h3>
            <ul className="list-disc ml-4">
              {cat.locations.map(loc => <li key={loc.id}>{loc.name}</li>)}
            </ul>
          </div>
        )}
      </div>

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
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
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
          <div key={c.id} className="bg-white rounded p-3 mb-2 shadow-sm">
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
        ))}
      </div>
    </div>
  );
}