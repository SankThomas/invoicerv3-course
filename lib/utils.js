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

    const PAGE_HEIGHT = doc.internal.pageSize.height;
    const PAGE_WIDTH = doc.internal.pageSize.width;
    const TOP_MARGIN = 20;
    const BOTTOM_MARGIN = 30;

    doc.setFont("helvetica");

    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text("Invoicer V3", 20, 30);

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

    doc.setTextColor(
      statusColor.r ?? 128,
      statusColor.g ?? 128,
      statusColor.b ?? 128,
    );

    doc.text(`Status ${invoice.status.toUpperCase()}`, 150, 45);

    doc.setTextColor(0, 0, 0);

    // Bill To
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 85);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(invoice.clientName, 20, 95);
    doc.text(invoice.clientEmail, 20, 105);

    // Client address
    let addressEndY = 115;

    if (invoice.clientAddress) {
      const addressLines = invoice.clientAddress.split("\n");

      addressLines.forEach((line) => {
        doc.text(line, 20, addressEndY);
        addressEndY += 10;
      });
    }

    // Start table below address
    const tableStartY = Math.max(addressEndY + 15, 140);

    const drawTableHeader = (y) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);

      doc.text("Description", 20, y);
      doc.text("Qty", 120, y);
      doc.text("Rate", 140, y);
      doc.text("Amount", 170, y);

      doc.line(20, y + 2, PAGE_WIDTH - 20, y + 2);

      doc.setFont("helvetica", "normal");
    };

    drawTableHeader(tableStartY);

    let currentY = tableStartY + 15;

    // Items
    invoice.items.forEach((item) => {
      const descriptionLines = doc.splitTextToSize(item.description, 90);

      const rowHeight = Math.max(descriptionLines.length * 2, 6);

      // Create new page if row won't fit
      if (currentY + rowHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
        doc.addPage();

        currentY = TOP_MARGIN;

        drawTableHeader(currentY);

        currentY += 8;
      }

      doc.text(descriptionLines, 20, currentY);

      doc.text(item.quantity.toString(), 120, currentY);

      doc.text(formatCurrency(item.rate, invoice.currency), 140, currentY);

      doc.text(formatCurrency(item.amount, invoice.currency), 170, currentY);

      currentY += rowHeight + 6;
    });

    // Summary section height
    const summaryHeight = invoice.tax > 0 ? 50 : 35;

    // Move summary to a new page if necessary
    if (currentY + summaryHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
      doc.addPage();
      currentY = TOP_MARGIN;
    }

    const summaryStartY = currentY + 15;

    doc.line(120, summaryStartY - 5, PAGE_WIDTH - 20, summaryStartY - 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text("Subtotal:", 120, summaryStartY);

    doc.text(
      formatCurrency(invoice.subtotal, invoice.currency),
      170,
      summaryStartY,
    );

    let totalY = summaryStartY + 12;

    if (invoice.tax > 0) {
      doc.text(`Tax (${invoice.tax}%):`, 120, totalY);

      doc.text(
        formatCurrency(invoice.total - invoice.subtotal, invoice.currency),
        170,
        totalY,
      );

      totalY += 12;
    }

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.line(120, totalY - 2, PAGE_WIDTH - 20, totalY - 2);

    doc.text("Total:", 120, totalY + 5);

    doc.text(formatCurrency(invoice.total, invoice.currency), 170, totalY + 5);

    currentY = totalY + 15;

    // Notes
    if (invoice.notes) {
      const notesLines = doc.splitTextToSize(invoice.notes, 170);

      const notesHeight = notesLines.length * 6 + 20;

      if (currentY + notesHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
        doc.addPage();
        currentY = TOP_MARGIN;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text("Useful notes:", 20, currentY);

      doc.text(notesLines, 20, currentY + 10);

      currentY += notesHeight;
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);

    doc.text("Thank you for your business!", 20, PAGE_HEIGHT - 15);

    if (returnBlob) {
      return doc.output("blob");
    }

    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    console.error("Error generating PDF", error);
    throw error;
  }
};
