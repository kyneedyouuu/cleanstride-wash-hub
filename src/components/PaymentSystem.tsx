
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Banknote, Smartphone, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const PaymentSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [unpaidOrders, setUnpaidOrders] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnpaidOrders();
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchUnpaidOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          services(name, description)
        `)
        .eq("customer_id", user?.id)
        .eq("payment_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUnpaidOrders(data || []);
    } catch (error) {
      console.error("Error fetching unpaid orders:", error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          orders(order_number, services(name))
        `)
        .eq("orders.customer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPaymentHistory(data || []);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const handlePayment = async (orderId: string, paymentMethod: string) => {
    setLoading(true);
    try {
      const order = unpaidOrders.find(o => o.id === orderId);
      if (!order) throw new Error("Order not found");

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          order_id: orderId,
          amount: order.total_amount,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
          transaction_id: `TXN-${Date.now()}`,
          payment_date: paymentMethod === 'cod' ? null : new Date().toISOString()
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update order payment status
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cod' ? 'pending' : 'paid'
        })
        .eq("id", orderId);

      if (orderError) throw orderError;

      toast({
        title: "Payment Processed",
        description: paymentMethod === 'cod' 
          ? "COD payment scheduled. Pay when courier arrives."
          : "Payment successful! Your order will be processed soon."
      });

      // Refresh data
      fetchUnpaidOrders();
      fetchPaymentHistory();

    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: "secondary" as const, icon: Clock, text: "Pending" },
      paid: { variant: "default" as const, icon: CheckCircle, text: "Paid" },
      failed: { variant: "destructive" as const, icon: AlertCircle, text: "Failed" },
      refunded: { variant: "outline" as const, icon: AlertCircle, text: "Refunded" }
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

  const getPaymentMethodIcon = (method: string) => {
    const iconMap = {
      cod: Banknote,
      bank_transfer: CreditCard,
      credit_card: CreditCard,
      digital_wallet: Smartphone
    };
    return iconMap[method as keyof typeof iconMap] || CreditCard;
  };

  const getPaymentMethodText = (method: string) => {
    const textMap = {
      cod: "Cash on Delivery",
      bank_transfer: "Bank Transfer",
      credit_card: "Credit Card",
      digital_wallet: "Digital Wallet"
    };
    return textMap[method as keyof typeof textMap] || method;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment System</h2>
        <p className="text-gray-600">Kelola pembayaran order laundry Anda</p>
      </div>

      <Tabs defaultValue="unpaid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unpaid">Unpaid Orders ({unpaidOrders.length})</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="unpaid" className="space-y-4">
          {unpaidOrders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">All Payments Up to Date</h3>
                  <p className="text-gray-600">Semua order sudah dibayar</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {unpaidOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.order_number}</CardTitle>
                        <CardDescription>{order.services?.name}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          Rp {order.total_amount?.toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Pilih metode pembayaran:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* COD */}
                        <Button
                          variant="outline"
                          className="h-auto p-4 justify-start"
                          onClick={() => handlePayment(order.id, 'cod')}
                          disabled={loading}
                        >
                          <div className="flex items-center space-x-3">
                            <Banknote className="h-6 w-6 text-green-600" />
                            <div className="text-left">
                              <p className="font-medium">Cash on Delivery</p>
                              <p className="text-xs text-gray-500">Bayar saat sepatu diantar</p>
                            </div>
                          </div>
                        </Button>

                        {/* Bank Transfer */}
                        <Button
                          variant="outline"
                          className="h-auto p-4 justify-start"
                          onClick={() => handlePayment(order.id, 'bank_transfer')}
                          disabled={loading}
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium">Bank Transfer</p>
                              <p className="text-xs text-gray-500">Transfer ke rekening kami</p>
                            </div>
                          </div>
                        </Button>

                        {/* Digital Wallet */}
                        <Button
                          variant="outline"
                          className="h-auto p-4 justify-start"
                          onClick={() => handlePayment(order.id, 'digital_wallet')}
                          disabled={loading}
                        >
                          <div className="flex items-center space-x-3">
                            <Smartphone className="h-6 w-6 text-purple-600" />
                            <div className="text-left">
                              <p className="font-medium">Digital Wallet</p>
                              <p className="text-xs text-gray-500">OVO, GoPay, DANA</p>
                            </div>
                          </div>
                        </Button>

                        {/* Credit Card */}
                        <Button
                          variant="outline"
                          className="h-auto p-4 justify-start"
                          onClick={() => handlePayment(order.id, 'credit_card')}
                          disabled={loading}
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-6 w-6 text-red-600" />
                            <div className="text-left">
                              <p className="font-medium">Credit Card</p>
                              <p className="text-xs text-gray-500">Visa, Mastercard</p>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {paymentHistory.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No Payment History</h3>
                  <p className="text-gray-600">Belum ada riwayat pembayaran</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {paymentHistory.map((payment) => {
                const PaymentIcon = getPaymentMethodIcon(payment.payment_method);
                return (
                  <Card key={payment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <PaymentIcon className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.orders?.order_number}</p>
                            <p className="text-sm text-gray-600">{payment.orders?.services?.name}</p>
                            <p className="text-xs text-gray-500">
                              {payment.payment_date 
                                ? new Date(payment.payment_date).toLocaleDateString('id-ID')
                                : 'Pending'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-medium">Rp {payment.amount?.toLocaleString('id-ID')}</p>
                          <div className="flex items-center space-x-2">
                            {getPaymentStatusBadge(payment.payment_status)}
                          </div>
                          <p className="text-xs text-gray-500">
                            {getPaymentMethodText(payment.payment_method)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentSystem;
