import { useState, useEffect } from "react";
import api from "../../services/api";

export default function CooperativeDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("requests");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedCollections, setAcceptedCollections] = useState([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const [pendingRes, acceptedRes] = await Promise.all([
        api.get("/collections/pending"),
        api.get("/collections/my-accepted"),
      ]);
      setPendingRequests(pendingRes.data);
      setAcceptedCollections(acceptedRes.data);
    } catch (error) {
      console.error("Erro ao buscar coletas", error);
    }
  };

  const handleAcceptRequest = async (request) => {
    try {
      await api.patch(`/collections/${request.id}/accept`);
      fetchCollections();
    } catch (error) {
      alert("Erro ao aceitar a coleta.");
    }
  };

  const handleCompleteCollection = async (id) => {
    try {
      await api.patch(`/collections/${id}/complete`);
      fetchCollections();
      alert("Coleta marcada como concluída com sucesso!");
    } catch (error) {
      alert("Erro ao concluir a coleta.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50/50 flex flex-col font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
      {/* Header Premium */}
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
              <span className="block text-xs text-amber-500 font-bold uppercase tracking-wider">
                Cooperativa
              </span>
            </div>
            <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-lg ring-2 ring-gray-100">
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
        {/* Seção de Resumo */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-950 tracking-tight">
              Painel Operacional
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie rotas de coleta, aceite solicitações e controle seu
              estoque de recicláveis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-1.5 transition-all hover:shadow-md hover:border-amber-100">
              <span className="text-sm text-gray-400 font-medium">
                Coletas na Rota Atual
              </span>
              <span className="text-3xl font-extrabold text-gray-950 tracking-tight">
                {acceptedCollections.length}
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full self-start mt-1">
                Em andamento
              </span>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-1.5 transition-all hover:shadow-md hover:border-amber-100">
              <span className="text-sm text-gray-400 font-medium">
                Volume Estimado
              </span>
              <span className="text-3xl font-extrabold text-gray-950 tracking-tight">
                -- <span className="text-lg font-bold text-gray-400">kg</span>
              </span>
              <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full self-start mt-1">
                Cálculo após pesagem
              </span>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-1.5 transition-all hover:shadow-md hover:border-amber-100">
              <span className="text-sm text-gray-400 font-medium">
                Novas Solicitações
              </span>
              <span className="text-3xl font-extrabold text-amber-500 tracking-tight">
                {pendingRequests.length}
              </span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full self-start mt-1">
                Aguardando sua ação
              </span>
            </div>
            <div className="bg-gray-900 p-6 rounded-3xl shadow-lg flex flex-col justify-between text-white transition-all hover:bg-black">
              <span className="text-base font-bold leading-tight">
                Vender para Empresa (B2B)
              </span>
              <button
                className="bg-white text-gray-900 text-sm font-bold py-2 px-4 rounded-xl mt-3 self-start shadow-inner opacity-50 cursor-not-allowed"
                title="Em breve"
              >
                Em breve
              </button>
            </div>
          </div>
        </section>

        {/* Abas de Navegação */}
        <div className="max-w-md mx-auto flex bg-gray-100/80 rounded-2xl p-1.5 border border-gray-200/50">
          <button
            onClick={() => setTab("requests")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${tab === "requests" ? "bg-white text-gray-950 shadow ring-1 ring-black/5" : "text-gray-500 hover:text-gray-700"}`}
          >
            📋 Novas Solicitações
            {pendingRequests.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("accepted")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${tab === "accepted" ? "bg-white text-gray-950 shadow ring-1 ring-black/5" : "text-gray-500 hover:text-gray-700"}`}
          >
            🚚 Minhas Coletas
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {tab === "requests" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300 max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">
                Solicitações de Descarte
              </h2>
              <p className="text-base text-gray-500 mt-1.5 leading-relaxed">
                Revise os pedidos dos cidadãos e aceite aqueles que se encaixam
                na sua rota de hoje.
              </p>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">
                  Nenhuma nova solicitação no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="grid grid-cols-1 lg:grid-cols-[1fr,auto,auto] items-center gap-6 p-5 border border-gray-100 rounded-2xl hover:border-amber-200 hover:bg-gray-50/50 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-950 text-base">
                          {req.citizen?.name}
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          Novo
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        📍 {req.address}
                      </p>

                      {/* Renderiza a lista de itens vinda do banco de dados */}
                      <div className="flex flex-wrap gap-2">
                        {req.items?.map((item, i) => (
                          <span
                            key={i}
                            className="text-xs text-gray-600 bg-gray-100 font-medium px-2 py-1 rounded-lg border border-gray-200"
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>

                      {req.notes && (
                        <p className="mt-2 text-xs text-gray-400 italic">
                          " {req.notes} "
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center min-w-[120px]">
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                        Agendado para
                      </p>
                      <p className="font-bold text-gray-800 text-sm">
                        {formatDate(req.scheduledDate)}
                      </p>
                      <p className="font-bold text-emerald-600 text-sm">
                        às {formatTime(req.scheduledDate)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="w-full lg:w-auto bg-gray-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md active:scale-[0.98]"
                    >
                      Aceitar Coleta
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "accepted" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300 max-w-5xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-950 tracking-tight">
                  Sua Rota de Coletas
                </h2>
                <p className="text-base text-gray-500 mt-1.5 leading-relaxed">
                  Gerencie as coletas que você aceitou.
                </p>
              </div>
            </div>

            {acceptedCollections.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">
                  Você ainda não aceitou nenhuma coleta.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {acceptedCollections.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col lg:flex-row items-center justify-between gap-6 p-5 border-2 border-emerald-100 bg-emerald-50/30 rounded-2xl transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-950 text-base">
                        {req.citizen?.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        📍 {req.address}
                      </p>
                      <div className="flex gap-2 mt-2 text-xs text-emerald-800 font-medium">
                        {req.items?.map((item, i) => (
                          <span key={i}>
                            {item.name}
                            {i < req.items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-emerald-700 mt-3">
                        Coletar dia {formatDate(req.scheduledDate)} às{" "}
                        {formatTime(req.scheduledDate)}
                      </p>
                    </div>

                    <div className="flex w-full lg:w-auto gap-3">
                      <button
                        onClick={() => handleCompleteCollection(req.id)}
                        className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] text-sm"
                      >
                        ✅ Concluir Coleta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
