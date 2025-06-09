
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Package, TruckIcon, Wrench, CheckCircle, Clock, MapPin, Phone } from "lucide-react";

const OrderTracking = () => {
  const [searchOrderId, setSearchOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const sampleOrders = [
    {
      id: "CLS-123456",
      customerName: "Ahmad Rizki",
      phone: "08123456789",
      service: "Premium Clean",
      status: "processing",
      progress: 60,
      estimatedCompletion: "2024-01-15",
      timeline: [
        { step: "Order Received", completed: true, time: "2024-01-12 10:30", description: "Pesanan diterima dan dikonfirmasi" },
        { step: "Pickup", completed: true, time: "2024-01-12 14:15", description: "Sepatu berhasil dijemput dari alamat customer" },
        { step: "Processing", completed: false, time: "2024-01-13 09:00", description: "Sepatu sedang dalam proses pencucian" },
        { step: "Quality Control", completed: false, time: "", description: "Pengecekan kualitas hasil pencucian" },
        { step: "Ready for Delivery", completed: false, time: "", description: "Siap untuk diantar ke customer" },
        { step: "Delivered", completed: false, time: "", description: "Sepatu telah sampai ke customer" }
      ],
      shoeDetails: {
        type: "Sneakers Nike Air Force 1",
        quantity: 1,
        condition: "Kotor ringan, noda di bagian sol",
        photos: ["sepatu1.jpg", "sepatu2.jpg"]
      },
      address: "Jl. Sudirman No. 123, Jakarta Pusat",
      notes: "Harap hati-hati dengan bagian logo Nike"
    }
  ];

  const handleSearch = () => {
    const found = sampleOrders.find(order => order.id === searchOrderId.toUpperCase());
    setSelectedOrder(found || null);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      pickup: "bg-blue-500",
      processing: "bg-purple-500",
      qc: "bg-orange-500",
      ready: "bg-green-500",
      delivery: "bg-teal-500",
      completed: "bg-emerald-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusIcon = (step: string) => {
    const icons = {
      "Order Received": Package,
      "Pickup": TruckIcon,
      "Processing": Wrench,
      "Quality Control": CheckCircle,
      "Ready for Delivery": Clock,
      "Delivered": CheckCircle
    };
    return icons[step as keyof typeof icons] || Package;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Lacak Pesanan</h2>
        <p className="text-gray-600">Masukkan nomor order untuk melihat status terkini</p>
      </div>

      {/* Search Order */}
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Cari Pesanan
          </CardTitle>
          <CardDescription>Masukkan nomor order (contoh: CLS-123456)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Masukkan nomor order..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Cari
            </Button>
          </div>
          {searchOrderId && !selectedOrder && (
            <p className="text-red-500 text-sm mt-2">Order tidak ditemukan. Pastikan nomor order benar.</p>
          )}
        </CardContent>
      </Card>

      {/* Order Details */}
      {selectedOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Order {selectedOrder.id}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedOrder.address}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                    {selectedOrder.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telepon</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="font-medium">{selectedOrder.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Layanan</p>
                    <p className="font-medium">{selectedOrder.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimasi Selesai</p>
                    <p className="font-medium">{selectedOrder.estimatedCompletion}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">{selectedOrder.progress}%</span>
                  </div>
                  <Progress value={selectedOrder.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Timeline Pesanan</CardTitle>
                <CardDescription>Riwayat proses pesanan Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedOrder.timeline.map((item: any, index: number) => {
                    const Icon = getStatusIcon(item.step);
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          item.completed 
                            ? 'bg-green-100 text-green-600' 
                            : index === selectedOrder.timeline.findIndex((t: any) => !t.completed)
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              item.completed ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {item.step}
                            </p>
                            {item.time && (
                              <p className="text-xs text-gray-500">{item.time}</p>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shoe Details */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Detail Sepatu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Jenis</p>
                  <p className="font-medium">{selectedOrder.shoeDetails.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jumlah</p>
                  <p className="font-medium">{selectedOrder.shoeDetails.quantity} sepatu</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kondisi Awal</p>
                  <p className="font-medium text-sm">{selectedOrder.shoeDetails.condition}</p>
                </div>
                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Catatan Khusus</p>
                    <p className="font-medium text-sm">{selectedOrder.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Butuh Bantuan?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Hubungi Customer Service
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TruckIcon className="h-4 w-4 mr-2" />
                  Hubungi Kurir
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Pesan Lagi
                </Button>
                <Button variant="outline" className="w-full">
                  Download Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Sample Orders for Demo */}
      {!selectedOrder && (
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Demo: Coba Order Berikut</CardTitle>
            <CardDescription>Untuk demo, coba masukkan nomor order: CLS-123456</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default OrderTracking;
