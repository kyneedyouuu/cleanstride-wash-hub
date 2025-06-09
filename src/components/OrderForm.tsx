
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, MapPin, Calendar, Clock, ShirtIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    service: "",
    shoeType: "",
    quantity: 1,
    notes: "",
    pickupDate: "",
    pickupTime: "",
    urgent: false
  });

  const { toast } = useToast();

  const services = [
    { id: "basic", name: "Basic Clean", price: 25000, duration: "2-3 hari" },
    { id: "premium", name: "Premium Clean", price: 45000, duration: "1-2 hari" },
    { id: "deep", name: "Deep Clean", price: 65000, duration: "3-4 hari" },
    { id: "express", name: "Express Clean", price: 55000, duration: "1 hari" },
  ];

  const shoeTypes = [
    "Sneakers", "Formal Shoes", "Boots", "Sandals", "Sports Shoes", "High Heels", "Lainnya"
  ];

  const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `CLS-${timestamp}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = generateOrderId();
    
    toast({
      title: "Order Berhasil Dibuat!",
      description: `Order ID: ${orderId} telah dibuat. Customer akan dihubungi untuk konfirmasi pickup.`,
    });

    console.log("Order created:", { orderId, ...formData });
  };

  const selectedService = services.find(s => s.id === formData.service);
  const totalPrice = selectedService ? selectedService.price * formData.quantity : 0;
  const urgentFee = formData.urgent ? totalPrice * 0.3 : 0;
  const finalPrice = totalPrice + urgentFee;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Order Baru</h2>
        <p className="text-gray-600">Isi form di bawah untuk membuat pesanan laundry sepatu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShirtIcon className="h-5 w-5 mr-2" />
                Detail Pesanan
              </CardTitle>
              <CardDescription>Masukkan informasi customer dan detail sepatu</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informasi Customer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Nama Lengkap</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="Masukkan nama customer"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="08123456789"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Masukkan alamat lengkap untuk pickup dan delivery"
                      required
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pilih Layanan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service">Jenis Layanan</Label>
                      <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih layanan" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{service.name}</span>
                                <span className="text-sm text-gray-500">Rp {service.price.toLocaleString()}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="shoeType">Jenis Sepatu</Label>
                      <Select value={formData.shoeType} onValueChange={(value) => setFormData({ ...formData, shoeType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis sepatu" />
                        </SelectTrigger>
                        <SelectContent>
                          {shoeTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Jumlah Sepatu</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                {/* Pickup Schedule */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Jadwal Pickup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupDate">Tanggal Pickup</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupTime">Waktu Pickup</Label>
                      <Select value={formData.pickupTime} onValueChange={(value) => setFormData({ ...formData, pickupTime: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih waktu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">09:00 - 11:00</SelectItem>
                          <SelectItem value="11:00">11:00 - 13:00</SelectItem>
                          <SelectItem value="13:00">13:00 - 15:00</SelectItem>
                          <SelectItem value="15:00">15:00 - 17:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Opsi Tambahan</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="urgent"
                      checked={formData.urgent}
                      onCheckedChange={(checked) => setFormData({ ...formData, urgent: checked as boolean })}
                    />
                    <Label htmlFor="urgent" className="text-sm">
                      Express Service (+30% biaya)
                    </Label>
                  </div>
                  <div>
                    <Label htmlFor="notes">Catatan Khusus</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Catatan khusus untuk sepatu (noda, kerusakan, dll)"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Upload Foto Sepatu (Opsional)</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Upload foto sepatu untuk dokumentasi</p>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Pilih Foto
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  Buat Pesanan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="bg-white/70 backdrop-blur-sm sticky top-6">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedService && (
                <>
                  <div className="flex justify-between">
                    <span>Layanan:</span>
                    <span className="font-medium">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi:</span>
                    <Badge variant="outline">{selectedService.duration}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Harga per sepatu:</span>
                    <span>Rp {selectedService.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jumlah:</span>
                    <span>{formData.quantity} sepatu</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rp {totalPrice.toLocaleString()}</span>
                  </div>
                  {formData.urgent && (
                    <div className="flex justify-between text-orange-600">
                      <span>Express fee (+30%):</span>
                      <span>Rp {urgentFee.toLocaleString()}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>Rp {finalPrice.toLocaleString()}</span>
                  </div>
                </>
              )}
              
              {!selectedService && (
                <p className="text-gray-500 text-center">Pilih layanan untuk melihat estimasi harga</p>
              )}

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">Langkah Selanjutnya:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Kurir akan datang sesuai jadwal</li>
                  <li>• Sepatu akan dicek kondisinya</li>
                  <li>• Proses pencucian dimulai</li>
                  <li>• Notifikasi saat selesai</li>
                  <li>• Delivery ke alamat Anda</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
