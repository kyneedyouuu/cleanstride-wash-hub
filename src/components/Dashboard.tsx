
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShirtIcon, Package, TruckIcon, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inProcessOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*, services(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      setRecentOrders(orders || []);
      
      // Calculate stats
      const total = orders?.length || 0;
      const pending = orders?.filter(order => order.status === 'pending').length || 0;
      const inProcess = orders?.filter(order => ['confirmed', 'pickup_scheduled', 'picked_up', 'in_process'].includes(order.status)).length || 0;
      const completed = orders?.filter(order => order.status === 'delivered').length || 0;

      setStats({
        totalOrders: total,
        pendingOrders: pending,
        inProcessOrders: inProcess,
        completedOrders: completed
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: "secondary" as const, icon: Clock, text: "Pending" },
      confirmed: { variant: "default" as const, icon: CheckCircle, text: "Confirmed" },
      pickup_scheduled: { variant: "default" as const, icon: TruckIcon, text: "Pickup Scheduled" },
      picked_up: { variant: "default" as const, icon: Package, text: "Picked Up" },
      in_process: { variant: "default" as const, icon: ShirtIcon, text: "In Process" },
      delivered: { variant: "default" as const, icon: CheckCircle, text: "Delivered" },
      cancelled: { variant: "destructive" as const, icon: AlertCircle, text: "Cancelled" }
    };

    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <ShirtIcon className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-600">Selamat datang kembali, {userProfile?.full_name || user?.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProcessOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your latest laundry orders</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShirtIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first order</p>
              <Button>Create Order</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ShirtIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-gray-600">{order.services?.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium">Rp {order.total_amount?.toLocaleString('id-ID')}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
