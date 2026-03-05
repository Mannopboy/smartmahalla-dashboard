import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { mahallasData } from "@/data/mahallas";
const getStatus = (complaints) => {
  if (complaints >= 60)
    return "Muammoli";
  if (complaints >= 30)
    return "O'rta";
  return "Yaxshi";
};
const statusColors = {
  Yaxshi: "bg-success/15 text-success",
  "O'rta": "bg-warning/15 text-warning",
  Muammoli: "bg-destructive/15 text-destructive",
};
const ITEMS_PER_PAGE = 10;
const Mahallalar = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const filtered = mahallasData.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  return (<DashboardLayout>
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold text-foreground">Mahallalar</h1>
      </div>

      <div className="gov-card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <input type="text" placeholder="Mahalla qidirish..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"/>
        </div>
      </div>

      <div className="gov-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mahalla nomi</TableHead>
              <TableHead className="text-center">Shikoyatlar</TableHead>
              <TableHead className="text-center">Hal qilingan %</TableHead>
              <TableHead className="text-center">Aholi</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((m) => {
              const status = getStatus(m.complaints);
              return (<TableRow key={m.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/mahallalar/${m.id}`)}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="text-center">{m.complaints}</TableCell>
                <TableCell className="text-center">{m.resolved}%</TableCell>
                <TableCell className="text-center">{m.population.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>{status}</span>
                </TableCell>
              </TableRow>);
            })}
          </TableBody>
        </Table>

        {totalPages > 1 && (<div className="flex items-center justify-center gap-2 p-4 border-t border-border">
          {Array.from({ length: totalPages }, (_, i) => (<button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            {i + 1}
          </button>))}
        </div>)}
      </div>
    </div>
  </DashboardLayout>);
};
export default Mahallalar;
