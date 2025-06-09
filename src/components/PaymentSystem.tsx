
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  TrendingUp
} from "lucide-react";

const PaymentSystem = () => {
  const [selectedPayment, setSelectedPayment] = useState("");

  const paymentMethods = [
    {
      id: "cod",
      name: "Cash on Delivery (COD)",
      description: "Bayar tunai saat sepatu diantar",
      icon: Banknote,
      fee: 0,
      available: true
    },
    {
      id: "transfer",
      name: "Transfer Bank",
      description: "Transfer ke rekening CleanStride",
      icon: Building,
      fee: 0,
      available: true
    },
    {
      id: "ewallet",
      name: "E-Wallet",
      description: "GoPay, OVO, DANA, LinkAja",
      icon: Smartphone,
      fee: 2500,
      available: true
    },
    {
      id: "credit",
      name: "Kartu Kredit/Debit",
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
      fee: "2.9%",
      available: false
    }
  ];

  const recentTransactions = [
    {
      id: "TRX-001",
      orderId: "CLS-123456",
      customer: "Ahmad Rizki",
      amount: 45000,
      method: "Transfer Bank",
      status: "completed",
      date: "2024-01-12"
    },
    {
      id: "TRX-002",
      orderId: "CLS-123457",
      customer: "Siti Nurhaliza",
      amount: 25000,
      method: "COD",
      status: "pending",
      date: "2024-01-12"
    },
    {
      id: "TRX-003",
      orderId: "CLS-123458",
      customer: "Budi Santoso",
      amount: 65000,
      method: "GoPay",
      status: "completed",
      date: "2024-01-11"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { variant: "default" as const, label: "Selesai", icon: CheckCircle },
      pending: { variant: "secondary" as const, label: "Menunggu", icon: Clock },
      failed: { variant: "destructive" as const, label: "Gagal", icon: AlertCircle }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    if (!statusInfo) return null;
    
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{statusInfo.label}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sistem Pembayaran</h2>
          <p className="text-gray-600">Kelola metode pembayaran dan transaksi</p>
        </div>
      </div>

      <Tabs defaultValue="methods" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/50">
          <TabsTrigger value="methods">Metode Pembayaran</TabsTrigger>
          <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-6">
          {/* Payment Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 1,245,000</div>
                <p className="text-xs text-green-100">+12% dari kemarin</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Transaksi Selesai</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-blue-100">dari 25 transaksi</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Menunggu Bayar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-orange-100">perlu follow up</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rata-rata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 54,130</div>
                <p className="text-xs text-purple-100">per transaksi</p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Metode Pembayaran Tersedia</CardTitle>
              <CardDescription>Pilih metode pembayaran yang ingin diaktifkan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        method.available
                          ? selectedPayment === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-100 bg-gray-50 opacity-60'
                      }`}
                      onClick={() => method.available && setSelectedPayment(method.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            method.available ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              method.available ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium">{method.name}</h4>
                            <p className="text-sm text-gray-600">{method.description}</p>
                            {method.fee !== 0 && (
                              <p className="text-xs text-orange-600">
                                Biaya admin: {typeof method.fee === 'number' ? `Rp ${method.fee.toLocaleString()}` : method.fee}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant={method.available ? "default" : "secondary"}>
                          {method.available ? "Aktif" : "Segera"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedPayment && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Konfigurasi Pembayaran</h4>
                  <div className="space-y-2">
                    {selectedPayment === "transfer" && (
                      <div>
                        <p className="text-sm text-blue-800">Rekening Bank:</p>
                        <p className="text-sm text-blue-700">BCA: 1234567890 a.n CleanStride</p>
                        <p className="text-sm text-blue-700">Mandiri: 0987654321 a.n CleanStride</p>
                      </div>
                    )}
                    {selectedPayment === "ewallet" && (
                      <div>
                        <p className="text-sm text-blue-800">E-Wallet yang didukung:</p>
                        <p className="text-sm text-blue-700">GoPay, OVO, DANA, LinkAja</p>
                        <p className="text-sm text-blue-700">Biaya admin Rp 2,500 per transaksi</p>
                      </div>
                    )}
                    {selectedPayment === "cod" && (
                      <div>
                        <p className="text-sm text-blue-800">Cash on Delivery:</p>
                        <p className="text-sm text-blue-700">Customer bayar tunai saat sepatu diantar</p>
                        <p className="text-sm text-blue-700">Tidak ada biaya tambahan</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Transaksi Terbaru</CardTitle>
              <CardDescription>Daftar transaksi pembayaran hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.id}</p>
                        <p className="text-sm text-gray-600">{transaction.customer} • {transaction.orderId}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-green-600">Rp {transaction.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{transaction.method}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(transaction.status)}
                      <Button variant="ghost" size="sm">Detail</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Metode Pembayaran Populer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Transfer Bank</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-sm font-medium">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">COD</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '25%'}}></div>
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">E-Wallet</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '15%'}}></div>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Ringkasan Mingguan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">Rp 8.7M</p>
                    <p className="text-sm text-green-700">Total Pendapatan</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-sm text-blue-700">Total Transaksi</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-lg font-bold text-orange-600">Rp 55,769</p>
                  <p className="text-sm text-orange-700">Rata-rata per Transaksi</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentSystem;
