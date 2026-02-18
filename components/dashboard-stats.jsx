import { formatCurrency } from "@/lib/utils";
import { Clock, DollarSign, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function DashboardStats({ invoices }) {
  const stats = {
    total: invoices.length,
    paid: invoices.filter((inv) => inv.status === "paid").length,
    pending: invoices.filter((inv) => inv.status === "sent").length,
    revenue: invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0),
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="text-muted-foreground size-4" />
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.revenue)}
          </div>
          <p className="text-muted-foreground text-xs">
            From {stats.paid} paid invoices
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <FileText className="text-muted-foreground size-4" />
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-muted-foreground text-xs">
            All time invoices created
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="text-muted-foreground size-4" />
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-muted-foreground text-xs">Awaiting payment</p>
        </CardContent>
      </Card>
    </div>
  );
}
