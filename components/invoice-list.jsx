"use client";

import { api } from "@/convex/_generated/api";
import { formatCurrency, getStatusColor } from "@/lib/utils";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import DeleteInvoiceDialog from "./delete-invoice-dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function InvoiceList({ invoices }) {
  const updateInvoiceStatus = useMutation(api.invoices.updateInvoiceStatus);

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await updateInvoiceStatus({
        id: invoiceId,
        status: newStatus,
      });
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update invoice status");
      console.error(error);
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="bg-muted/20 rounded-lg border py-12 text-center">
        <h3 className="mb-2 text-xl font-medium">No invoices yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first invoices to get started
        </p>

        <Link href="/invoice/new">
          <Button variant="default">Create Invoice</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell className="font-medium">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>
                {formatCurrency(invoice.total, invoice.currency)}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(invoice.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link
                        href={`/invoice/${invoice._id}`}
                        className="flex items-center gap-1"
                      >
                        <Eye className="size-4" />
                        View Invoice
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Link
                        href={`/invoice/${invoice._id}/send`}
                        className="flex items-center gap-1"
                      >
                        <Send className="size-4" />
                        Send as Email
                      </Link>
                    </DropdownMenuItem>

                    {invoice.status !== "paid" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(invoice._id, "paid")}
                      >
                        Mark as Paid
                      </DropdownMenuItem>
                    )}

                    {invoice.status !== "sent" && invoice.status !== "paid" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(invoice._id, "sent")}
                      >
                        Mark as Sent
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={() => handleStatusChange(invoice._id, "draft")}
                    >
                      Mark as Draft
                    </DropdownMenuItem>

                    {invoice.status !== "cancelled" && (
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(invoice._id, "cancelled")
                        }
                      >
                        Cancel Invoice
                      </DropdownMenuItem>
                    )}

                    <DeleteInvoiceDialog
                      invoiceId={invoice._id}
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <span className="flex w-full items-center text-red-600">
                            Delete
                          </span>
                        </DropdownMenuItem>
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
