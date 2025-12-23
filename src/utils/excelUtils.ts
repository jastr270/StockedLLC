import { InventoryItem } from '../types/inventory';

export interface ExcelInventoryItem {
  name: string;
  description: string;
  category: string;
  containerType: string;
  quantity: number;
  weightPerContainer: number;
  totalWeight: number;
  unit: string;
  costPerUnit: number;
  totalValue: number;
  supplier: string;
  location: string;
  expirationDate: string;
  minimumStock: number;
  lastUpdated: string;
}

export const exportToExcel = (items: InventoryItem[], filename: string = 'inventory') => {
  const csvData: ExcelInventoryItem[] = items.map(item => ({
    name: item.name,
    description: item.description,
    category: item.category,
    containerType: item.containerType,
    quantity: item.quantity,
    weightPerContainer: item.weightPerContainer,
    totalWeight: item.totalWeightLbs,
    unit: item.unit,
    costPerUnit: item.costPerUnit || 0,
    totalValue: item.totalValue || 0,
    supplier: item.supplier || '',
    location: item.location || '',
    expirationDate: item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : '',
    minimumStock: item.minimumStock || 0,
    lastUpdated: new Date(item.updatedAt).toLocaleDateString()
  }));

  const csv = convertToCSV(csvData);
  downloadCSV(csv, `${filename}.csv`);
};

export const exportToCSV = (items: InventoryItem[], filename: string = 'inventory') => {
  exportToExcel(items, filename);
};

export const importFromExcel = (file: File): Promise<InventoryItem[]> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          reject(new Error('File is empty or unreadable'));
          return;
        }
        
        const lines = text.split('\n');
        if (lines.length < 2) {
          reject(new Error('File must have at least a header row and one data row'));
          return;
        }
        
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        const inventoryItems: InventoryItem[] = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            try {
              const values = line.split(',').map(v => v.replace(/"/g, '').trim());
              const row: any = {};
              headers.forEach((header, i) => {
                row[header] = values[i] || '';
              });
            
              return {
                id: `imported-${Date.now()}-${index}`,
                name: row.name || 'Unnamed Item',
                description: row.description || '',
                category: row.category || 'Other',
                containerType: row.containerType || 'Box - Medium',
                quantity: Number(row.quantity) || 0,
                weightPerContainer: Number(row.weightPerContainer) || 1,
                totalWeightLbs: Number(row.totalWeight) || Number(row.quantity) || 0,
                unit: row.unit || 'lbs',
                costPerUnit: Number(row.costPerUnit) || 0,
                totalValue: Number(row.totalValue) || 0,
                supplier: row.supplier || '',
                location: row.location || '',
                expirationDate: row.expirationDate ? new Date(row.expirationDate) : undefined,
                minimumStock: Number(row.minimumStock) || 0,
                isDryGood: true,
                createdAt: Date.now(),
                updatedAt: Date.now()
              };
            } catch (rowError) {
              console.warn(`Error parsing row ${index}:`, rowError);
              return null;
            }
          });
        
        const validItems = inventoryItems.filter(item => item !== null);
        resolve(validItems);
      } catch (error) {
        reject(new Error('Failed to parse file. Please ensure it has the correct format.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const importFromCSV = (file: File): Promise<InventoryItem[]> => {
  return importFromExcel(file); // Same logic for CSV
};

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}