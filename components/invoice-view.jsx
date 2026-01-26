"use client";

import { api } from "@/convex/_generated/api";
import { exportToPDF, formatCurrency, getStatusColor } from "@/lib/utils";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import {
  CheckCircle,
  Download,
  Edit,
  Mail,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import DeleteInvoiceDialog from "./delete-invoice-dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

export default function InvoiceView({ invoice }) {
  const router = useRouter();
  const updateInvoiceStatus = useMutation(api.invoices.updateInvoiceStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);

    try {
      await updateInvoiceStatus({
        id: invoice._id,
        status: newStatus,
      });
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update invoice status");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportToPDF = async () => {
    setIsExporting(true);

    try {
      await exportToPDF(invoice);
      toast.success("PDF exported successfully");
    } catch (error) {
      toast.error("Failed to export to PDF");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteSuccess = () => {
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-bold">
            Invoice {invoice.invoiceNumber}
          </h1>

          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportToPDF}
            variant="outline"
            disabled={isExporting}
          >
            <Download className="mr-2 size-4" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>

          <Link href={`/invoice/${invoice._id}/send`}>
            <Button variant="outline">
              <Mail className="mr-2 size-4" />
              Send to Client
            </Button>
          </Link>

          <Link href={`/invoice/${invoice._id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 size-4" />
              Edit
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" disabled={isUpdating}>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {invoice.status !== "paid" && (
                <DropdownMenuItem onClick={() => handleStatusChange("paid")}>
                  <CheckCircle className="mr-2 size-4" />
                  Mark as Paid
                </DropdownMenuItem>
              )}

              {invoice.status !== "send" && invoice.status !== "paid" && (
                <DropdownMenuItem onClick={() => handleStatusChange("sent")}>
                  <Send className="mr-2 size-4" />
                  Mark as Sent
                </DropdownMenuItem>
              )}

              {invoice.status !== "cancelled" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("cancelled")}
                >
                  <Trash2 className="mr-2 size-4" />
                  Cancel Invoice
                </DropdownMenuItem>
              )}

              <DeleteInvoiceDialog
                invoiceId={invoice._id}
                onDeleted={handleDeleteSuccess}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <span className="flex w-full items-center text-red-600">
                      Delete Invoice
                    </span>
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold">{invoice.clientName}</p>
              <p className="text-muted-foreground">{invoice.clientEmail}</p>
              <p className="text-sm whitespace-pre-line">
                {invoice.clientAddress}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Number:</span>
                <span className="font-medium">{invoice.invoiceNumber}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Date:</span>
                <span>
                  {format(new Date(invoice.createdAt), "MMM dd, yyyy")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span>{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="text-muted-foreground grid grid-cols-12 gap-4 border-b pb-2 text-sm font-medium">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-right">Quantity</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-3 text-right">Amount</div>
            </div>

            {invoice.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 py-2">
                <div className="col-span-5">{item.description}</div>
                <div className="col-span-2 text-right">{item.quantity}</div>
                <div className="col-span-2 text-right">
                  {formatCurrency(item.rate, invoice.currency)}
                </div>
                <div className="col-span-3 text-right">
                  {formatCurrency(item.amount, invoice.currency)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="ml-auto max-w-sm space-y-3">
            <div className="justify-betwe flex">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>

            {invoice.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax ({invoice.tax}%)</span>
                <span>
                  {formatCurrency(
                    invoice.total - invoice.subtotal,
                    invoice.currency,
                  )}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6 border-t pt-6">
              <h4 className="mb-2 font-medium">Notes</h4>
              <p className="text-muted-foreground textsm whitespace-pre-line">
                {invoice.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
