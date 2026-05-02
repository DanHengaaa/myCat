import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCatDetail } from '../api/cats';
import { getComments, postComment } from '../api/comments';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function CatDetailPage() {
  const { id } = useParams();
  const [cat, setCat] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getCatDetail(id).then(res => setCat(res.data));
    getComments('cat', id).then(res => setComments(res.data.comments));
  }, [id]);

  const handleSubmitComment = async () => {
    if (!content.trim()) return;
    try {
      await postComment({ target_type: 'cat', target_id: Number(id), content });
      setContent('');
      // 刷新评论列表
      const res = await getComments('cat', id);
      setComments(res.data.comments);
    } catch (err) {
      alert('评论失败');
    }
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
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="分享你和它的故事..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <button onClick={handleSubmitComment} className="bg-green-600 text-white px-4 py-2 rounded">发布</button>
          </div>
        )}
        {comments.map(c => (
          <div key={c.id} className="bg-white rounded p-3 mb-2 shadow-sm">
            <div className="flex justify-between text-sm text-gray-500">
              <span>{c.user_nickname}</span>
              <span>{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <p className="mt-1">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}