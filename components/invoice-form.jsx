"use client";

import { api } from "@/convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { formatCurrency } from "@/lib/utils";

export default function InvoiceForm({ invoice = null }) {
  const router = useRouter();
  const { user } = useKindeBrowserClient();
  const createInvoice = useMutation(api.invoices.createInvoice);
  const updateInvoice = useMutation(api.invoices.updateInvoice);

  const [formData, setFormData] = useState({
    invoiceNumber: invoice?.invoiceNumber || `INV-${Date.now()}`,
    clientName: invoice?.clientName || "",
    clientEmail: invoice?.clientEmail || "",
    clientAddress: invoice?.clientAddress || "",
    items: invoice?.items || [
      { description: "", quantity: 1, rate: 0, amount: 0 },
    ],
    currency: invoice?.currency || "KSH",
    dueDate:
      invoice?.dueDate ||
      format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    notes: invoice?.notes || "",
    tax: invoice?.tax || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "KES", name: "Kenyan Shilling" },
  ];

  const calculateItemAmount = (quantity, rate) => {
    return quantity * rate;
  };

  const calculateSubTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    return subTotal + (subTotal * formData.tax) / 100;
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    if (field === "quantity" || field === "rate") {
      newItems[index].amount = calculateItemAmount(
        newItems[index].quantity,
        newItems[index].rate,
      );
    }

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const subtotal = calculateSubTotal();
      const total = calculateTotal();

      if (invoice) {
        await updateInvoice({
          id: invoice._id,
          updates: {
            ...formData,
            subtotal,
            total,
            status: "draft",
          },
        });
        toast.success("Invoice updated successfully");
      } else {
        await createInvoice({
          ...formData,
          userId: user.id,
          subtotal,
          total,
          status: "draft",
        });
        toast.success("Invoice created successfully");
      }

      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to save invoice");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceNumber: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, clientEmail: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea
              id="clientAddress"
              value={formData.clientAddress}
              onChange={(e) =>
                setFormData({ ...formData, clientAddress: e.target.value })
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Items</CardTitle>
            <Button type="button" onClick={addItem} variant="outline" size="sm">
              <Plus className="mr-2 size-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 items-end gap-4">
                <div className="col-span-5">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    placeholder="Item description"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value),
                      )
                    }
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label>Rate</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "rate",
                        parseFloat(e.target.value),
                      )
                    }
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={item.amount.toFixed(2)}
                    disabled
                  />
                </div>

                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
              >
                <SelectTrigger>
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

            <div>
              <Label htmlFor="tax">Tax (%)</Label>
              <Input
                id="tax"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.tax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tax: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>SubTotal:</span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: formData.currency,
                }).format(calculateSubTotal())}
              </span>
            </div>

            {formData.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax ({formData.tax}%):</span>
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: formData.currency,
                  }).format((calculateSubTotal() * formData.tax) / 100)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: formData.currency,
                }).format(calculateTotal())}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes or payment terms"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : invoice
              ? "Update Invoice"
              : "Create Invoice"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
