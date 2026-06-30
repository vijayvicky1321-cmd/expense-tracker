import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { Expense } from '../types';
import { formatDate, formatCurrency } from '../utils/date';

const expenseToRow = (e: Expense) => ({
  Date: formatDate(e.date),
  Description: e.description,
  Category: e.category,
  'Payment Method': e.paymentMethod,
  Amount: e.amount,
  Notes: e.notes ?? '',
});

export const exportToCSV = (expenses: Expense[], filename: string) => {
  if (!expenses.length) return;

  const headers = ['Date', 'Description', 'Category', 'Payment Method', 'Amount', 'Notes'];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.description,
    e.category,
    e.paymentMethod,
    e.amount.toFixed(2),
    e.notes ?? '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToExcel = (expenses: Expense[], filename: string) => {
  if (!expenses.length) return;

  const data = expenses.map(expenseToRow);
  const ws = XLSX.utils.json_to_sheet(data);

  // Column widths
  ws['!cols'] = [
    { wch: 14 }, { wch: 30 }, { wch: 20 }, { wch: 16 }, { wch: 12 }, { wch: 30 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

  // Summary sheet
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const summaryData = [
    ['Total Expenses', expenses.length],
    ['Total Amount', total.toFixed(2)],
    ['Average Amount', (total / expenses.length).toFixed(2)],
    ['Date Range', `${formatDate(expenses[expenses.length - 1]?.date ?? '')} to ${formatDate(expenses[0]?.date ?? '')}`],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `${filename}.xlsx`);
};

export const exportToPDF = (expenses: Expense[], title: string) => {
  if (!expenses.length) return;

  const doc = new jsPDF();

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${formatDate(new Date())}`, 14, 25);

  // Summary box
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Total Transactions: ${expenses.length}`, 14, 40);
  doc.text(`Total Amount: ${formatCurrency(total)}`, 14, 47);
  doc.text(`Average: ${formatCurrency(total / expenses.length)}`, 14, 54);

  // Table
  autoTable(doc, {
    startY: 62,
    head: [['Date', 'Description', 'Category', 'Payment', 'Amount']],
    body: expenses.map((e) => [
      formatDate(e.date, 'dd/MM/yyyy'),
      e.description.slice(0, 30),
      e.category,
      e.paymentMethod,
      formatCurrency(e.amount),
    ]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { 4: { halign: 'right' } },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};
