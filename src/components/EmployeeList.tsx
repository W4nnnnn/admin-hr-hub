import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  division: string;
  position: string;
  status: string;
  email?: string;
  nik?: string;
  photo?: string;
  contractEnd?: string;
  [key: string]: any;
}

interface EmployeeListProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  divisionFilter: string;
  onDivisionFilterChange: (division: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedEmployeeId?: string;
  onEmployeeSelect: (id: string) => void;
  filteredEmployees: Employee[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  searchQuery,
  onSearchChange,
  divisionFilter,
  onDivisionFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  selectedEmployeeId,
  onEmployeeSelect,
  filteredEmployees,
}) => {
  const divisions = Array.from(
    new Set(employees.map(e => e.division).filter(Boolean))
  ).sort();

  const getInitials = (name: string) => {
    return name.split(/[\s-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(s => s[0])
      .join('')
      .toUpperCase();
  };

  const isContractEndingSoon = (contractEnd?: string) => {
    if (!contractEnd) return false;
    const now = new Date();
    const end = new Date(contractEnd);
    const daysUntil = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 60 && daysUntil >= 0;
  };

  return (
    <div className="md:col-span-1">
      <Card className="gradient-card border-border/50 shadow-hr-soft">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, posisi, email..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 transition-hr focus:shadow-hr-soft"
              />
            </div>
            
            <div className="flex flex-col gap-2 md:flex-row md:gap-3">
              <Select value={divisionFilter} onValueChange={onDivisionFilterChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Semua Divisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Divisi</SelectItem>
                  {divisions.map(division => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Status</SelectItem>
                  <SelectItem value="Tetap">Tetap</SelectItem>
                  <SelectItem value="Kontrak">Kontrak</SelectItem>
                  <SelectItem value="Magang">Magang</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Klik item untuk melihat detail
              </p>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Urut: Nama</SelectItem>
                  <SelectItem value="division">Urut: Divisi</SelectItem>
                  <SelectItem value="position">Urut: Posisi</SelectItem>
                  <SelectItem value="hireDate">Urut: Tgl Masuk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="max-h-[65vh] overflow-auto scrollbar-hr">
            {filteredEmployees.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Tidak ada data ditemukan
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEmployees.map(employee => {
                  const isSelected = selectedEmployeeId === employee.id;
                  const contractSoon = isContractEndingSoon(employee.contractEnd);
                  
                  return (
                    <div
                      key={employee.id}
                      onClick={() => onEmployeeSelect(employee.id)}
                      className={`group cursor-pointer rounded-xl p-3 transition-hr hover:bg-accent/50 ${
                        isSelected ? 'bg-accent border border-primary/20 shadow-hr-soft' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-muted overflow-hidden grid place-items-center text-sm font-semibold text-muted-foreground">
                          {employee.photo ? (
                            <img
                              src={employee.photo}
                              alt={employee.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                if (target.parentElement) {
                                  target.parentElement.textContent = getInitials(employee.name);
                                }
                              }}
                            />
                          ) : (
                            getInitials(employee.name)
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium text-foreground">
                              {employee.name}
                            </p>
                            {contractSoon && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                                <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                                Kontrak segera
                              </Badge>
                            )}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {employee.position} • {employee.division}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeList;