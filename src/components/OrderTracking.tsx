
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package, TruckIcon, CheckCircle, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const OrderTracking = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          services(name, description),
          profiles!orders_customer_id_fkey(full_name)
        `)
        .eq("customer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingHistory = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from("order_tracking")
        .select(`
          *,
          profiles(full_name)
        `)
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTrackingHistory(data || []);
    } catch (error) {
      console.error("Error fetching tracking history:", error);
    }
  };

  const handleOrderSelect = (order: any) => {
    setSelectedOrder(order);
    fetchTrackingHistory(order.id);
  };

  const getStatusIcon = (status: string) => {
    const iconMap: { [key: string]: any } = {
      pending: Clock,
      confirmed: CheckCircle,
      pickup_scheduled: TruckIcon,
      picked_up: Package,
      in_process: Package,
      quality_check: CheckCircle,
      ready_for_delivery: Package,
      out_for_delivery: TruckIcon,
      delivered: CheckCircle,
      cancelled: Clock
    };
    return iconMap[status] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      pickup_scheduled: "bg-purple-100 text-purple-800",
      picked_up: "bg-indigo-100 text-indigo-800",
      in_process: "bg-orange-100 text-orange-800",
      quality_check: "bg-cyan-100 text-cyan-800",
      ready_for_delivery: "bg-green-100 text-green-800",
      out_for_delivery: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const textMap: { [key: string]: string } = {
      pending: "Menunggu Konfirmasi",
      confirmed: "Dikonfirmasi",
      pickup_scheduled: "Dijadwalkan Pickup",
      picked_up: "Sudah Dipickup",
      in_process: "Sedang Diproses",
      quality_check: "Quality Check",
      ready_for_delivery: "Siap Dikirim",
      out_for_delivery: "Dalam Pengiriman",
      delivered: "Diterima",
      cancelled: "Dibatalkan"
    };
    return textMap[status] || status;
  };

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.services?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tracking Order</h2>
        <p className="text-gray-600">Lacak status pesanan laundry sepatu Anda</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nomor order atau nama layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Order</CardTitle>
            <CardDescription>Klik untuk melihat detail tracking</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Belum ada order</h3>
                <p className="text-gray-600">Buat order pertama Anda sekarang</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div
                      key={order.id}
                      onClick={() => handleOrderSelect(order)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedOrder?.id === order.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{order.order_number}</h4>
                        <Badge className={getStatusColor(order.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{order.services?.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        Rp {order.total_amount?.toLocaleString('id-ID')}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details & Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Tracking</CardTitle>
            <CardDescription>
              {selectedOrder ? `Tracking untuk ${selectedOrder.order_number}` : 'Pilih order untuk melihat detail'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedOrder ? (
              <div className="space-y-4">
                {/* Order Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Informasi Order</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Layanan:</span>
                      <p className="font-medium">{selectedOrder.services?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Jenis Sepatu:</span>
                      <p className="font-medium">{selectedOrder.shoe_type || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <p className="font-medium text-green-600">
                        Rp {selectedOrder.total_amount?.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status Payment:</span>
                      <p className="font-medium">
                        {selectedOrder.payment_status === 'pending' ? 'Pending' : 
                         selectedOrder.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div>
                  <h4 className="font-medium mb-3">Timeline Tracking</h4>
                  <div className="space-y-3">
                    {trackingHistory.map((track, index) => {
                      const StatusIcon = getStatusIcon(track.status);
                      return (
                        <div key={track.id} className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{getStatusText(track.status)}</p>
                            {track.notes && (
                              <p className="text-sm text-gray-600">{track.notes}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(track.created_at).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pickup/Delivery Address */}
                {selectedOrder.pickup_address && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900">Alamat Pickup/Delivery</h5>
                        <p className="text-sm text-blue-700">{selectedOrder.pickup_address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Pilih order dari daftar di sebelah kiri untuk melihat detail tracking</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderTracking;
