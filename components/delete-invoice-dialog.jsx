"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
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
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteInvoiceDialog({ invoiceId, onDeleted, trigger }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteInvoice = useMutation(api.invoices.deleteInvoice);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInvoice({ id: invoiceId });
      toast.success("Invoice deleted successfully");
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete invoice");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this invoice? This action cannot be
            undone. All invoice data will be permanently removed from your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Invoice"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
