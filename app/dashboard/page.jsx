"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LoadingSpinner from "@/components/loading-spinner";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import DashboardStats from "@/components/dashboard-stats";
import InvoiceList from "@/components/invoice-list";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const [currentUser, setCurrentUser] = useState(null);

  const userQuery = useQuery(
    api.users.getUserByKindeId,
    user?.id ? { kindeId: user.id } : "skip",
  );
  const createUser = useMutation(api.users.createUser);
  const invoices = useQuery(
    api.invoices.getInvoices,
    user?.id ? { userId: user.id } : "skip",
  );

  useEffect(() => {
    const createUserInConvex = () => {
      if (user && userQuery === null) {
        createUser({
          kindeId: user.id,
          email: user.email,
          name: user.given_name + " " + user.family_name,
          preferredCurrency: "KES",
          theme: "dark",
        });
      } else if (userQuery) {
        setCurrentUser(userQuery);
      }
    };

    createUserInConvex();
  }, [user, userQuery, createUser]);

  if (isLoading && isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout user={currentUser}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <p className="text-muted-foreground mt-2">
              Manage your invoices and track payments
            </p>
          </div>

          <Button asChild className="gap-2">
            <Link href="/invoice/new">
              <Plus className="size-4" /> New Invoice
            </Link>
          </Button>
        </div>

        <DashboardStats invoices={invoices || []} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Invoices</h2>
          </div>

          <InvoiceList invoices={invoices || []} />
        </div>
      </div>
    </DashboardLayout>
  );
}
