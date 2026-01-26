"use client";

import DashboardLayout from "@/components/dashboard-layout";
import LoadingSpinner from "@/components/loading-spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  Building,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Save,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const userQuery = useQuery(
    api.users.getUserByKindeId,
    user?.id ? { kindeId: user.id } : "skip",
  );
  const updateUser = useMutation(api.users.updateUser);
  const deleteUser = useMutation(api.users.deleteUser);

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    businessAddress: "",
    businessEmail: "",
    businessPhone: "",
    preferredCurrency: "KES",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "KES", name: "Kenyan Shilling" },
  ];

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  useEffect(() => {
    const getUserDetails = () => {
      if (userQuery) {
        setFormData({
          name: userQuery.name || "",
          businessName: userQuery.businessName || "",
          businessAddress: userQuery.businessAddress || "",
          businessEmail: userQuery.businessEmail || "",
          businessPhone: userQuery.businessPhone || "",
          preferredCurrency: userQuery.preferredCurrency || "KES",
        });
      }
    };

    getUserDetails();
  }, [userQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateUser({
        kindeId: user.id,
        updates: {
          ...formData,
          theme: theme,
        },
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await deleteUser({ kindeId: user.id });
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout user={userQuery}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Personal Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessEmail: e.target.value,
                      })
                    }
                    placeholder="business@example.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="businessPhone">Business Phone</Label>
                  <Input
                    id="businessPhone"
                    value={formData.businessPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessPhone: e.target.value,
                      })
                    }
                    placeholder="+254 (0) 12345678"
                  />
                </div>

                <div>
                  <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                  <Select
                    value={formData.preferredCurrency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, preferredCurrency: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessAddress: e.target.value,
                    })
                  }
                  placeholder="123 Business Street, Nairobi"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="size-5" />
                Appearance
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div>
                <Label>Theme</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {themes.map((themeOption) => (
                    <Button
                      key={themeOption.value}
                      type="button"
                      variant={
                        theme === themeOption.value ? "default" : "outline"
                      }
                      className="justify-start gap-2"
                      onClick={() => setTheme(themeOption.value)}
                    >
                      <themeOption.icon className="size-4" />
                      {themeOption.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button type="submit" disabled={isUpdating}>
              <Save className="mr-2 size-4" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        <Separator />

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sign Out</h4>
                <p className="text-muted-foreground text-sm">
                  Sign out of your account on this device.
                </p>
              </div>

              <LogoutLink>
                <Button variant="outline">
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </Button>
              </LogoutLink>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-600">Delete Account</h4>
                <p className="text-muted-foreground text-sm">
                  Permanently delete you account and all associated data
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 size-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your account? This action
                      cannot be undone. All your invoices, settings, and data
                      will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
