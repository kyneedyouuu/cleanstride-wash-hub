
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ShirtIcon, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ServiceManagement = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Basic Clean",
      description: "Pembersihan dasar dengan sabun khusus sepatu",
      price: 25000,
      duration: "2-3 hari",
      isActive: true
    },
    {
      id: 2,
      name: "Premium Clean",
      description: "Pembersihan menyeluruh dengan treatment khusus",
      price: 45000,
      duration: "1-2 hari",
      isActive: true
    },
    {
      id: 3,
      name: "Deep Clean",
      description: "Pembersihan mendalam untuk sepatu sangat kotor",
      price: 65000,
      duration: "3-4 hari",
      isActive: true
    },
    {
      id: 4,
      name: "Express Clean",
      description: "Layanan cepat untuk kebutuhan mendesak",
      price: 55000,
      duration: "1 hari",
      isActive: true
    }
  ]);

  const [editingService, setEditingService] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: ""
    });
    setEditingService(null);
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...formData, price: parseInt(formData.price) }
          : service
      ));
      toast({
        title: "Layanan Diperbarui",
        description: `${formData.name} berhasil diperbarui.`,
      });
    } else {
      // Add new service
      const newService = {
        id: Date.now(),
        ...formData,
        price: parseInt(formData.price),
        isActive: true
      };
      setServices([...services, newService]);
      toast({
        title: "Layanan Ditambahkan",
        description: `${formData.name} berhasil ditambahkan.`,
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(service => service.id !== id));
    toast({
      title: "Layanan Dihapus",
      description: "Layanan berhasil dihapus dari sistem.",
      variant: "destructive"
    });
  };

  const toggleActive = (id: number) => {
    setServices(services.map(service => 
      service.id === id 
        ? { ...service, isActive: !service.isActive }
        : service
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manajemen Layanan</h2>
          <p className="text-gray-600">Kelola layanan dan harga laundry sepatu</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Layanan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Layanan" : "Tambah Layanan Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingService 
                  ? "Perbarui informasi layanan yang sudah ada"
                  : "Buat layanan baru untuk ditawarkan kepada customer"
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Layanan</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Premium Clean"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan detail layanan ini..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="45000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Estimasi Waktu</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="1-2 hari"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSubmit}>
                {editingService ? "Perbarui" : "Tambah"} Layanan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Layanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Layanan Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Harga Terendah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {Math.min(...services.map(s => s.price)).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Harga Tertinggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {Math.max(...services.map(s => s.price)).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className={`bg-white/70 backdrop-blur-sm ${service.isActive ? '' : 'opacity-60'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ShirtIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription>{service.description}</CardDescription>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Harga</span>
                  </div>
                  <span className="font-bold text-green-600">
                    Rp {service.price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Estimasi</span>
                  </div>
                  <span className="text-sm font-medium">{service.duration}</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toggleActive(service.id)}
              >
                {service.isActive ? "Nonaktifkan" : "Aktifkan"} Layanan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceManagement;
