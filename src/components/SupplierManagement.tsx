import React, { useState } from 'react';
import { Truck, Phone, Mail, MapPin, Star, DollarSign, Calendar, Package, Plus, Edit, Trash2 } from 'lucide-react';
import { InventoryItem } from '../types/inventory';

interface SupplierManagementProps {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  categories: string[];
  paymentTerms: string;
  deliveryDays: string[];
  minimumOrder: number;
  notes: string;
  lastOrderDate?: Date;
  totalOrders: number;
  averageDeliveryTime: number;
  qualityScore: number;
  priceCompetitiveness: number;
}

export function SupplierManagement({ items, isOpen, onClose }: SupplierManagementProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Sysco Corporation',
      contactPerson: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john.smith@sysco.com',
      address: '1390 Enclave Pkwy, Houston, TX 77077',
      rating: 4.5,
      categories: ['Rice & Grains', 'Proteins', 'Frozen Foods'],
      paymentTerms: 'Net 30',
      deliveryDays: ['Monday', 'Wednesday', 'Friday'],
      minimumOrder: 500,
      notes: 'Reliable supplier with excellent quality control',
      lastOrderDate: new Date('2024-01-15'),
      totalOrders: 156,
      averageDeliveryTime: 2.3,
      qualityScore: 4.6,
      priceCompetitiveness: 4.2
    },
    {
      id: '2',
      name: 'US Foods',
      contactPerson: 'Sarah Johnson',
      phone: '(555) 987-6543',
      email: 'sarah.johnson@usfoods.com',
      address: '9399 W Higgins Rd, Rosemont, IL 60018',
      rating: 4.3,
      categories: ['Flour & Baking', 'Dairy & Eggs', 'Beverages'],
      paymentTerms: 'Net 15',
      deliveryDays: ['Tuesday', 'Thursday', 'Saturday'],
      minimumOrder: 300,
      notes: 'Great for specialty items and organic products',
      lastOrderDate: new Date('2024-01-12'),
      totalOrders: 89,
      averageDeliveryTime: 1.8,
      qualityScore: 4.4,
      priceCompetitiveness: 4.0
    }
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Supplier>>({});

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditForm(supplier);
    setIsEditing(true);
  };

  const handleSaveSupplier = () => {
    if (selectedSupplier && editForm.name) {
      setSuppliers(prev => prev.map(s => 
        s.id === selectedSupplier.id ? { ...selectedSupplier, ...editForm } : s
      ));
      setIsEditing(false);
      setSelectedSupplier(null);
    }
  };

  const getSupplierItems = (supplierName: string) => {
    return items.filter(item => item.supplier === supplierName);
  };

  const getSupplierValue = (supplierName: string) => {
    return getSupplierItems(supplierName).reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-soft">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
              <p className="text-sm text-gray-600 font-medium">Manage vendor relationships and performance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110 shadow-soft"
          >
            ×
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Supplier Performance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 text-green-600" />
                <span className="font-bold text-green-800">Avg Rating</span>
              </div>
              <p className="text-3xl font-bold text-green-700">
                {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
              </p>
              <p className="text-sm text-green-600">Supplier performance</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-blue-800">Avg Delivery</span>
              </div>
              <p className="text-3xl font-bold text-blue-700">
                {(suppliers.reduce((sum, s) => sum + s.averageDeliveryTime, 0) / suppliers.length).toFixed(1)}d
              </p>
              <p className="text-sm text-blue-600">Average delivery time</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-800">Total Orders</span>
              </div>
              <p className="text-3xl font-bold text-purple-700">
                {suppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
              </p>
              <p className="text-sm text-purple-600">This year</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-800">Total Value</span>
              </div>
              <p className="text-3xl font-bold text-amber-700">
                ${suppliers.reduce((sum, s) => sum + getSupplierValue(s.name), 0).toLocaleString()}
              </p>
              <p className="text-sm text-amber-600">Current inventory value</p>
            </div>
          </div>

          {/* Supplier Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-200 rounded-2xl p-6 shadow-soft">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{supplier.name}</h3>
                    <p className="text-gray-600 font-semibold">{supplier.contactPerson}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(supplier.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-bold text-gray-700">{supplier.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSupplier(supplier)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-700">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-700">{supplier.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="font-semibold text-gray-700">{supplier.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">PAYMENT TERMS</p>
                    <p className="font-bold text-gray-800">{supplier.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">MIN ORDER</p>
                    <p className="font-bold text-gray-800">${supplier.minimumOrder}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">DELIVERY DAYS</p>
                    <p className="font-bold text-gray-800">{supplier.deliveryDays.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">INVENTORY VALUE</p>
                    <p className="font-bold text-gray-800">${getSupplierValue(supplier.name).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold mb-2">CATEGORIES</p>
                  <div className="flex flex-wrap gap-2">
                    {supplier.categories.map(category => (
                      <span key={category} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">{supplier.qualityScore}/5</p>
                      <p className="text-xs text-gray-500 font-semibold">Quality</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">{supplier.averageDeliveryTime}d</p>
                      <p className="text-xs text-gray-500 font-semibold">Delivery</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">{supplier.priceCompetitiveness}/5</p>
                      <p className="text-xs text-gray-500 font-semibold">Price</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Analytics */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">Supplier Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-soft">
                <h4 className="font-semibold text-gray-900 mb-2">Top Performer</h4>
                <p className="text-lg font-bold text-green-600">
                  {suppliers.sort((a, b) => b.rating - a.rating)[0]?.name}
                </p>
                <p className="text-sm text-gray-600">Highest overall rating</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-soft">
                <h4 className="font-semibold text-gray-900 mb-2">Fastest Delivery</h4>
                <p className="text-lg font-bold text-blue-600">
                  {suppliers.sort((a, b) => a.averageDeliveryTime - b.averageDeliveryTime)[0]?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {suppliers.sort((a, b) => a.averageDeliveryTime - b.averageDeliveryTime)[0]?.averageDeliveryTime}d average
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-soft">
                <h4 className="font-semibold text-gray-900 mb-2">Best Value</h4>
                <p className="text-lg font-bold text-purple-600">
                  {suppliers.sort((a, b) => b.priceCompetitiveness - a.priceCompetitiveness)[0]?.name}
                </p>
                <p className="text-sm text-gray-600">Most competitive pricing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}