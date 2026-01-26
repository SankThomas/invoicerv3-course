"use client";

import DashboardLayout from "@/components/dashboard-layout";
import InvoiceForm from "@/components/invoice-form";
import LoadingSpinner from "@/components/loading-spinner";
import { api } from "@/convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "convex/react";

export default function NewInvoice() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  const userQuery = useQuery(
    api.users.getUserByKindeId,
    user?.id ? { kindeId: user.id } : "skip",
  );

  if (isLoading && isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout user={userQuery}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Invoice
          </h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to create a professional invoice
          </p>
        </div>

        <InvoiceForm />
      </div>
    </DashboardLayout>
  );
}
