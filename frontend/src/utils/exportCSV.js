export const exportToCSV = (data, filename = 'expenses.csv') => {
  const headers = ['Date', 'Category', 'Amount', 'Note'];
  const rows = data.map(expense => [
    new Date(expense.date).toLocaleDateString(),
    expense.category,
    expense.amount.toFixed(2),
    expense.note || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${val}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
