
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShirtIcon, 
  TruckIcon, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Package,
  UserCheck,
  Wrench
} from "lucide-react";

const Dashboard = () => {
  const recentOrders = [
    { id: "ORD-001", customer: "Ahmad Rizki", service: "Premium Clean", status: "processing", amount: "Rp 45,000" },
    { id: "ORD-002", customer: "Siti Nurhaliza", service: "Basic Clean", status: "pickup", amount: "Rp 25,000" },
    { id: "ORD-003", customer: "Budi Santoso", service: "Deep Clean", status: "completed", amount: "Rp 65,000" },
    { id: "ORD-004", customer: "Rina Melati", service: "Express Clean", status: "delivery", amount: "Rp 55,000" },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pickup: { variant: "secondary" as const, label: "Pickup" },
      processing: { variant: "default" as const, label: "Proses" },
      delivery: { variant: "outline" as const, label: "Delivery" },
      completed: { variant: "default" as const, label: "Selesai" }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { variant: "secondary" as const, label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Overview aktivitas bisnis laundry sepatu Anda</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Package className="h-4 w-4 mr-2" />
          Order Baru
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="kurir">Kurir</TabsTrigger>
          <TabsTrigger value="workshop">Workshop</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders Hari Ini</CardTitle>
                <ShirtIcon className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-blue-100">+12% dari kemarin</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
                <DollarSign className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 1,245,000</div>
                <p className="text-xs text-green-100">+8% dari kemarin</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders Dalam Proses</CardTitle>
                <Clock className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-orange-100">2 urgent priority</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Aktif</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-purple-100">+5 customer baru</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Orders Terbaru
              </CardTitle>
              <CardDescription>Daftar pesanan yang masuk hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <ShirtIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{order.service}</p>
                      <p className="text-sm text-gray-600">{order.amount}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(order.status)}
                      <Button variant="ghost" size="sm">Detail</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2" />
                Panel Admin
              </CardTitle>
              <CardDescription>Kelola sistem, layanan, dan laporan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Kelola User
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <ShirtIcon className="h-6 w-6 mb-2" />
                  Kelola Layanan
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <DollarSign className="h-6 w-6 mb-2" />
                  Laporan Keuangan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kurir" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TruckIcon className="h-5 w-5 mr-2" />
                Panel Kurir
              </CardTitle>
              <CardDescription>Kelola pickup dan delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Pickup Hari Ini</h4>
                    <Badge variant="secondary">5 lokasi</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Jemput sepatu dari customer</p>
                  <Button className="w-full mt-3" variant="outline">
                    Lihat Rute Pickup
                  </Button>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Delivery Hari Ini</h4>
                    <Badge variant="secondary">8 lokasi</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Antar sepatu ke customer</p>
                  <Button className="w-full mt-3" variant="outline">
                    Lihat Rute Delivery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workshop" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Panel Workshop
              </CardTitle>
              <CardDescription>Kelola proses pencucian dan quality control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Antrian Cuci</h4>
                    <Badge>12 sepatu</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Menunggu proses pencucian</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Dalam Proses</h4>
                    <Badge variant="secondary">8 sepatu</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Sedang dicuci</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Quality Control</h4>
                    <Badge variant="outline">5 sepatu</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Pengecekan kualitas</p>
                </div>
              </div>
              <Button className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Update Status Pencucian
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
