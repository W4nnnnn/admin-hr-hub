import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Employee {
  id?: string;
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
  hobbies?: string[] | string;
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
    others?: Array<{ name: string; url: string }> | string;
  };
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employee?: Employee;
  mode: 'add' | 'edit';
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employee,
  mode,
}) => {
  const [formData, setFormData] = useState<Employee>({
    name: '',
    nik: '',
    division: '',
    position: '',
    status: 'Tetap',
    gender: 'Laki-laki',
    hobbies: [],
    socials: {},
    emergency: {},
    documents: { others: [] },
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        ...employee,
        hobbies: employee.hobbies || [],
        socials: employee.socials || {},
        emergency: employee.emergency || {},
        documents: { others: [], ...employee.documents },
      });
    } else if (mode === 'add') {
      setFormData({
        name: '',
        nik: '',
        division: '',
        position: '',
        status: 'Tetap',
        gender: 'Laki-laki',
        hobbies: [],
        socials: {},
        emergency: {},
        documents: { others: [] },
      });
    }
  }, [employee, mode, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...(prev[parent as keyof Employee] as any), [field]: value }
    }));
  };

  const handlePhotoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setPhotoFile(file);
    
    // Convert to data URL
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, photo: reader.result as string }));
      toast({
        title: "Foto dimuat",
        description: "Foto berhasil dimuat (disimpan sebagai Data URL).",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse hobbies - handle both string and array cases
    const hobbiesValue = formData.hobbies;
    const parsedHobbies = Array.isArray(hobbiesValue) 
      ? hobbiesValue 
      : typeof hobbiesValue === 'string' 
        ? hobbiesValue.split(',').map(h => h.trim()).filter(Boolean)
        : [];
    
    // Parse others documents - handle both string and array cases
    const othersValue = formData.documents?.others;
    const parsedOthers = Array.isArray(othersValue) 
      ? othersValue 
      : typeof othersValue === 'string' 
        ? othersValue.split(';')
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => {
              const [name, url] = s.split('|').map(x => x?.trim() || '');
              return { name, url };
            })
        : [];

    const processedData: Employee = {
      ...formData,
      id: employee?.id,
      hobbies: parsedHobbies,
      documents: {
        cv: formData.documents?.cv?.trim() || '',
        contract: formData.documents?.contract?.trim() || '',
        letter: formData.documents?.letter?.trim() || '',
        others: parsedOthers,
      }
    };

    onSave(processedData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Data Karyawan' : 'Tambah Karyawan'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-auto scrollbar-hr space-y-6 p-1">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="text-sm font-medium">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="cth. Siti Rahma"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="nik" className="text-sm font-medium">NIK / ID *</Label>
              <Input
                id="nik"
                value={formData.nik}
                onChange={(e) => handleInputChange('nik', e.target.value)}
                placeholder="cth. EMP-001"
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="division" className="text-sm font-medium">Divisi *</Label>
              <Input
                id="division"
                value={formData.division}
                onChange={(e) => handleInputChange('division', e.target.value)}
                placeholder="cth. HR"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="position" className="text-sm font-medium">Posisi *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="cth. HR Generalist"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tetap">Tetap</SelectItem>
                  <SelectItem value="Kontrak">Kontrak</SelectItem>
                  <SelectItem value="Magang">Magang</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hireDate" className="text-sm font-medium">Tanggal Masuk</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate?.slice(0, 10) || ''}
                onChange={(e) => handleInputChange('hireDate', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contractEnd" className="text-sm font-medium">Kontrak Berakhir</Label>
              <Input
                id="contractEnd"
                type="date"
                value={formData.contractEnd?.slice(0, 10) || ''}
                onChange={(e) => handleInputChange('contractEnd', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dob" className="text-sm font-medium">Tanggal Lahir</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob?.slice(0, 10) || ''}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="gender" className="text-sm font-medium">Jenis Kelamin</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="nama@perusahaan.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Telepon</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 5 */}
          <div>
            <Label htmlFor="address" className="text-sm font-medium">Alamat</Label>
            <Textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Alamat domisili"
              rows={2}
              className="mt-1"
            />
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Foto (URL)</Label>
              <Input
                value={formData.photo || ''}
                onChange={(e) => handleInputChange('photo', e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">Atau unggah file:</div>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoFileChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="hobbies" className="text-sm font-medium">Hobi (pisahkan dengan koma)</Label>
              <Input
                id="hobbies"
                value={Array.isArray(formData.hobbies) ? formData.hobbies.join(', ') : (formData.hobbies || '')}
                onChange={(e) => handleInputChange('hobbies', e.target.value)}
                placeholder="Membaca, Futsal"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="linkedin" className="text-sm font-medium">Akun LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.socials?.linkedin || ''}
                onChange={(e) => handleNestedChange('socials', 'linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="mt-1"
              />
            </div>
          </div>

          {/* Social Media Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
              <Input
                id="instagram"
                value={formData.socials?.instagram || ''}
                onChange={(e) => handleNestedChange('socials', 'instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="x" className="text-sm font-medium">X / Twitter</Label>
              <Input
                id="x"
                value={formData.socials?.x || ''}
                onChange={(e) => handleNestedChange('socials', 'x', e.target.value)}
                placeholder="https://x.com/..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="facebook" className="text-sm font-medium">Facebook</Label>
              <Input
                id="facebook"
                value={formData.socials?.facebook || ''}
                onChange={(e) => handleNestedChange('socials', 'facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="mt-1"
              />
            </div>
          </div>

          {/* Emergency Contact Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="em_name" className="text-sm font-medium">Kontak Darurat - Nama</Label>
              <Input
                id="em_name"
                value={formData.emergency?.name || ''}
                onChange={(e) => handleNestedChange('emergency', 'name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="em_relation" className="text-sm font-medium">Hubungan</Label>
              <Input
                id="em_relation"
                value={formData.emergency?.relation || ''}
                onChange={(e) => handleNestedChange('emergency', 'relation', e.target.value)}
                placeholder="Istri/Suami/Ortu/Teman"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="em_phone" className="text-sm font-medium">Telepon Darurat</Label>
              <Input
                id="em_phone"
                value={formData.emergency?.phone || ''}
                onChange={(e) => handleNestedChange('emergency', 'phone', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Documents Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cv" className="text-sm font-medium">Link CV</Label>
              <Input
                id="cv"
                value={formData.documents?.cv || ''}
                onChange={(e) => handleNestedChange('documents', 'cv', e.target.value)}
                placeholder="https://drive.google.com/..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contract" className="text-sm font-medium">Link Kontrak</Label>
              <Input
                id="contract"
                value={formData.documents?.contract || ''}
                onChange={(e) => handleNestedChange('documents', 'contract', e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="letter" className="text-sm font-medium">Link Surat Lamaran</Label>
              <Input
                id="letter"
                value={formData.documents?.letter || ''}
                onChange={(e) => handleNestedChange('documents', 'letter', e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          </div>

          {/* Other Documents */}
          <div>
            <Label htmlFor="others" className="text-sm font-medium">
              Dokumen Lain (nama|url; pisahkan dengan titik koma)
            </Label>
            <Input
              id="others"
              value={Array.isArray(formData.documents?.others) 
                ? formData.documents.others.map(o => `${o.name}|${o.url}`).join('; ')
                : (formData.documents?.others || '')}
              onChange={(e) => handleNestedChange('documents', 'others', e.target.value)}
              placeholder="Sertifikat HIPMI|https://...; Pakta Integritas|https://..."
              className="mt-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal;
