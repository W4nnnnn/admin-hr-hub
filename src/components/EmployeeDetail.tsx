import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FileText, User, Phone, Heart, Paperclip } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  nik?: string;
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

interface EmployeeDetailProps {
  employee?: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employee,
  onEdit,
  onDelete,
}) => {
  if (!employee) {
    return (
      <div className="md:col-span-2">
        <Card className="border-2 border-dashed border-border rounded-2xl">
          <CardContent className="p-10 text-center text-muted-foreground">
            <div className="text-5xl mb-4">📄</div>
            <p className="font-medium text-lg mb-2">Pilih karyawan untuk melihat detail</p>
            <p className="text-sm">
              Atau klik <span className="font-semibold">Tambah Karyawan</span> untuk membuat data baru.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(/[\s-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(s => s[0])
      .join('')
      .toUpperCase();
  };

  const handleDelete = () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data ${employee.name}?`)) {
      onDelete(employee.id);
    }
  };

  return (
    <div className="md:col-span-2">
      <Card className="gradient-card border-border/50 shadow-hr-glow">
        {/* Banner */}
        <div className="h-28 rounded-t-2xl gradient-primary"></div>
        
        <div className="-mt-10 px-6 pb-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="flex items-end gap-4">
              <div className="h-24 w-24 rounded-2xl bg-background ring-4 ring-background overflow-hidden grid place-items-center text-2xl font-bold text-muted-foreground shadow-hr-medium">
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
              
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {employee.name}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {employee.position} • {employee.division}
                  {employee.hireDate && ` • Masuk ${formatDate(employee.hireDate)}`}
                </div>
              </div>
            </div>
            
            <div className="md:ml-auto flex flex-wrap gap-2">
              <Button
                onClick={() => onEdit(employee)}
                size="sm"
                className="gradient-primary text-primary-foreground hover:opacity-90 transition-hr shadow-hr-soft"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                className="shadow-hr-soft hover:shadow-hr-medium transition-hr"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Data Pribadi */}
            <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-hr-soft">
              <div className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <User className="h-4 w-4 text-primary" />
                Data Pribadi
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">NIK / ID</dt>
                  <dd className="font-medium text-foreground">{employee.nik || '-'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Tanggal Lahir</dt>
                  <dd className="font-medium text-foreground">{formatDate(employee.dob)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Jenis Kelamin</dt>
                  <dd className="font-medium text-foreground">{employee.gender || '-'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    {employee.status ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {employee.status}
                      </Badge>
                    ) : '-'}
                  </dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-muted-foreground">Alamat</dt>
                  <dd className="font-medium text-foreground">{employee.address || '-'}</dd>
                </div>
              </dl>
            </section>

            {/* Kontak */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-hr-soft">
              <div className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <Phone className="h-4 w-4 text-primary" />
                Kontak
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">
                    {employee.email ? (
                      <a
                        href={`mailto:${employee.email}`}
                        className="text-primary hover:underline transition-hr break-all"
                      >
                        {employee.email}
                      </a>
                    ) : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Telepon</dt>
                  <dd className="font-medium text-foreground">{employee.phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Kontak Darurat</dt>
                  <dd className="font-medium text-foreground">
                    {(employee.emergency?.name || employee.emergency?.relation || employee.emergency?.phone) ? 
                      `${employee.emergency.name || '-'} (${employee.emergency.relation || '-'}) • ${employee.emergency.phone || '-'}` : 
                      '-'
                    }
                  </dd>
                </div>
              </dl>
            </section>

            {/* Hobi & Sosial */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-hr-soft">
              <div className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <Heart className="h-4 w-4 text-primary" />
                Hobi & Sosial
              </div>
              <div className="space-y-3">
                <div>
                  <dt className="text-sm text-muted-foreground mb-2">Hobi</dt>
                  <div className="flex flex-wrap gap-2">
                    {employee.hobbies && employee.hobbies.length > 0 ? (
                      employee.hobbies.map((hobby, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {hobby}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <dt className="text-sm text-muted-foreground mb-2">Media Sosial</dt>
                  <div className="space-y-1 text-sm">
                    {[
                      ['LinkedIn', employee.socials?.linkedin],
                      ['Instagram', employee.socials?.instagram],
                      ['X / Twitter', employee.socials?.x],
                      ['Facebook', employee.socials?.facebook],
                    ].filter(([, url]) => !!url).length > 0 ? (
                      [
                        ['LinkedIn', employee.socials?.linkedin],
                        ['Instagram', employee.socials?.instagram], 
                        ['X / Twitter', employee.socials?.x],
                        ['Facebook', employee.socials?.facebook],
                      ].filter(([, url]) => !!url).map(([label, url]) => (
                        <a
                          key={label}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-primary hover:underline transition-hr"
                        >
                          {label}
                        </a>
                      ))
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Dokumen */}
            <section className="lg:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-hr-soft">
              <div className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <Paperclip className="h-4 w-4 text-primary" />
                Dokumen
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {[
                  { label: '📄 CV', url: employee.documents?.cv },
                  { label: '📝 Kontrak Kerja', url: employee.documents?.contract },
                  { label: '✉️ Surat Lamaran', url: employee.documents?.letter },
                ].map(({ label, url }, index) => (
                  <a
                    key={index}
                    href={url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-hr ${
                      url 
                        ? 'text-primary border-primary/20 hover:bg-primary/5 cursor-pointer' 
                        : 'text-muted-foreground border-border cursor-not-allowed'
                    }`}
                    onClick={!url ? (e) => e.preventDefault() : undefined}
                  >
                    <span>{label}</span>
                    {url && <FileText className="h-4 w-4" />}
                  </a>
                ))}
              </div>
              
              {employee.documents?.others && employee.documents.others.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {employee.documents.others.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-full border px-3 py-1 text-sm transition-hr ${
                        doc.url
                          ? 'text-primary border-primary/20 hover:bg-primary/5'
                          : 'text-muted-foreground border-border cursor-not-allowed'
                      }`}
                    >
                      {doc.name || 'Dokumen'}
                    </a>
                  ))}
                </div>
              )}
              
              <p className="mt-3 text-xs text-muted-foreground">
                Format link: bisa Google Drive/OneDrive/internal. Pastikan aksesnya dibuka untuk HR.
              </p>
            </section>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDetail;