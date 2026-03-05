import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizations, allProblems } from "@/data/mahallas";
import BackButton from "@/components/BackButton";
import { Building2, Phone, MapPin, X } from "lucide-react";

const orgContacts = {
  "Kommunal xizmati": {
    address: "Chirchiq sh., Amir Temur ko'chasi, 12-uy",
    phone: "+998 70 123-45-67",
  },
  "Yo'l Tashkiloti": {
    address: "Chirchiq sh., Istiqlol ko'chasi, 5-uy",
    phone: "+998 70 234-56-78",
  },
  "Ekologiya bo'limi": {
    address: "Chirchiq sh., Gulzor ko'chasi, 8-uy",
    phone: "+998 70 345-67-89",
  },
  "Axloq Vakili": {
    address: "Chirchiq sh., Bobur ko'chasi, 3-uy",
    phone: "+998 70 456-78-90",
  },
  "Maktab": {
    address: "Chirchiq sh., Tinchlik ko'chasi, 15-uy",
    phone: "+998 70 567-89-01",
  },
  "Bolalar bog'chasi": {
    address: "Chirchiq sh., Madaniyat ko'chasi, 22-uy",
    phone: "+998 70 678-90-12",
  },
  "Tibbiyot markazi": {
    address: "Chirchiq sh., Kamolot ko'chasi, 1-uy",
    phone: "+998 70 789-01-23",
  },
};

const orgStats = organizations.map((org) => {
  const categoryMap = {
    "Kommunal xizmati": "Kommunal",
    "Yo'l Tashkiloti": "Yo'l",
    "Ekologiya bo'limi": "Ekologiya",
    "Axloq Vakili": "Axloq",
    "Maktab": "Ijtimoiy",
    "Bolalar bog'chasi": "Ijtimoiy",
    "Tibbiyot markazi": "Kommunal",
  };

  const cat = categoryMap[org] || "Kommunal";

  const related = allProblems.filter((p) => p.category === cat);
  const total = related.length;
  const done = related.filter((p) => p.status === "Bajarildi").length;
  const inProgress = related.filter((p) => p.status === "Jarayonda").length;

  return {
    name: org,
    total,
    done,
    inProgress,
    new: total - done - inProgress,
  };
});

const Tashkilotlar = () => {
  const [contactOrg, setContactOrg] = useState(null);
  const contact = contactOrg ? orgContacts[contactOrg] : null;

  return (
      <DashboardLayout>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <BackButton />
            <h1 className="text-2xl font-bold text-foreground">Tashkilotlar</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgStats.map((org) => (
                <div key={org.name} className="gov-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>

                    <h3 className="text-sm font-semibold text-foreground">
                      {org.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {org.total}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Jami</p>
                    </div>

                    <div>
                      <p className="text-lg font-bold text-warning">
                        {org.inProgress}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Jarayonda
                      </p>
                    </div>

                    <div>
                      <p className="text-lg font-bold text-success">
                        {org.done}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Bajarildi
                      </p>
                    </div>
                  </div>

                  {org.total > 0 && (
                      <div className="mt-3">
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden flex">
                          <div
                              className="h-full bg-success"
                              style={{ width: `${(org.done / org.total) * 100}%` }}
                          />
                          <div
                              className="h-full bg-warning"
                              style={{
                                width: `${(org.inProgress / org.total) * 100}%`,
                              }}
                          />
                          <div
                              className="h-full bg-muted-foreground/30"
                              style={{ width: `${(org.new / org.total) * 100}%` }}
                          />
                        </div>
                      </div>
                  )}

                  <button
                      onClick={() => setContactOrg(org.name)}
                      className="mt-4 w-full h-9 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Bog'lanish
                  </button>
                </div>
            ))}
          </div>
        </div>

        {/* Contact Modal */}
        {contactOrg && contact && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div
                  className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
                  onClick={() => setContactOrg(null)}
              />

              <div className="relative bg-card rounded-2xl w-full max-w-sm p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {contactOrg}
                  </h3>

                  <button
                      onClick={() => setContactOrg(null)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-muted">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Manzil
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-muted">
                    <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Telefon raqami
                      </p>

                      <a
                          href={`tel:${contact.phone.replace(/[\s-]/g, "")}`}
                          className="text-sm font-medium text-primary hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <button
                    onClick={() => setContactOrg(null)}
                    className="mt-5 w-full h-10 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted"
                >
                  Yopish
                </button>
              </div>
            </div>
        )}
      </DashboardLayout>
  );
};

export default Tashkilotlar;