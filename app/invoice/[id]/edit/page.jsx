"use client";

import DashboardLayout from "@/components/dashboard-layout";
import InvoiceForm from "@/components/invoice-form";
import LoadingSpinner from "@/components/loading-spinner";
import { api } from "@/convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";

export default function InvoiceEditPage() {
  const { id } = useParams();
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();

  const invoice = useQuery(api.invoices.getInvoice, { id: id });

  if (isLoading || !isAuthenticated) return <LoadingSpinner />;

  if (!invoice) {
    return (
      <DashboardLayout user={user}>
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
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Invoice {invoice.invoiceNumber}
          </h1>
          <p className="text-muted-foreground mt-2">
            Update the invoice details below
          </p>
        </div>

        <InvoiceForm invoice={invoice} />
      </div>
    </DashboardLayout>
  );
}
