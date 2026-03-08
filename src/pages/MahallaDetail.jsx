import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Calendar } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import AssignTaskModal from "@/components/AssignTaskModal";

import { api, downloadMahallaReport } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";
import {
  statusColors,
  priorityColors,
  categoryColors,
  fallbackProblemIcon,
} from "@/lib/constants";

const MahallaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      alert("Iltimos, boshlang'ich va tugash sanalarni tanlang");
      return;
    }
    if (startDate > endDate) {
      alert("Boshlang'ich sana tugash sanadan oldin bo'lishi kerak");
      return;
    }
    setDownloading(true);
    try {
      await downloadMahallaReport(id, startDate, endDate);
    } catch (err) {
      alert("Yuklash xatosi: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const { data: mahalla, loading } = useApiData(
      () => api.getMahallaDetail(id),
      null,
      [id]
  );

  if (loading) {
    return (
        <DashboardLayout>
          <div className="py-20 text-center">Yuklanmoqda...</div>
        </DashboardLayout>
    );
  }

  if (!mahalla) {
    return (
        <DashboardLayout>
          <div className="py-20 text-center">Mahalla topilmadi</div>
        </DashboardLayout>
    );
  }

  const byCategory = {};
  mahalla.problems.forEach((p) => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });

  return (
      <DashboardLayout>
        <div className="animate-fade-in">

          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>

              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {mahalla.name}
                </h1>
                <p className="text-sm text-muted-foreground">{mahalla.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-muted">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-sm text-foreground outline-none w-28"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-sm text-foreground outline-none w-28"
                />
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Yuklanmoqda..." : "Yuklash"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Jami shikoyat",
                value: mahalla.complaints?.length || 0,
              },
              {
                label: "Hal qilingan",
                value: `${mahalla.resolved}%`,
              },
              {
                label: "Aholi soni",
                value: mahalla.population?.toLocaleString(),
              },
              {
                label: "Faol muammolar",
                value: mahalla.active_issues,
              },
            ].map((s) => (
                <div key={s.label} className="gov-card text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {s.label}
                  </p>
                </div>
            ))}
          </div>

          {/* Categories */}
          <div className="gov-card mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Muammolar kategoriyasi
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(byCategory).map(([cat, count]) => (
                  <div
                      key={cat}
                      className={`rounded-xl px-4 py-3 ${
                          categoryColors[cat] || "bg-muted text-foreground"
                      }`}
                  >
                    <p className="text-xl font-bold">{count}</p>
                    <p className="text-xs font-medium">{cat}</p>
                  </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="gov-card mb-6">
            <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Hal qilish darajasi
            </span>

              <span className="text-sm font-semibold text-primary">
              {mahalla.resolved}%
            </span>
            </div>

            <Progress value={mahalla.resolved} className="h-2" />
          </div>

          {/* Problems */}
          <div className="gov-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Barcha muammolar ({mahalla.problems.length})
            </h2>

            <div className="space-y-3">
              {mahalla.problems.map((p) => {
                const Icon = p.icon || fallbackProblemIcon;

                return (
                    <div
                        key={p.id}
                        className="flex items-start gap-4 p-4 rounded-xl border border-border"
                    >
                      <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              categoryColors[p.category] || "bg-muted"
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-sm font-semibold">
                            {p.title}
                          </h3>

                          <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[p.status]}`}
                          >
                        {p.status}
                      </span>

                          <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityColors[p.priority]}`}
                          >
                        {p.priority}
                      </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {p.description}
                        </p>

                        <div className="flex items-center gap-3 mt-2">
                      <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[p.category]}`}
                      >
                        {p.category}
                      </span>

                          <span className="text-[10px] text-muted-foreground">
                        {p.date}
                      </span>

                          {p.status === "Yangi" && (
                              <button
                                  onClick={() => setModalOpen(true)}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                              >
                                Vazifa yuklash
                              </button>
                          )}
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>

        </div>

        <AssignTaskModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
        />
      </DashboardLayout>
  );
};

export default MahallaDetail;