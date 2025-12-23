import React, { useRef, useState } from 'react';
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { exportToExcel, exportToCSV, importFromExcel, importFromCSV } from '../utils/excelUtils';

interface ExcelIntegrationProps {
  items: InventoryItem[];
  onImport: (items: InventoryItem[]) => void;
}

export const ExcelIntegration: React.FC<ExcelIntegrationProps> = ({ items, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleExportExcel = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    exportToExcel(items, `food-inventory-${timestamp}`);
  };

  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(items, `food-inventory-${timestamp}`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus(null);

    try {
      let importedItems: InventoryItem[];
      
      if (file.name.endsWith('.csv')) {
        importedItems = await importFromCSV(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        importedItems = await importFromExcel(file);
      } else {
        throw new Error('Unsupported file format. Please use .xlsx, .xls, or .csv files.');
      }

      onImport(importedItems);
      setImportStatus({
        type: 'success',
        message: `Successfully imported ${importedItems.length} items from ${file.name}`
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to import file'
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="glass-effect rounded-2xl shadow-soft p-8 mb-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Excel Integration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Export Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Inventory
          </h4>
          <div className="space-y-3">
            <button
              onClick={handleExportExcel}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 gradient-success text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-soft hover:shadow-elegant"
            >
              <Download className="w-4 h-4" />
              Export to Excel (.xlsx)
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold shadow-soft hover:shadow-elegant"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Inventory
          </h4>
          <button
            onClick={handleImportClick}
            disabled={importing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 gradient-secondary text-white rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold shadow-soft hover:shadow-elegant"
          >
            <Upload className="w-4 h-4" />
            {importing ? 'Importing...' : 'Import from Excel/CSV'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileImport}
            className="hidden"
          />
          <p className="text-xs text-slate-500 font-medium">
            Supports .xlsx, .xls, and .csv files
          </p>
        </div>
      </div>

      {/* Import Status */}
      {importStatus && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          importStatus.type === 'success' 
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-200' 
            : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border-red-200'
        }`}>
          {importStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-semibold">{importStatus.message}</span>
        </div>
      )}

      {/* Export Template */}
      <div className="mt-6 p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200">
        <h5 className="font-semibold text-slate-800 mb-3">Excel Template Format</h5>
        <p className="text-sm text-slate-600 mb-3 font-medium">
          Your Excel file should include these columns:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-500 font-medium">
          <span>• name</span>
          <span>• description</span>
          <span>• category</span>
          <span>• containerType</span>
          <span>• quantity</span>
          <span>• weightPerContainer</span>
          <span>• costPerUnit</span>
          <span>• supplier</span>
          <span>• location</span>
          <span>• expirationDate</span>
          <span>• minimumStock</span>
        </div>
      </div>
    </div>
  );
};