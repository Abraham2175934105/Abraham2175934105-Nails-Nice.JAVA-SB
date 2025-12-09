import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, Package, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getAdminStats } from "@/lib/apiAdmin";

const currency = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

const Dashboard = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fallback/mock in case backend not ready
  const mockStats = {
    totalSales: 12426,
    totalOrders: 234,
    totalClients: 1429,
    totalProducts: 89,
    monthlySales: [
      { month: "Ene", total: 4200 },
      { month: "Feb", total: 5100 },
      { month: "Mar", total: 4800 },
      { month: "Abr", total: 6300 },
      { month: "May", total: 7200 },
      { month: "Jun", total: 8100 }
    ],
    categoryDistribution: [
      { name: "Esmaltes", value: 35 },
      { name: "Decoraciones", value: 30 },
      { name: "Herramientas", value: 20 },
      { name: "Tratamientos", value: 15 }
    ],
    recentOrders: [
      { id: 1234, customer: "María García", amount: 156.00, status: "Completado", date: "2025-01-10" },
      { id: 1233, customer: "Juan Pérez", amount: 89.50, status: "Procesando", date: "2025-01-09" }
    ],
    topProducts: [
      { id: 1, name: "Esmalte Rojo Intenso", sales: 156, revenue: 3900 },
      { id: 2, name: "Brillo Secado Rápido", sales: 134, revenue: 6030 }
    ]
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAdminStats()
      .then((data) => {
        if (!mounted) return;
        // Normalizar nombres para frontend
        const mapped = {
          totalSales: data.totalSales ?? 0,
          totalOrders: data.totalOrders ?? 0,
          totalClients: data.totalClients ?? 0,
          totalProducts: data.totalProducts ?? 0,
          monthlySales: (data.monthlySales || []).map((m: any) => ({ month: m.month, ventas: m.total })),
          // mapear categoryDistribution y añadir color asignado por palette
          categoryDistribution: (data.categoryDistribution || []).map((c: any, idx: number) => ({ name: c.name, value: c.value, color: undefined })),
          recentOrders: data.recentOrders || [],
          topProducts: data.topProducts || []
        };
        setStats(mapped);
      })
      .catch((err) => {
        console.error("Error cargando stats:", err);
        setError("No se pudieron cargar las estadísticas. Se muestran datos locales.");
        setStats(mockStats);
      })
      .finally(() => setLoading(false));

    return () => { mounted = false; };
  }, []);

  // Color palette (ajusta colores aquí si quieres)
  const palette = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8BD3C7", "#E26D5A"];

  // Ensure categoryData has colors:
  const categoryData = (() => {
    const src = stats ? stats.categoryDistribution : mockStats.categoryDistribution;
    return src.map((c: any, i: number) => ({
      ...c,
      color: c.color || palette[i % palette.length]
    }));
  })();

  const cards = [
    {
      title: "Ventas Totales",
      value: stats ? currency(stats.totalSales) : "$0",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-gradient-to-br from-green-500/10 to-green-600/5",
      iconColor: "text-green-600"
    },
    {
      title: "Pedidos",
      value: stats ? String(stats.totalOrders) : "0",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      bgColor: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600"
    },
    {
      title: "Clientes",
      value: stats ? String(stats.totalClients) : "0",
      change: "+5.7%",
      trend: "up",
      icon: Users,
      bgColor: "bg-gradient-to-br from-purple-500/10 to-purple-600/5",
      iconColor: "text-purple-600"
    },
    {
      title: "Productos",
      value: stats ? String(stats.totalProducts) : "0",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      bgColor: "bg-gradient-to-br from-orange-500/10 to-orange-600/5",
      iconColor: "text-orange-600"
    }
  ];

  const salesData = stats ? stats.monthlySales : mockStats.monthlySales;
  const recentOrders = stats ? stats.recentOrders : mockStats.recentOrders;
  const topProducts = stats ? stats.topProducts : mockStats.topProducts;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">{error ? error : "Vista general de tu negocio"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="overflow-hidden shadow-elegant hover-elevate transition-smooth animate-fade-in border-l-4 border-l-transparent hover:border-l-primary" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                      {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">{stat.title}</p>
                    <p className="text-4xl font-black tracking-tight tabular-nums">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Ventas Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
                Distribución por Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" nameKey="name">
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color || "#8884d8" }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-smooth">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">#{order.id} • {order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{currency(Number(order.amount || 0))}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${order.status === "completada" || order.status === "Completado" ? "bg-green-500/10 text-green-600" : order.status === "Procesando" ? "bg-blue-500/10 text-blue-600" : "bg-orange-500/10 text-orange-600"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold shadow-md">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.sales} ventas</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary">{currency(Number(product.revenue || 0))}</p>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all shadow-sm" style={{ width: `${Math.min(100, (product.sales / 200) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;