"use client";

import DashboardLayout from "@/components/dashboard-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "convex/react";
import {
  Building,
  DollarSign,
  Mail,
  MapPin,
  Palette,
  Phone,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const { theme } = useTheme();

  const userQuery = useQuery(
    api.users.getUserByKindeId,
    user?.id ? { kindeId: user.id } : "skip",
  );

  if (isLoading && isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout user={userQuery}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">
            View your account and business information
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center gap-4">
            {!user?.picture ? (
              <div className="bg-muted flex size-14 items-center justify-center rounded-full text-xl font-semibold">
                {userQuery?.name?.charAt(0) || "U"}
              </div>
            ) : (
              <Image
                src={user.picture}
                alt={user.given_name}
                width={400}
                height={400}
                className="size-14 rounded-full"
              />
            )}

            <div className="flex w-full items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{userQuery?.name}</h2>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>

              <Link href="/settings">
                <Button variant="default">Edit Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={user?.email} />
            <InfoRow label="Full Name" value={userQuery?.name} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="size-5" />
              Business Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <InfoRow label="Business Name" value={userQuery?.businessName} />
            <InfoRow
              icon={Mail}
              label="Business Email"
              value={userQuery?.businessEmail}
            />
            <InfoRow
              icon={Phone}
              label="Business PHone"
              value={userQuery?.businessPhone}
            />
            <InfoRow
              icon={MapPin}
              label="Business Address"
              value={userQuery?.businessAddress}
              multiline
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-5" />
              Preferences
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-4">
            <PreferenceBadge icon={Palette} label="Theme" value={theme} />
            <PreferenceBadge
              icon={DollarSign}
              label="Currency"
              value={userQuery?.preferredCurrency}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function InfoRow({ icon: Icon, label, value, multiline = false }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="text-muted-foreground mt-1 size-4" />}

      <div>
        <p className="text-sm font-medium">{label}</p>
        <p
          className={`text-muted-foreground text-sm ${multiline ? "whitespace-pre-line" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function PreferenceBadge({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-2">
      <Icon className="size-4" />
      <span className="font-medium">{label}</span>
      <span className="capitalize">{value}</span>
    </Badge>
  );
}
