"use client";

import DashboardLayout from "@/components/dashboard-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { exportToPDF, formatCurrency, getStatusColor } from "@/lib/utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { ArrowLeft, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SendPage() {
  const { id } = useParams();
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();

  const userQuery = useQuery(
    api.users.getUserByKindeId,
    user?.id ? { kindeId: user.id } : "skip",
  );
  const updateInvoiceStatus = useMutation(api.invoices.updateInvoiceStatus);
  const invoice = useQuery(api.invoices.getInvoice, { id: id });

  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const draftEmail = () => {
      if (invoice) {
        setFormData({
          to: invoice.clientEmail,
          subject: `Invoice ${invoice.invoiceNumber} from ${user?.given_name || "Freelancing"}`,
          message: `
Dear ${invoice.clientName},
        
Please find attached your invoice ${invoice.invoiceNumber} for the amount of ${new Intl.NumberFormat("en-US", { style: "currency", currency: invoice.currency }).format(invoice.total)}.

This invoice is due on ${format(new Date(invoice.dueDate), "MMMM dd, yyyy")}.

Thank you for your business!

Best regards,
${userQuery?.businessName || "Invoicer"}`,
        });
      }
    };

    draftEmail();
  }, [invoice, user, userQuery]);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const pdfBlob = await exportToPDF(invoice, true);
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

      const res = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.to,
          subject: formData.subject,
          message: formData.message,
          pdfBase64: base64Pdf,
          invoiceNumber: invoice.invoiceNumber,
        }),
      });

      await updateInvoiceStatus({ id: invoice._id, status: "sent" });

      toast.success("INvoice sent successfully");
      router.push(`/invoice/${invoice._id}`);
    } catch (error) {
      toast.error("Failed to send invoice");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !isAuthenticated) return <LoadingSpinner />;

  if (!invoice) {
    return (
      <DashboardLayout user={userQuery}>
        <div className="py-12 text-center">
          <h2 className="mb-2 text-2xl font-semibold">Invoice not found</h2>
          <p className="text-muted-foreground">
            This is not the invoice you are looking for.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={userQuery}>
      <div className="space-y-6">
        <div className="items-cener flex gap-4">
          <Link href={`/invoice/${invoice._id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 size-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Send Invoice {invoice.invoiceNumber}
            </h1>
            <p className="text-muted-foreground mt-2">
              Send this invoice to your client via email
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="size-5" />
                Email Details
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    type="email"
                    value={formData.to}
                    onChange={(e) =>
                      setFormData({ ...formData, to: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={8}
                    required
                  />
                </div>

                <Button type="submit" disabled={isSending} className="w-full">
                  <Send className="mr-2 size-4" />
                  {isSending ? "Sending..." : "Send Invoice"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Invoice {invoice.invoiceNumber}
                </h3>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client:</span>
                  <span>{invoice.clientName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{invoice.clientEmail}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span>{formatCurrency(invoice.total, invoice.currency)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>
                    {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-2 font-medium">
                  Items ({invoice.items.length})
                </h4>

                <div className="space-y-1">
                  {invoice.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.description}</span>
                      <span>
                        {formatCurrency(item.amount, invoice.currency)}
                      </span>
                    </div>
                  ))}

                  {invoice.items.length > 3 && (
                    <div className="text-muted-foreground text-sm">
                      + {invoice.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
