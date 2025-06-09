
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ShirtIcon, Calendar, MapPin, Phone, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const OrderForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    serviceId: "",
    shoeType: "",
    quantity: 1,
    notes: "",
    pickupDate: "",
    pickupTime: "",
    urgent: false
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("price");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate order number
      const { data: orderNumber } = await supabase.rpc('generate_order_number');
      
      // Get selected service
      const selectedService = services.find(s => s.id === formData.serviceId);
      if (!selectedService) {
        throw new Error("Please select a service");
      }

      // Calculate total amount
      const baseAmount = selectedService.price * formData.quantity;
      const urgentFee = formData.urgent ? baseAmount * 0.5 : 0;
      const totalAmount = baseAmount + urgentFee;

      // Create order
      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          customer_id: user?.id,
          service_id: formData.serviceId,
          shoe_type: formData.shoeType,
          pickup_address: formData.address,
          delivery_address: formData.address,
          pickup_date: `${formData.pickupDate}T${formData.pickupTime}:00`,
          total_amount: totalAmount,
          special_notes: formData.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial tracking entry
      await supabase
        .from("order_tracking")
        .insert({
          order_id: data.id,
          status: 'pending',
          notes: 'Order created successfully',
          updated_by: user?.id
        });

      toast({
        title: "Order Berhasil Dibuat",
        description: `Order ${orderNumber} telah dibuat. Total: Rp ${totalAmount.toLocaleString('id-ID')}`
      });

      // Reset form
      setFormData({
        customerName: "",
        phone: "",
        address: "",
        serviceId: "",
        shoeType: "",
        quantity: 1,
        notes: "",
        pickupDate: "",
        pickupTime: "",
        urgent: false
      });

      console.log("Order created:", {
        orderId: orderNumber,
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        service: selectedService.name,
        shoeType: formData.shoeType,
        quantity: formData.quantity,
        notes: formData.notes,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        urgent: formData.urgent
      });

    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal membuat order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedService = services.find(s => s.id === formData.serviceId);
  const baseAmount = selectedService ? selectedService.price * formData.quantity : 0;
  const urgentFee = formData.urgent ? baseAmount * 0.5 : 0;
  const totalAmount = baseAmount + urgentFee;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Buat Order Baru</h2>
        <p className="text-gray-600">Isi form di bawah untuk membuat order laundry sepatu</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShirtIcon className="h-5 w-5" />
            Order Information
          </CardTitle>
          <CardDescription>Lengkapi informasi order Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="customerName"
                    placeholder="Masukkan nama lengkap"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Pickup/Delivery</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="address"
                  placeholder="Masukkan alamat lengkap untuk pickup dan delivery"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <Label>Pilih Layanan</Label>
              <Select value={formData.serviceId} onValueChange={(value) => handleInputChange("serviceId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih layanan laundry" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{service.name}</span>
                        <span className="ml-4 font-medium">Rp {service.price.toLocaleString('id-ID')}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shoe Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shoeType">Jenis Sepatu</Label>
                <Select value={formData.shoeType} onValueChange={(value) => handleInputChange("shoeType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis sepatu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sports Shoes">Sepatu Olahraga</SelectItem>
                    <SelectItem value="Casual Shoes">Sepatu Kasual</SelectItem>
                    <SelectItem value="Formal Shoes">Sepatu Formal</SelectItem>
                    <SelectItem value="Boots">Sepatu Boot</SelectItem>
                    <SelectItem value="Sneakers">Sneakers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah Pasang</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>

            {/* Pickup Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupDate">Tanggal Pickup</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupTime">Waktu Pickup</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Special Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan Khusus (Opsional)</Label>
              <Textarea
                id="notes"
                placeholder="Contoh: Ada noda membandel di bagian sol, handle with care, dll."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>

            {/* Urgent Service */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={formData.urgent}
                onCheckedChange={(checked) => handleInputChange("urgent", checked)}
              />
              <Label htmlFor="urgent" className="text-sm">
                Layanan Express (+50% biaya tambahan)
              </Label>
            </div>

            {/* Price Summary */}
            {selectedService && (
              <Card className="bg-gray-50">
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-2">Ringkasan Biaya</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>{selectedService.name} x {formData.quantity}</span>
                      <span>Rp {baseAmount.toLocaleString('id-ID')}</span>
                    </div>
                    {formData.urgent && (
                      <div className="flex justify-between text-orange-600">
                        <span>Biaya Express (50%)</span>
                        <span>Rp {urgentFee.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="border-t pt-1 flex justify-between font-medium">
                      <span>Total</span>
                      <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Membuat Order..." : "Buat Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
