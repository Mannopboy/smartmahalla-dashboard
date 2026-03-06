import { useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import BackButton from "@/components/BackButton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { api } from "@/lib/api";
import { useApiData } from "@/hooks/useApiData";

const Vazifalar = () => {
  const [search, setSearch] = useState("");

  const { data: tasks } = useApiData(api.getTasks, []);

  const filtered = tasks.filter((t) =>
      [t.name, t.mahalla, t.org]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
  );

  return (
      <DashboardLayout>
        <div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <BackButton />
            <h1 className="text-2xl font-bold">Vazifalar</h1>
          </div>

          {/* Search */}
          <div className="gov-card mb-4">
            <input
                className="w-full h-10 px-3 rounded-xl bg-muted"
                placeholder="Qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="gov-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Mahalla</TableHead>
                  <TableHead>Tashkilot</TableHead>
                  <TableHead>Muddat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioritet</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.name}</TableCell>

                      <TableCell className="text-muted-foreground">
                        {t.mahalla}
                      </TableCell>

                      <TableCell>{t.org}</TableCell>

                      <TableCell>{t.deadline}</TableCell>

                      <TableCell>{t.status}</TableCell>

                      <TableCell>{t.priority}</TableCell>
                    </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>

        </div>
      </DashboardLayout>
  );
};

export default Vazifalar;