import { useState, useEffect } from "react";
import AuthPage from "./pages/auth/AuthPage";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  if (user.role === "CITIZEN") {
    return <CitizenDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-700">Olá, {user.name}!</h2>
        <p className="text-gray-500 mt-1">{user.role} — painel em construção</p>
        <button
          onClick={handleLogout}
          className="mt-4 px-6 py-2 bg-red-100 text-red-600 rounded-xl text-sm"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
