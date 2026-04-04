import { useState } from "react";
import api from "../../services/api";

export default function CitizenDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("schedule");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      setSuccess(true);
      setForm({
        address: "",
        scheduledDate: "",
        scheduledTime: "",
        notes: "",
        items: [],
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      alert("Erro ao agendar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-green-700">EcoLoop</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Olá, {user.name}</span>
          <button
            onClick={onLogout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab("schedule")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "schedule" ? "bg-white text-green-700 shadow" : "text-gray-400"}`}
          >
            Agendar Coleta
          </button>
          <button
            onClick={() => setTab("points")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "points" ? "bg-white text-green-700 shadow" : "text-gray-400"}`}
          >
            Pontos de Coleta
          </button>
        </div>

        {tab === "schedule" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Agendar coleta domiciliar
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Informe os dados e agendaremos a coleta na sua casa.
            </p>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
                Coleta agendada com sucesso!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Itens para descartar
                </label>
                <div className="flex flex-wrap gap-2">
                  {itemOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`px-3 py-2 rounded-xl text-sm border transition-all ${form.items.includes(item.id) ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-300"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Endereço completo
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Rua, número, bairro, cidade"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) =>
                      setForm({ ...form, scheduledDate: e.target.value })
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Horário
                  </label>
                  <select
                    value={form.scheduledTime}
                    onChange={(e) =>
                      setForm({ ...form, scheduledTime: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  >
                    <option value="">Selecione</option>
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
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Ex: portão azul, ligar antes de chegar..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || form.items.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? "Agendando..." : "Confirmar agendamento"}
              </button>
            </form>
          </div>
        )}

        {tab === "points" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Pontos de coleta próximos
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Leve seus eletrônicos diretamente a um ponto de coleta.
            </p>
            <div className="space-y-3">
              {[
                {
                  name: "Cooperativa Verde Manaus",
                  address: "Av. Brasil, 1234 - Centro",
                  distance: "1.2 km",
                  items: "Todos os eletrônicos",
                },
                {
                  name: "EcoPoint Adrianópolis",
                  address: "Rua 10 de Julho, 567",
                  distance: "2.8 km",
                  items: "Celulares, tablets, notebooks",
                },
                {
                  name: "Recicla+ Flores",
                  address: "Av. Constantino Nery, 890",
                  distance: "4.1 km",
                  items: "Eletrodomésticos",
                },
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:border-green-200 transition-all"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 text-green-600 font-bold">
                    ♻
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">
                      {point.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {point.address}
                    </p>
                    <p className="text-xs text-gray-400">{point.items}</p>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    {point.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
