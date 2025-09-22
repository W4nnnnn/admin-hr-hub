import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { toast } from "@/hooks/use-toast";
import LoginPage from "@/components/LoginPage";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import EmployeeList from "@/components/EmployeeList";
import EmployeeDetail from "@/components/EmployeeDetail";
import EmployeeModal from "@/components/EmployeeModal";

interface Employee {
  id: string;
  name: string;
  nik: string;
  division: string;
  position: string;
  status: string;
  email?: string;
  phone?: string;
  photo?: string;
  address?: string;
  dob?: string;
  gender?: string;
  hireDate?: string;
  contractEnd?: string;
  hobbies?: string[];
  socials?: {
    linkedin?: string;
    instagram?: string;
    x?: string;
    facebook?: string;
  };
  emergency?: {
    name?: string;
    relation?: string;
    phone?: string;
  };
  documents?: {
    cv?: string;
    contract?: string;
    letter?: string;
    others?: Array<{ name: string; url: string }>;
  };
}

const STORAGE_KEY = 'hr_employees_v1';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();

  // Load employees from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEmployees(JSON.parse(saved));
      } else {
        // Initialize with demo data
        seedDemoData();
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      seedDemoData();
    }
  }, []);

  // Save employees to localStorage
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    }
  }, [employees]);

  const seedDemoData = () => {
    const today = new Date();
    const addDays = (days: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() + days);
      return date.toISOString().slice(0, 10);
    };

    const demoEmployees: Employee[] = [
      {
        id: crypto.randomUUID(),
        nik: 'EMP-001',
        name: 'Siti Rahma',
        division: 'HR',
        position: 'HR Generalist',
        status: 'Tetap',
        email: 'siti.rahma@contoh.co',
        phone: '0812-3456-7890',
        photo: 'https://i.pravatar.cc/120?img=5',
        address: 'Jl. Melati No. 10, Jakarta',
        dob: '1993-04-12',
        gender: 'Perempuan',
        hireDate: addDays(-120),
        contractEnd: addDays(365 * 2),
        hobbies: ['Membaca', 'Yoga'],
        socials: { 
          linkedin: 'https://linkedin.com/in/sitirahma', 
          instagram: '', 
          x: '', 
          facebook: '' 
        },
        emergency: { 
          name: 'Budi Rahman', 
          relation: 'Suami', 
          phone: '0813-2222-3333' 
        },
        documents: { 
          cv: '#', 
          contract: '#', 
          letter: '#', 
          others: [{ name: 'Sertifikat HRBP', url: '#' }] 
        },
      },
      {
        id: crypto.randomUUID(),
        nik: 'EMP-002',
        name: 'Andi Pratama',
        division: 'Engineering',
        position: 'Backend Engineer',
        status: 'Kontrak',
        email: 'andi.pratama@contoh.co',
        phone: '0821-1111-2222',
        photo: 'https://i.pravatar.cc/120?img=12',
        address: 'Bandung, Jawa Barat',
        dob: '1990-10-05',
        gender: 'Laki-laki',
        hireDate: addDays(-20),
        contractEnd: addDays(55),
        hobbies: ['Futsal', 'Hiking'],
        socials: { 
          linkedin: '', 
          instagram: '', 
          x: 'https://x.com/andip', 
          facebook: '' 
        },
        emergency: { 
          name: 'Rani Pratiwi', 
          relation: 'Istri', 
          phone: '0852-1111-2223' 
        },
        documents: { 
          cv: '#', 
          contract: '#', 
          letter: '#', 
          others: [] 
        },
      },
      {
        id: crypto.randomUUID(),
        nik: 'EMP-003',
        name: 'Maria Chen',
        division: 'Finance',
        position: 'Accounting Lead',
        status: 'Tetap',
        email: 'maria.chen@contoh.co',
        phone: '0819-8888-7777',
        photo: '',
        address: 'Surabaya, Jawa Timur',
        dob: '1988-02-17',
        gender: 'Perempuan',
        hireDate: addDays(-400),
        contractEnd: addDays(800),
        hobbies: ['Memasak'],
        socials: { 
          linkedin: 'https://linkedin.com/in/mariachen', 
          instagram: '', 
          x: '', 
          facebook: '' 
        },
        emergency: { 
          name: 'Dion', 
          relation: 'Suami', 
          phone: '0813-9999-0000' 
        },
        documents: { 
          cv: '#', 
          contract: '#', 
          letter: '#', 
          others: [{ name: 'Sertifikat Brevet', url: '#' }] 
        },
      },
    ];

    setEmployees(demoEmployees);
  };

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = !searchQuery || 
        [employee.name, employee.position, employee.email, employee.nik]
          .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDivision = !divisionFilter || divisionFilter === 'all' || employee.division === divisionFilter;
      const matchesStatus = !statusFilter || statusFilter === 'all' || employee.status === statusFilter;
      
      return matchesSearch && matchesDivision && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'division':
          return a.division.localeCompare(b.division);
        case 'position':
          return a.position.localeCompare(b.position);
        case 'hireDate':
          return new Date(b.hireDate || 0).getTime() - new Date(a.hireDate || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [employees, searchQuery, divisionFilter, statusFilter, sortBy]);

  const selectedEmployee = selectedEmployeeId 
    ? employees.find(emp => emp.id === selectedEmployeeId)
    : undefined;

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleAddEmployee = () => {
    setModalMode('add');
    setEditingEmployee(undefined);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setModalMode('edit');
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (employeeData: Employee) => {
    if (modalMode === 'edit' && editingEmployee) {
      setEmployees(prev => 
        prev.map(emp => emp.id === editingEmployee.id ? { ...employeeData, id: editingEmployee.id } : emp)
      );
      toast({
        title: "Berhasil diperbarui",
        description: "Data karyawan berhasil diperbarui.",
      });
    } else {
      const newEmployee = { ...employeeData, id: crypto.randomUUID() };
      setEmployees(prev => [newEmployee, ...prev]);
      setSelectedEmployeeId(newEmployee.id);
      toast({
        title: "Berhasil ditambahkan",
        description: "Karyawan baru berhasil ditambahkan.",
      });
    }
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    if (selectedEmployeeId === id) {
      setSelectedEmployeeId(undefined);
    }
    toast({
      title: "Berhasil dihapus",
      description: "Data karyawan berhasil dihapus.",
    });
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(employees, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Ekspor berhasil",
      description: "Data karyawan berhasil diekspor ke JSON.",
    });
  };

  const handleImportJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!Array.isArray(data)) {
        throw new Error('Format file tidak valid');
      }

      const importedEmployees = data.map(emp => ({
        ...emp,
        id: emp.id || crypto.randomUUID()
      }));

      setEmployees(importedEmployees);
      setSelectedEmployeeId(undefined);
      
      toast({
        title: "Impor berhasil",
        description: `${importedEmployees.length} data karyawan berhasil diimpor.`,
      });
    } catch (error) {
      toast({
        title: "Impor gagal",
        description: "Format file tidak valid atau terjadi kesalahan.",
        variant: "destructive",
      });
    }

    // Reset file input
    event.target.value = '';
  };

  if (!isLoggedIn) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <DashboardHeader
          onAddEmployee={handleAddEmployee}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
        />

        <main className="mx-auto max-w-7xl px-4 py-6">
          <StatsCards employees={employees} />

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EmployeeList
              employees={employees}
              filteredEmployees={filteredEmployees}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              divisionFilter={divisionFilter}
              onDivisionFilterChange={setDivisionFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedEmployeeId={selectedEmployeeId}
              onEmployeeSelect={setSelectedEmployeeId}
            />

            <EmployeeDetail
              employee={selectedEmployee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          </section>
        </main>

        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEmployee}
          employee={editingEmployee}
          mode={modalMode}
        />
      </div>
    </ThemeProvider>
  );
};

export default Index;
