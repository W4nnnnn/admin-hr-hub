import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, AlertTriangle, UserCheck } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  division: string;
  position: string;
  status: string;
  hireDate?: string;
  contractEnd?: string;
  [key: string]: any;
}

interface StatsCardsProps {
  employees: Employee[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ employees }) => {
  const totalEmployees = employees.length;
  
  const activeDivisions = new Set(
    employees.map(e => e.division).filter(Boolean)
  ).size;
  
  const contractEndingSoon = employees.filter(e => {
    if (!e.contractEnd) return false;
    const now = new Date();
    const end = new Date(e.contractEnd);
    const daysUntil = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 60 && daysUntil >= 0;
  }).length;
  
  const newHires = employees.filter(e => {
    if (!e.hireDate) return false;
    const now = new Date();
    const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const hireDate = new Date(e.hireDate);
    return hireDate >= past30;
  }).length;

  const stats = [
    {
      title: "Total Karyawan",
      value: totalEmployees,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Divisi Aktif", 
      value: activeDivisions,
      icon: Building2,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Kontrak Habis ≤ 60 Hari",
      value: contractEndingSoon,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Karyawan Baru (30 Hari)",
      value: newHires,
      icon: UserCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="gradient-card border-border/50 shadow-hr-soft hover:shadow-hr-medium transition-hr">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
};

export default StatsCards;