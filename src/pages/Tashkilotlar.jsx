import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import { Building2, Phone, X, MapPin, ArrowRight, CheckCircle2, Clock, CircleDashed } from "lucide-react";
import { motion } from "framer-motion";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const Tashkilotlar = () => {
  const [contactOrg, setContactOrg] = useState(null);

  const { data: orgStats } = useApiData(api.getOrganizations, []);

  const getStatusIcon = (status) => {
    if (status === "done") return { icon: CheckCircle2, color: "text-success", bg: "bg-success/15" };
    if (status === "progress") return { icon: Clock, color: "text-warning", bg: "bg-warning/15" };
    return { icon: CircleDashed, color: "text-muted-foreground", bg: "bg-muted" };
  };

  return (
      <DashboardLayout>
        <div className="animate-fade-in">

          <div className="flex items-center gap-3 mb-8">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Tashkilotlar
              </h1>
              <p className="text-sm text-muted-foreground">
                {orgStats.length} ta tashkilot ro'yxati
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {orgStats.map((org, index) => (
                <motion.div
                    key={org.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative overflow-hidden rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-5">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-foreground">
                            {org.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {org.address || "Manzil ko'rsatilmagan"}
                          </div>
                        </div>
                      </div>

                      <button
                          onClick={() => setContactOrg(org)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        Aloqa
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { key: "done", label: "Bajarildi", value: org.done },
                        { key: "progress", label: "Jarayonda", value: org.in_progress },
                        { key: "new", label: "Yangi", value: org.total - org.done - org.in_progress },
                      ].map((stat) => {
                        const { icon: Icon, color, bg } = getStatusIcon(stat.key);
                        return (
                            <div key={stat.key} className={`${bg} rounded-xl p-3 text-center`}>
                              <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                              <p className="text-lg font-bold text-foreground">{stat.value}</p>
                              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                            </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-medium text-muted-foreground">
                          Jami: {org.total} ta vazifa
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>

          {orgStats.length === 0 && (
              <div className="text-center py-20">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tashkilotlar topilmadi</p>
              </div>
          )}

          {contactOrg && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setContactOrg(null)}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative bg-card p-6 rounded-2xl w-full max-w-sm shadow-2xl"
                >
                  <button
                      onClick={() => setContactOrg(null)}
                      className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/20">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {contactOrg.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">Aloqa ma'lumotlari</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Telefon</p>
                        <p className="font-medium text-foreground">{contactOrg.phone || "Ko'rsatilmagan"}</p>
                      </div>
                    </div>

                    {contactOrg.address && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Manzil</p>
                            <p className="font-medium text-foreground">{contactOrg.address}</p>
                          </div>
                        </div>
                    )}
                  </div>

                </motion.div>
              </div>
          )}

        </div>
      </DashboardLayout>
  );
};

export default Tashkilotlar;
