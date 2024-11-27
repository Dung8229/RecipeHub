import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (ingredients) => {
  const doc = new jsPDF();

  doc.text('Shopping List', 14, 20);
  const tableColumn = ["Item", "Quantity"];
  const tableRows = [];

  ingredients.forEach(ingredient => {
    const ingredientData = [
      ingredient.name,
      `${ingredient.quantity} ${ingredient.unit}`
    ];
    tableRows.push(ingredientData);
  });

  doc.autoTable(tableColumn, tableRows, { startY: 30 });
  doc.save('shopping_list.pdf');
}; 