import { Link } from 'react-router-dom';

export default function CatCard({ cat }) {
  return (
    <Link to={`/cats/${cat.id}`} className="block bg-white rounded-xl shadow p-3 hover:shadow-lg transition">
      <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-4xl">
        {cat.main_photo_url ? (
          <img
            src={`http://localhost:5000${cat.main_photo_url}`}
            alt={cat.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          '🐱'
        )}
      </div>
      <h3 className="font-semibold text-center">{cat.name}</h3>
      <p className="text-xs text-gray-500 text-center">{cat.color}</p>
      <div className="flex flex-wrap gap-1 mt-1">
        {cat.personality_tags?.map(tag => (
          <span key={tag} className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}