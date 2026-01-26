import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";
import { format } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount, currency = "Ksh") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const getStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "sent":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "draft":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export const exportToPDF = async (invoice, returnBlob = false) => {
  try {
    const doc = new jsPDF();

    doc.setFont("helvetica");

    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text("INVOICE", 20, 30);

    // Invoice date and number
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #${invoice.invoiceNumber}`, 20, 45);
    doc.text(
      `Issue Date: ${format(new Date(invoice.createdAt), "MMM dd, yyyy")}`,
      20,
      55,
    );
    doc.text(
      `Due Date: ${format(new Date(invoice.dueDate), "MMM dd, yyyy")}`,
      20,
      65,
    );

    // Status
    doc.setFontSize(10);
    const statusColor = getStatusColor(invoice.status);
    doc.setTextColor(128, 128, 128);
    doc.text(`Status ${invoice.status.toUpperCase()}`, 150, 45);

    // Reset color
    doc.setTextColor(0, 0, 0);

    // Bill to
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 85);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(invoice.clientName, 20, 95);
    doc.text(invoice.clientEmail, 20, 105);

    // Client address
    if (invoice.clientAddress) {
      const addressLines = invoice.clientAddress.split("\n");
      let yPos = 115;
      addressLines.forEach((line) => {
        doc.text(line, 20, yPos);
        yPos += 10;
      });
    }

    // Items table
    const tableStartY = 140;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("Description", 20, tableStartY);
    doc.text("Qty", 120, tableStartY);
    doc.text("Rate", 140, tableStartY);
    doc.text("Amount", 170, tableStartY);

    doc.line(20, tableStartY + 2, 190, tableStartY + 2);

    doc.setFont("helvetica", "normal");
    let currentY = tableStartY + 15;

    invoice.items.forEach((item) => {
      doc.text(item.description, 20, currentY);
      doc.text(item.quantity.toString(), 120, currentY);
      doc.text(formatCurrency(item.rate, invoice.currency), 140, currentY);
      doc.text(formatCurrency(item.amount, invoice.currency), 170, currentY);
      currentY += 12;
    });

    const summaryStartY = currentY + 20;
    doc.line(120, summaryStartY - 5, 190, summaryStartY - 5);

    doc.text("Subtotal:", 120, summaryStartY);
    doc.text(
      formatCurrency(invoice.subtotal, invoice.currency),
      170,
      summaryStartY,
    );

    if (invoice.tax > 0) {
      doc.text(`Tax (${invoice.tax}%):`, 120, summaryStartY + 12);
      doc.text(
        formatCurrency(invoice.total - invoice.subtotal, invoice.currency),
        170,
        summaryStartY + 12,
      );
    }

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const totalY = invoice.tax > 0 ? summaryStartY + 24 : summaryStartY + 12;
    doc.line(12, totalY - 2, 190, totalY - 2);
    doc.text("Total:", 120, totalY + 5);
    doc.text(formatCurrency(invoice.total, invoice.currency), 170, totalY + 5);

    // Notes
    if (invoice.notes) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Notes:", 20, totalY + 25);

      const notesLines = doc.splitTextToSize(invoice.notes, 170);
      doc.text(notesLines, 20, totalY + 35);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for your business!", 20, 280);

    if (returnBlob) {
      return doc.output("blob");
    } else {
      doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
    }
  } catch (error) {
    console.error("Error generating PDF", error);
    throw error;
  }
};
