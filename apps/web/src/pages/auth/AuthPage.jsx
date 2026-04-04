import { useState } from "react";
import api from "../../services/api";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CITIZEN",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao conectar com o servidor",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Lado Esquerdo - Branding (Visível apenas em telas grandes) */}
      <div className="relative hidden lg:flex w-1/2 bg-green-950 flex-col justify-between p-12 overflow-hidden">
        {/* Efeitos de fundo (Círculos desfocados) */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-emerald-500/20 rounded-full blur-3xl"></div>

        {/* Logo Topo */}
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200 tracking-tight">
            Eco<span className="text-white">Loop</span>
          </h1>
        </div>

        {/* Mensagem Central */}
        <div className="relative z-10 mb-20">
          <h2 className="text-5xl font-bold text-white leading-[1.15] tracking-tight mb-6">
            O futuro do descarte <br /> começa aqui.
          </h2>
          <p className="text-green-200/80 text-lg max-w-md leading-relaxed font-medium">
            Conectamos cidadãos, cooperativas e empresas para um ciclo de vida
            eletrônico inteligente e responsável.
          </p>
        </div>

        {/* Rodapé Esquerdo */}
        <div className="relative z-10 text-green-400/60 text-sm font-medium">
          © {new Date().getFullYear()} EcoLoop. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Cabeçalho do Mobile (Aparece só em telas pequenas) */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 tracking-tight">
              Eco<span className="text-gray-900">Loop</span>
            </h1>
            <p className="text-gray-500 mt-2 text-base font-medium">
              Plataforma de descarte responsável
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h3>
            <p className="text-gray-500 mt-2 text-base">
              {isLogin
                ? "Insira seus dados para acessar o seu painel."
                : "Preencha os dados abaixo para começar a reciclar."}
            </p>
          </div>

          {/* Toggle estilo iOS (Segmented Control) */}
          <div className="flex bg-gray-100/80 rounded-xl p-1 mb-8 border border-gray-200/50">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-base font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-base font-semibold transition-all duration-300 ${
                !isLogin
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5 ml-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: João da Silva"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-base transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            )}

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="joao@email.com"
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-base transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1.5 ml-1">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-base transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5 ml-1">
                  Tipo de conta
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-base transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer appearance-none"
                >
                  <option value="CITIZEN">Cidadão (Quero descartar)</option>
                  <option value="COOPERATIVE">
                    Cooperativa (Ponto de coleta)
                  </option>
                  <option value="COMPANY">Empresa (Descarte em massa)</option>
                </select>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-base px-4 py-3.5 rounded-xl font-medium animate-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 active:bg-black text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed text-base mt-4 transform active:scale-[0.99]"
            >
              {loading
                ? "Processando..."
                : isLogin
                  ? "Entrar na plataforma"
                  : "Criar conta gratuitamente"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
