import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatDetailPage from './pages/CatDetailPage';
import CheckinPage from './pages/CheckinPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AddCatPage from './pages/AddCatPage';
import AddLocationPage from './pages/AddLocationPage';
import ReviewPage from './pages/ReviewPage';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cats/:id" element={<CatDetailPage />} />
          <Route path="/checkin" element={<CheckinPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/add-cat" element={<AddCatPage />} />
          <Route path="/add-location" element={<AddLocationPage />} />
          <Route path="/review" element={<ReviewPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;