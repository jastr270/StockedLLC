import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';
import { InventoryItem } from '../types/inventory';
import { format } from 'date-fns';

interface ReportsExportProps {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function ReportsExport({ items, isOpen, onClose }: ReportsExportProps) {
  const [reportType, setReportType] = useState<'inventory' | 'valuation' | 'expiration' | 'lowstock'>('inventory');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');

  const generateReport = () => {
    let reportData: any[] = [];
    let filename = '';

    const today = new Date();
    const dateStr = format(today, 'yyyy-MM-dd');

    switch (reportType) {
      case 'inventory':
        reportData = items.map(item => ({
          'Item Name': item.name,
          'Category': item.category,
          'Quantity': item.quantity,
          'Container Type': item.containerType,
          'Weight per Container (lbs)': item.weightPerContainer,
          'Total Weight (lbs)': item.totalWeightLbs,
          'Location': item.location,
          'Supplier': item.supplier,
          'Last Updated': format(new Date(item.updatedAt), 'MM/dd/yyyy')
        }));
        filename = `inventory-report-${dateStr}`;
        break;

      case 'valuation':
        reportData = items.map(item => ({
          'Item Name': item.name,
          'Category': item.category,
          'Quantity': item.quantity,
          'Cost per Unit': `$${item.costPerUnit.toFixed(2)}`,
          'Total Value': `$${(item.quantity * item.costPerUnit).toFixed(2)}`,
          'Supplier': item.supplier,
          'Location': item.location
        }));
        filename = `valuation-report-${dateStr}`;
        break;

      case 'expiration':
        reportData = items
          .filter(item => item.expirationDate)
          .map(item => {
            const expDate = new Date(item.expirationDate!);
            const daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return {
              'Item Name': item.name,
              'Category': item.category,
              'Expiration Date': format(expDate, 'MM/dd/yyyy'),
              'Days Until Expiry': daysUntilExpiry,
              'Status': daysUntilExpiry < 0 ? 'EXPIRED' : daysUntilExpiry <= 3 ? 'CRITICAL' : daysUntilExpiry <= 7 ? 'WARNING' : 'OK',
              'Quantity': item.quantity,
              'Value at Risk': `$${(item.quantity * item.costPerUnit).toFixed(2)}`,
              'Location': item.location
            };
          })
          .sort((a, b) => a['Days Until Expiry'] - b['Days Until Expiry']);
        filename = `expiration-report-${dateStr}`;
        break;

      case 'lowstock':
        reportData = items
          .filter(item => item.quantity <= item.minimumStock)
          .map(item => ({
            'Item Name': item.name,
            'Category': item.category,
            'Current Quantity': item.quantity,
            'Minimum Stock': item.minimumStock,
            'Shortage': Math.max(0, item.minimumStock - item.quantity),
            'Reorder Cost': `$${(Math.max(0, item.minimumStock - item.quantity) * item.costPerUnit).toFixed(2)}`,
            'Supplier': item.supplier,
            'Location': item.location,
            'Status': item.quantity === 0 ? 'OUT OF STOCK' : 'LOW STOCK'
          }));
        filename = `low-stock-report-${dateStr}`;
        break;
    }

    // Convert to CSV and download
    const headers = Object.keys(reportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-2xl">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-soft">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Export Reports</h2>
              <p className="text-sm text-gray-600 font-medium">Generate professional inventory reports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Report Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'inventory', label: 'Full Inventory', icon: Package, desc: 'Complete item listing' },
                { id: 'valuation', label: 'Valuation Report', icon: DollarSign, desc: 'Cost and value analysis' },
                { id: 'expiration', label: 'Expiration Tracking', icon: Calendar, desc: 'Items by expiry date' },
                { id: 'lowstock', label: 'Low Stock Alert', icon: TrendingUp, desc: 'Reorder recommendations' }
              ].map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id as any)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      reportType === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-soft'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-5 h-5 ${reportType === type.id ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className={`font-bold ${reportType === type.id ? 'text-blue-900' : 'text-gray-700'}`}>
                        {type.label}
                      </span>
                    </div>
                    <p className={`text-sm ${reportType === type.id ? 'text-blue-700' : 'text-gray-500'}`}>
                      {type.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report Preview */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200 shadow-soft">
            <h4 className="font-bold text-gray-800 mb-3">Report Preview</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {reportType === 'inventory' && (
                <>
                  <p>• Complete inventory listing with weights and locations</p>
                  <p>• Container types and supplier information</p>
                  <p>• Last updated timestamps</p>
                </>
              )}
              {reportType === 'valuation' && (
                <>
                  <p>• Cost analysis by item and category</p>
                  <p>• Total inventory value calculations</p>
                  <p>• Supplier cost breakdown</p>
                </>
              )}
              {reportType === 'expiration' && (
                <>
                  <p>• Items sorted by expiration date</p>
                  <p>• Critical, warning, and expired items</p>
                  <p>• Value at risk calculations</p>
                </>
              )}
              {reportType === 'lowstock' && (
                <>
                  <p>• Items below minimum stock levels</p>
                  <p>• Reorder quantities and costs</p>
                  <p>• Supplier contact information</p>
                </>
              )}
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={generateReport}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 gradient-success text-white rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-elegant hover:shadow-glow"
          >
            <Download className="w-5 h-5" />
            Generate & Download Report
          </button>
        </div>
      </div>
    </div>
  );
}