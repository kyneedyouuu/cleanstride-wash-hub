
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Package, Users, Download, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ReportSystem = () => {
  const { user, userProfile } = useAuth();
  const [reportData, setReportData] = useState<any>({
    overview: {},
    ordersByMonth: [],
    ordersByService: [],
    ordersByStatus: [],
    revenueByMonth: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user, selectedPeriod]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const days = parseInt(selectedPeriod);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch orders data
      let query = supabase
        .from("orders")
        .select(`
          *,
          services(name, price),
          payments(payment_status, amount)
        `)
        .gte("created_at", startDate.toISOString());

      // If not admin, filter by customer
      if (userProfile?.role !== 'admin') {
        query = query.eq("customer_id", user?.id);
      }

      const { data: orders, error } = await query;
      if (error) throw error;

      // Process data for reports
      const processedData = processOrderData(orders || []);
      setReportData(processedData);

    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processOrderData = (orders: any[]) => {
    // Overview stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    // Orders by month
    const ordersByMonth = processMonthlyData(orders, 'created_at');

    // Revenue by month
    const revenueByMonth = processMonthlyRevenue(orders);

    // Orders by service
    const serviceMap = new Map();
    orders.forEach(order => {
      const serviceName = order.services?.name || 'Unknown';
      serviceMap.set(serviceName, (serviceMap.get(serviceName) || 0) + 1);
    });
    const ordersByService = Array.from(serviceMap.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalOrders) * 100).toFixed(1)
    }));

    // Orders by status
    const statusMap = new Map();
    orders.forEach(order => {
      const status = getStatusText(order.status);
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });
    const ordersByStatus = Array.from(statusMap.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalOrders) * 100).toFixed(1)
    }));

    return {
      overview: {
        totalOrders,
        totalRevenue,
        completedOrders,
        pendingOrders,
        completionRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0
      },
      ordersByMonth,
      revenueByMonth,
      ordersByService,
      ordersByStatus
    };
  };

  const processMonthlyData = (orders: any[], dateField: string) => {
    const monthMap = new Map();
    orders.forEach(order => {
      const date = new Date(order[dateField]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    });

    return Array.from(monthMap.entries())
      .map(([month, count]) => ({
        month: new Date(month).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        orders: count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const processMonthlyRevenue = (orders: any[]) => {
    const monthMap = new Map();
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const currentRevenue = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, currentRevenue + (order.total_amount || 0));
    });

    return Array.from(monthMap.entries())
      .map(([month, revenue]) => ({
        month: new Date(month).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        revenue
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const getStatusText = (status: string) => {
    const textMap: { [key: string]: string } = {
      pending: "Pending",
      confirmed: "Confirmed",
      pickup_scheduled: "Pickup Scheduled",
      picked_up: "Picked Up",
      in_process: "In Process",
      quality_check: "Quality Check",
      ready_for_delivery: "Ready",
      out_for_delivery: "Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled"
    };
    return textMap[status] || status;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const exportReport = () => {
    const csvData = [
      ['Period', selectedPeriod + ' days'],
      ['Total Orders', reportData.overview.totalOrders],
      ['Total Revenue', 'Rp ' + reportData.overview.totalRevenue?.toLocaleString('id-ID')],
      ['Completion Rate', reportData.overview.completionRate + '%'],
      [],
      ['Service Distribution'],
      ['Service Name', 'Orders', 'Percentage'],
      ...reportData.ordersByService.map((item: any) => [item.name, item.value, item.percentage + '%'])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cleanstride-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-gray-600">Analisis performa bisnis laundry</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Hari</SelectItem>
              <SelectItem value="30">30 Hari</SelectItem>
              <SelectItem value="90">90 Hari</SelectItem>
              <SelectItem value="365">1 Tahun</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.overview.totalOrders || 0}</div>
            <p className="text-xs text-gray-600">Last {selectedPeriod} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rp {reportData.overview.totalRevenue?.toLocaleString('id-ID') || '0'}
            </div>
            <p className="text-xs text-gray-600">Last {selectedPeriod} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reportData.overview.completedOrders || 0}</div>
            <p className="text-xs text-gray-600">{reportData.overview.completionRate || 0}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reportData.overview.pendingOrders || 0}</div>
            <p className="text-xs text-gray-600">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Order Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Month</CardTitle>
              <CardDescription>Tren pesanan per bulan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.ordersByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Tren pendapatan per bulan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => ['Rp ' + value?.toLocaleString('id-ID'), 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Service</CardTitle>
                <CardDescription>Distribusi pesanan per layanan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.ordersByService}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.ordersByService.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
                <CardDescription>Detail performa layanan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.ordersByService.map((service: any, index: number) => (
                    <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{service.value} orders</p>
                        <p className="text-sm text-gray-600">{service.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
              <CardDescription>Distribusi status pesanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportData.ordersByStatus.map((status: any, index: number) => (
                  <div key={status.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{status.name}</h4>
                      <span className="text-2xl font-bold">{status.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${status.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{status.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportSystem;
