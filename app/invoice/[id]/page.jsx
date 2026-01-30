"use client";

import DashboardLayout from "@/components/dashboard-layout";
import InvoiceView from "@/components/invoice-view";
import LoadingSpinner from "@/components/loading-spinner";
import { api } from "@/convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

export default function InvoiceDetails() {
  const { id } = useParams();
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  const userQuery = useQuery(
    api.users.getUserByKindeId,
    user?.id ? { kindeId: user.id } : "skip",
  );
  const invoice = useQuery(api.invoices.getInvoice, { id: id });

  if (isLoading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

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
      <InvoiceView invoice={invoice} />
    </DashboardLayout>
  );
}
