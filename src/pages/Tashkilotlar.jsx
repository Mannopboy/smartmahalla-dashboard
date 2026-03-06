import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import { Building2, Phone, X } from "lucide-react";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const Tashkilotlar = () => {
  const [contactOrg, setContactOrg] = useState(null);

  const { data: orgStats } = useApiData(api.getOrganizations, []);

  return (
      <DashboardLayout>
        <div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <BackButton />
            <h1 className="text-2xl font-bold text-foreground">
              Tashkilotlar
            </h1>
          </div>

          {/* Organizations grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orgStats.map((org) => (
                <div key={org.id} className="gov-card">

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          {org.name}
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          Jami: {org.total}
                        </p>
                      </div>

                    </div>

                    <button
                        onClick={() => setContactOrg(org)}
                        className="text-xs text-primary"
                    >
                      Aloqa
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">

                    <div className="bg-muted rounded-lg py-2">
                      <p className="font-bold">{org.done}</p>
                      <p className="text-muted-foreground">
                        Bajarildi
                      </p>
                    </div>

                    <div className="bg-muted rounded-lg py-2">
                      <p className="font-bold">{org.in_progress}</p>
                      <p className="text-muted-foreground">
                        Jarayonda
                      </p>
                    </div>

                    <div className="bg-muted rounded-lg py-2">
                      <p className="font-bold">
                        {org.total - org.done - org.in_progress}
                      </p>
                      <p className="text-muted-foreground">
                        Yangi
                      </p>
                    </div>

                  </div>
                </div>
            ))}
          </div>

          {/* Contact modal */}
          {contactOrg && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setContactOrg(null)}
                />

                <div className="relative bg-card p-6 rounded-2xl w-full max-w-md">

                  <button
                      onClick={() => setContactOrg(null)}
                      className="absolute right-3 top-3"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <h3 className="text-lg font-semibold mb-4">
                    {contactOrg.name}
                  </h3>

                  <div className="space-y-2 text-sm">

                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {contactOrg.phone}
                    </p>

                  </div>

                </div>
              </div>
          )}

        </div>
      </DashboardLayout>
  );
};

export default Tashkilotlar;