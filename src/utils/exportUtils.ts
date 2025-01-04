import { Transaction } from '../types/transaction';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
} 

export function exportToCSV(transactions: Transaction[]): void {
  const headers = ['Date', 'Name', 'Category', 'Type', 'Amount (DZD)', 'Notes'];
  const csvData = transactions.map(t => [
    format(new Date(t.date), 'yyyy-MM-dd'),
    t.name,
    t.category,
    t.type,
    t.amount.toString(),
    t.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `masroofy-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
}

export function exportToPDF(transactions: Transaction[]): void {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Masroofy Transactions', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${format(new Date(), 'PPP')}`, 14, 25);

  // Prepare table data
  const tableData = transactions.map(t => [
    format(new Date(t.date), 'MMM dd, yyyy'),
    t.name,
    t.category,
    t.type,
    `${t.type === 'income' ? '+' : '-'} ${t.amount.toFixed(2)} DZD`,
    t.notes || ''
  ]);

  // Generate table
  autoTable(doc, {
    head: [['Date', 'Name', 'Category', 'Type', 'Amount', 'Notes']],
    body: tableData,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [63, 81, 181] }
  });

  // Save PDF
  doc.save(`masroofy-transactions-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}