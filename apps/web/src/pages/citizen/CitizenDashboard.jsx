import { useState, useEffect } from "react";
import api from "../../services/api";

export default function CitizenDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("schedule");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Novos estados para os dados dinâmicos
  const [myCollections, setMyCollections] = useState([]);
  const [stats, setStats] = useState({ recycled: 0, pending: 0, points: 0 });

  const [form, setForm] = useState({
    address: "",
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
    items: [],
  });

  const itemOptions = [
    { id: "smartphone", label: "Smartphone" },
    { id: "notebook", label: "Notebook" },
    { id: "tv", label: "TV" },
    { id: "geladeira", label: "Geladeira" },
    { id: "impressora", label: "Impressora" },
    { id: "tablet", label: "Tablet" },
    { id: "cabos", label: "Cabos" },
    { id: "bateria", label: "Bateria" },
  ];

  // Busca os dados reais ao carregar a página
  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    try {
      const { data } = await api.get("/collections/my");
      setMyCollections(data);

      // Calculando as estatísticas dinamicamente
      const pendingCount = data.filter((c) => c.status === "PENDING").length;
      const completedCount = data.filter(
        (c) => c.status === "COMPLETED",
      ).length;

      // Simulação: Vamos fingir que cada coleta finalizada gerou em média 25kg e rendeu 350 pontos
      setStats({
        recycled: completedCount * 25,
        pending: pendingCount,
        points: completedCount * 350,
      });
    } catch (error) {
      console.error("Erro ao buscar dados do cidadão", error);
    }
  };

  const toggleItem = (id) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.includes(id)
        ? prev.items.filter((i) => i !== id)
        : [...prev.items, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dateTimeString = `${form.scheduledDate}T${form.scheduledTime}:00`;

      await api.post("/collections", {
        address: form.address,
        scheduledDate: new Date(dateTimeString).toISOString(),
        notes: form.notes,
        items: form.items,
      });

      setSuccess(true);
      setForm({
        address: "",
        scheduledDate: "",
        scheduledTime: "",
        notes: "",
        items: [],
      });
      setTimeout(() => setSuccess(false), 4000);

      // Atualiza os cards dinamicamente após criar uma nova coleta
      fetchMyData();
    } catch (err) {
      alert("Erro ao agendar a coleta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50/50 flex flex-col font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
      {/* Header Premium (Ocupa 100% da largura) */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[90rem] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-950 rounded-xl flex items-center justify-center font-bold text-green-400 text-xl shadow-inner">
              E
            </div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 tracking-tight">
              Eco<span className="text-gray-900">Loop</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-sm font-semibold text-gray-950">
                {user.name}
              </span>
              <span className="block text-xs text-gray-400 font-medium">
                Cidadão Consciente
              </span>
            </div>
            <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 ring-gray-100">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              className="ml-2 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors bg-gray-100/70 px-4 py-2 rounded-full"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[90rem] mx-auto p-6 md:p-8 space-y-10">
        {/* Seção de Resumo com DADOS DINÂMICOS */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-950 tracking-tight">
              Bem-vindo ao seu Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Aqui você gerencia o seu descarte eletrônico e monitora seu
              impacto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-1.5 transition-all hover:shadow-md hover:border-green-100">
              <span className="text-sm text-gray-400 font-medium">
                Total Reciclado Estimado
              </span>
              <span className="text-3xl font-extrabold text-gray-950 tracking-tight">
                {stats.recycled}{" "}
                <span className="text-lg font-bold text-gray-400">kg</span>
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full self-start mt-1">
                Atualizado hoje
              </span>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-1.5 transition-all hover:shadow-md hover:border-green-100">
              <span className="text-sm text-gray-400 font-medium">
                Agendamentos Pendentes
              </span>
              <span className="text-3xl font-extrabold text-gray-950 tracking-tight">
                {stats.pending.toString().padStart(2, "0")}{" "}
                <span className="text-lg font-bold text-gray-400">coletas</span>
              </span>
              <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full self-start mt-1">
                Aguardando cooperativa
              </span>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-1.5 transition-all hover:shadow-md hover:border-green-100">
              <span className="text-sm text-gray-400 font-medium">
                Pontos Gerados
              </span>
              <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                {stats.points}{" "}
                <span className="text-lg font-bold text-emerald-400">pts</span>
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full self-start mt-1">
                Resgatável em breve
              </span>
            </div>
            <div className="bg-green-600 p-6 rounded-3xl shadow-lg flex flex-col justify-between text-white transition-all hover:bg-green-700">
              <span className="text-base font-bold leading-tight">
                Pronto para o próximo descarte?
              </span>
              <button
                onClick={() => setTab("schedule")}
                className="bg-white text-green-700 text-sm font-bold py-2 px-4 rounded-xl mt-3 self-start shadow-inner hover:bg-green-50 transition-colors"
              >
                Novo Agendamento
              </button>
            </div>
          </div>
        </section>

        {/* ... Restante do JSX (Abas e Formulário continuam iguais) ... */}
        {/* Abas de Navegação (iOS style) */}
        <div className="max-w-md mx-auto flex bg-gray-100/80 rounded-2xl p-1.5 border border-gray-200/50">
          <button
            onClick={() => setTab("schedule")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${tab === "schedule" ? "bg-white text-gray-950 shadow ring-1 ring-black/5" : "text-gray-500 hover:text-gray-700"}`}
          >
            🗓️ Agendar Coleta
          </button>
          <button
            onClick={() => setTab("points")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${tab === "points" ? "bg-white text-gray-950 shadow ring-1 ring-black/5" : "text-gray-500 hover:text-gray-700"}`}
          >
            📍 Pontos de Coleta
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {tab === "schedule" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300 max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">
                Nova solicitação de coleta domiciliar
              </h2>
              <p className="text-base text-gray-500 mt-1.5 leading-relaxed max-w-2xl">
                Preencha os dados abaixo e as cooperativas parceiras serão
                notificadas para agendar a retirada dos seus eletrônicos na sua
                residência.
              </p>
            </div>

            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-base px-5 py-4 rounded-2xl mb-6 font-semibold animate-in slide-in-from-top-2">
                Coleta agendada com sucesso! Você pode acompanhar o status nos
                seus cards acima.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2.5 ml-1">
                  Selecione os itens para descartar
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {itemOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 text-center flex items-center justify-center ${form.items.includes(item.id) ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20" : "bg-white text-gray-700 border-gray-200 hover:border-green-300"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5 ml-1">
                  Endereço completo para retirada
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Rua, número, bairro, cidade (ex: Rua Floriano Peixoto, 123 - Centro)"
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-1.5 ml-1">
                    Melhor data para retirada
                  </label>
                  <input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) =>
                      setForm({ ...form, scheduledDate: e.target.value })
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-1.5 ml-1">
                    Melhor horário
                  </label>
                  <select
                    value={form.scheduledTime}
                    onChange={(e) =>
                      setForm({ ...form, scheduledTime: e.target.value })
                    }
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer appearance-none"
                  >
                    <option value="">Selecione um horário</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-1.5 ml-1">
                  Observações (opcional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Ex: portão azul, ligar antes de chegar, itens pesados..."
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || form.items.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:bg-green-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-green-600/30 disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2 transform active:scale-[0.99]"
              >
                {loading
                  ? "Processando Agendamento..."
                  : "Confirmar Solicitação de Coleta"}
              </button>
            </form>
          </div>
        )}

        {tab === "points" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300 max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">
                  Pontos de Coleta Cadastrados (Fictícios)
                </h2>
                <p className="text-base text-gray-500 mt-1.5 leading-relaxed">
                  Leve seus eletrônicos diretamente a um ponto de coleta
                  credenciado e ganhe pontos extra.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Cooperativa Verde Manaus (Fictício)",
                  address: "Av. Brasil, 1234 - Centro",
                  distance: "1.2 km",
                  items: "Todos os eletrônicos",
                },
                {
                  name: "EcoPoint Adrianópolis (Fictício)",
                  address: "Rua 10 de Julho, 567",
                  distance: "2.8 km",
                  items: "Celulares, tablets, notebooks",
                },
              ].map((point, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[auto,1fr,auto] items-center gap-5 p-5 border border-gray-100 rounded-2xl hover:border-green-200 hover:bg-gray-50/50 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-green-100/70 rounded-2xl flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-lg shadow-inner">
                    ♻️
                  </div>
                  <div>
                    <p className="font-semibold text-gray-950 text-base">
                      {point.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {point.address}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-sm font-semibold text-green-700 bg-green-100/70 px-3 py-1 rounded-xl">
                      {point.distance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
