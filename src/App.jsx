import React from "react"; 
import { useState, useMemo } from "react";
import {
  X,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Activity,
  Search,
  Bus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [selectedBus, setSelectedBus] = useState("****1");
  const [direction, setDirection] = useState("Ida");
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedTime, setSelectedTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const busOptions = useMemo(
    () => ({
      "****1": {
        number: "019",
        type: "Micro-ônibus",
        route: "Biopark via CD",
        capacity: 45,
        schedules: {
          ida: [
            {
              time: "06:45",
              passengers: 32,
              avgPassengers: 28,
              occupancy: 71,
              trend: "stable",
              busType: "Micro-ônibus",
            },
            {
              time: "06:55",
              passengers: 38,
              avgPassengers: 35,
              occupancy: 84,
              trend: "up",
              busType: "Micro-ônibus",
            },
            {
              time: "07:05",
              passengers: 42,
              avgPassengers: 40,
              occupancy: 93,
              trend: "up",
              busType: "Micro-ônibus",
            },
            {
              time: "07:08",
              passengers: 45,
              avgPassengers: 43,
              occupancy: 100,
              trend: "critical",
              busType: "Micro-ônibus",
            },
            {
              time: "07:12",
              passengers: 41,
              avgPassengers: 39,
              occupancy: 91,
              trend: "stable",
              busType: "Micro-ônibus",
            },
            {
              time: "18:00",
              passengers: 43,
              avgPassengers: 41,
              occupancy: 96,
              trend: "critical",
              busType: "Micro-ônibus",
            },
            {
              time: "19:00",
              passengers: 30,
              avgPassengers: 28,
              occupancy: 67,
              trend: "down",
              busType: "Micro-ônibus",
            },
          ],
          volta: [
            {
              time: "07:00",
              passengers: 35,
              avgPassengers: 33,
              occupancy: 78,
              trend: "stable",
              busType: "Micro-ônibus",
            },
            {
              time: "18:15",
              passengers: 42,
              avgPassengers: 40,
              occupancy: 93,
              trend: "critical",
              busType: "Micro-ônibus",
            },
            {
              time: "19:20",
              passengers: 32,
              avgPassengers: 30,
              occupancy: 71,
              trend: "down",
              busType: "Micro-ônibus",
            },
          ],
        },
        daysOfWeek: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"],
      },
    }),
    []
  );

  const currentBus = busOptions[selectedBus];
  const currentSchedules = currentBus.schedules[direction.toLowerCase()];

  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 90) return "bg-red-500";
    if (occupancy >= 70) return "bg-orange-500";
    if (occupancy >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getOccupancyBg = (occupancy) => {
    if (occupancy >= 90) return "bg-red-50 border-red-200";
    if (occupancy >= 70) return "bg-orange-50 border-orange-200";
    if (occupancy >= 50) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      case "critical":
        return "⚠";
      default:
        return "→";
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-orange-600";
      case "down":
        return "text-green-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const peakHours = useMemo(() => {
    const sorted = [...currentSchedules].sort(
      (a, b) => b.passengers - a.passengers
    );
    return sorted.slice(0, 5);
  }, [currentSchedules]);

  const avgOccupancy = useMemo(() => {
    const total = currentSchedules.reduce((sum, s) => sum + s.occupancy, 0);
    return Math.round(total / currentSchedules.length);
  }, [currentSchedules]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="text-xs text-gray-600 mb-3">
            Gestão de Rotas - Sistema de Análise de Ocupação
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Linha:</span>
              <div className="bg-gray-50 border rounded px-4 py-2 flex items-center gap-3">
                <span className="font-semibold">{currentBus.number}</span>
                <span className="text-gray-600">{currentBus.route}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar rota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm w-full sm:w-auto"
              />
              <button className="bg-black text-white px-4 py-2 rounded w-full sm:w-auto">
                Mudar linha
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 py-3 px-6 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === "schedule"
                  ? "border-white bg-black"
                  : "border-transparent bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Clock size={18} />
              Horário & Ocupação
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 py-3 px-6 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-white bg-black"
                  : "border-transparent bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <BarChart3 size={18} />
              Análise
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`flex-1 py-3 px-6 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === "map"
                  ? "border-white bg-black"
                  : "border-transparent bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <MapPin size={18} />
              Mapa de Calor
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === "schedule" && (
          <div className="space-y-4">
            {/* Statistics Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">
                      Média de Passageiros
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        currentSchedules.reduce(
                          (sum, s) => sum + s.avgPassengers,
                          0
                        ) / currentSchedules.length
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <TrendingUp className="text-red-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Horário de Pico</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {peakHours[0].time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <AlertCircle className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Horários Críticos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentSchedules.filter((s) => s.occupancy >= 90).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Activity className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Ocupação Média</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {avgOccupancy}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              {/* Selector */}
              <div className="p-4 border-b">
                <p className="text-sm text-gray-600 mb-3">
                  Selecione a direção
                </p>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Ida">Ida</option>
                  <option value="Volta">Volta</option>
                </select>
              </div>

              {/* Legend */}
              <div className="p-4 border-b bg-gray-50">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Legenda de Ocupação:
                </p>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Baixa (&lt;50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600">Média (50-69%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-600">Alta (70-89%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Crítica (≥90%)</span>
                  </div>
                </div>
              </div>

              {/* Horários */}
              <div className="p-6">
                <div className="grid grid-cols-6 gap-3">
                  {currentSchedules.map((schedule, idx) => (
                    <div key={idx} className="relative group">
                      <button
                        onClick={() =>
                          setSelectedTime(
                            selectedTime === schedule.time
                              ? null
                              : schedule.time
                          )
                        }
                        className={`w-full border-2 rounded-lg py-3 px-2 transition-all ${getOccupancyBg(
                          schedule.occupancy
                        )} ${
                          selectedTime === schedule.time
                            ? "ring-2 ring-blue-500 scale-105"
                            : "hover:scale-105"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${getOccupancyColor(
                              schedule.occupancy
                            )}`}
                          ></div>
                          <span
                            className={`text-xs font-semibold ${getTrendColor(
                              schedule.trend
                            )}`}
                          >
                            {getTrendIcon(schedule.trend)}
                          </span>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">
                          {schedule.time}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {schedule.occupancy}%
                        </div>
                      </button>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                          <div className="font-semibold mb-1">
                            {schedule.time}
                          </div>
                          <div>
                            Passageiros: {schedule.passengers}/
                            {currentBus.capacity}
                          </div>
                          <div>Média: {schedule.avgPassengers}</div>
                          <div>Ocupação: {schedule.occupancy}%</div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Info Panel */}
                {selectedTime && (
                  <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Clock size={20} className="text-blue-600" />
                        Detalhes - {selectedTime}
                      </h3>
                      <button
                        onClick={() => setSelectedTime(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {currentSchedules
                      .filter((s) => s.time === selectedTime)
                      .map((schedule, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-4">
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">
                              Passageiros Atual
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {schedule.passengers}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              de {currentBus.capacity} lugares
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">
                              Média de Passageiros
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {schedule.avgPassengers}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              últimos 30 dias
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">
                              Taxa de Ocupação
                            </p>
                            <p className="text-2xl font-bold text-orange-600">
                              {schedule.occupancy}%
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className={`h-2 rounded-full ${getOccupancyColor(
                                  schedule.occupancy
                                )}`}
                                style={{ width: `${schedule.occupancy}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-xs text-gray-600 mb-1">
                              Tendência
                            </p>
                            <p
                              className={`text-2xl font-bold ${getTrendColor(
                                schedule.trend
                              )}`}
                            >
                              {getTrendIcon(schedule.trend)}{" "}
                              {schedule.trend === "critical"
                                ? "Crítico"
                                : schedule.trend === "up"
                                ? "Alta"
                                : schedule.trend === "down"
                                ? "Baixa"
                                : "Estável"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              comparado à média
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Análise de Ocupação</h2>
            
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="passengers" fill="#3B82F6" name="Passageiros" />
                  <Bar dataKey="avgPassengers" fill="#10B981" name="Média" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {peakHours.map((schedule, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-400">#{idx + 1}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{schedule.time} - {schedule.busType}</div>
                    <div className="text-sm text-gray-600">{schedule.passengers} passageiros</div>
                  </div>
                  <div className="text-xl font-bold">{schedule.occupancy}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "map" && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mapa de Calor
            </h3>
            <p className="text-gray-600">
              Integração com mapa de calor em desenvolvimento
            </p>
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-blue-900">
                O mapa de calor mostrará visualmente os pontos de maior
                concentração de passageiros ao longo da rota, permitindo
                identificar padrões de uso e otimizar o serviço.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
