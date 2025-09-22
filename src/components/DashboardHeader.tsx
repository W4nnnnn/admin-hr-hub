import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, FileDown, FileUp, UserPlus, FolderOpen, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  onAddEmployee: () => void;
  onExportJson: () => void;
  onImportJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onAddEmployee,
  onExportJson,
  onImportJson,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      onLogout();
    }
  };

  return (
    <header className="gradient-primary text-primary-foreground shadow-hr-large">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-hr grid place-items-center shadow-hr-soft">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                HR Dashboard – Employee Directory
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Kelola data karyawan: biodata, kontak darurat, dokumen (CV, kontrak, surat lamaran), dan lainnya.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              className="bg-red-500/20 text-primary-foreground border-red-300/20 hover:bg-red-500/30 transition-hr"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            
            <Button
              onClick={toggleTheme}
              variant="secondary"
              size="sm"
              className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20 transition-hr"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 mr-2" />
              ) : (
                <Sun className="h-4 w-4 mr-2" />
              )}
              {theme === "light" ? "Mode Gelap" : "Mode Terang"}
            </Button>
            
            <Button
              onClick={onExportJson}
              variant="secondary"
              size="sm"
              className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20 transition-hr"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Ekspor JSON
            </Button>
            
            <label className="cursor-pointer">
              <Button
                asChild
                variant="secondary" 
                size="sm"
                className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20 transition-hr"
              >
                <span>
                  <FileUp className="h-4 w-4 mr-2" />
                  Impor JSON
                </span>
              </Button>
              <Input
                type="file"
                accept="application/json"
                onChange={onImportJson}
                className="hidden"
              />
            </label>
            
            <Button
              onClick={onAddEmployee}
              variant="secondary"
              size="sm"
              className="bg-white text-primary shadow-hr-soft hover:bg-white/90 transition-hr font-semibold"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Tambah Karyawan
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;