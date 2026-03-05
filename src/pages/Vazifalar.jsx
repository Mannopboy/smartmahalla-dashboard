import { useState } from "react";
import { Filter } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, } from "@/components/ui/table";
const tasks = [
  { id: 1, name: "Suv quvurini tuzatish", mahalla: "M.Ulug'bek", org: "Kommunal", deadline: "2026-03-10", status: "Jarayonda", priority: "Yuqori" },
  { id: 2, name: "Yo'l ta'mirlash", mahalla: "Gulzor", org: "Yo'l Tashkiloti", deadline: "2026-03-15", status: "Yangi", priority: "Yuqori" },
  { id: 3, name: "Maktab binosi ta'miri", mahalla: "Bobur", org: "Maktab", deadline: "2026-03-20", status: "Yangi", priority: "O'rta" },
  { id: 4, name: "Chiqindi tozalash", mahalla: "Kimyogar", org: "Kommunal", deadline: "2026-03-08", status: "Bajarildi", priority: "O'rta" },
  { id: 5, name: "Elektr tarmog'ini tiklash", mahalla: "Chinor", org: "Kommunal", deadline: "2026-03-12", status: "Jarayonda", priority: "Yuqori" },
  { id: 6, name: "Ko'cha chiroqlari o'rnatish", mahalla: "Tinchlik", org: "Kommunal", deadline: "2026-03-18", status: "Bajarildi", priority: "Past" },
  { id: 7, name: "Axloq tarbiya yig'ilishi", mahalla: "Nurobod", org: "Axloq Vakili", deadline: "2026-03-25", status: "Yangi", priority: "Past" },
];
const orgs = ["Barcha", "Kommunal", "Yo'l Tashkiloti", "Maktab", "Axloq Vakili"];
const statuses = ["Barcha", "Yangi", "Jarayonda", "Bajarildi"];
const statusColors = {
  "Yangi": "bg-muted text-muted-foreground",
  "Jarayonda": "bg-warning/15 text-warning",
  "Bajarildi": "bg-success/15 text-success",
};
const priorityColors = {
  "Yuqori": "bg-destructive/15 text-destructive",
  "O'rta": "bg-warning/15 text-warning",
  "Past": "bg-muted text-muted-foreground",
};
const Vazifalar = () => {
  const [orgFilter, setOrgFilter] = useState("Barcha");
  const [statusFilter, setStatusFilter] = useState("Barcha");
  const filtered = tasks.filter((t) => {
    const matchOrg = orgFilter === "Barcha" || t.org === orgFilter;
    const matchStatus = statusFilter === "Barcha" || t.status === statusFilter;
    return matchOrg && matchStatus;
  });
  return (<DashboardLayout>
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-foreground">Vazifalar</h1>
      </div>

      {/* Filters */}
      <div className="gov-card mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0 mt-2 sm:mt-0"/>
          <select value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none">
            {orgs.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none">
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="gov-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vazifa nomi</TableHead>
              <TableHead>Mahalla</TableHead>
              <TableHead>Tashkilot</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (<TableRow key={t.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell className="text-muted-foreground">{t.mahalla}</TableCell>
              <TableCell className="text-muted-foreground">{t.org}</TableCell>
              <TableCell className="text-muted-foreground">{t.deadline}</TableCell>
              <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>
                      {t.status}
                    </span>
              </TableCell>
              <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[t.priority]}`}>
                      {t.priority}
                    </span>
              </TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      </div>
    </div>
  </DashboardLayout>);
};
export default Vazifalar;
