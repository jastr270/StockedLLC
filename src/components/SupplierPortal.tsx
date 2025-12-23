import React, { useState } from 'react';
import { Truck, MessageSquare, FileText, Calendar, DollarSign, Package, Star, Phone, Mail, MapPin } from 'lucide-react';

interface SupplierPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupplierMessage {
  id: string;
  supplierId: string;
  supplierName: string;
  type: 'order_confirmation' | 'delivery_update' | 'price_change' | 'promotion' | 'quality_issue';
  subject: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
}

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'delivered';
  orderDate: Date;
  expectedDelivery: Date;
  notes: string;
}

export function SupplierPortal({ isOpen, onClose }: SupplierPortalProps) {
  const [selectedTab, setSelectedTab] = useState<'messages' | 'orders' | 'catalog'>('messages');
  
  const [messages] = useState<SupplierMessage[]>([
    {
      id: '1',
      supplierId: 'sysco',
      supplierName: 'Sysco Corporation',
      type: 'delivery_update',
      subject: 'Delivery Update - Order #12345',
      message: 'Your order is out for delivery and will arrive between 8-10 AM tomorrow.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      actionRequired: false
    },
    {
      id: '2',
      supplierId: 'usfoods',
      supplierName: 'US Foods',
      type: 'promotion',
      subject: 'Special Pricing on Organic Products',
      message: '20% off all organic items this week. Order by Friday to qualify.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: false,
      actionRequired: true
    },
    {
      id: '3',
      supplierId: 'sysco',
      supplierName: 'Sysco Corporation',
      type: 'price_change',
      subject: 'Price Update - Rice Products',
      message: 'Due to market conditions, rice prices will increase by 8% starting next month.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: true,
      actionRequired: true
    }
  ]);

  const [orders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-2024-001',
      supplierId: 'sysco',
      supplierName: 'Sysco Corporation',
      items: [
        { name: 'White Rice (25 lbs)', quantity: 10, unit: 'bags', unitPrice: 18.50, totalPrice: 185.00 },
        { name: 'Black Beans (25 lbs)', quantity: 5, unit: 'bags', unitPrice: 22.00, totalPrice: 110.00 }
      ],
      totalAmount: 295.00,
      status: 'confirmed',
      orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expectedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      notes: 'Deliver to back entrance, call when arriving'
    },
    {
      id: 'PO-2024-002',
      supplierId: 'usfoods',
      supplierName: 'US Foods',
      items: [
        { name: 'All-Purpose Flour (25 lbs)', quantity: 8, unit: 'bags', unitPrice: 12.75, totalPrice: 102.00 },
        { name: 'Whole Milk (1 gal)', quantity: 12, unit: 'gallons', unitPrice: 3.85, totalPrice: 46.20 }
      ],
      totalAmount: 148.20,
      status: 'shipped',
      orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      notes: 'Regular weekly delivery'
    }
  ]);

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'delivery_update': return <Truck className="w-4 h-4 text-blue-600" />;
      case 'promotion': return <Star className="w-4 h-4 text-amber-600" />;
      case 'price_change': return <DollarSign className="w-4 h-4 text-red-600" />;
      case 'order_confirmation': return <FileText className="w-4 h-4 text-green-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'sent': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-soft">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Supplier Portal</h2>
              <p className="text-sm text-gray-600 font-medium">Direct communication and ordering with suppliers</p>
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
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages.filter(m => !m.isRead).length },
              { id: 'orders', label: 'Purchase Orders', icon: FileText, count: orders.filter(o => o.status === 'sent').length },
              { id: 'catalog', label: 'Product Catalog', icon: Package, count: 0 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-semibold transition-all duration-300 relative ${
                    selectedTab === tab.id
                      ? 'bg-blue-500 text-white shadow-soft'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Messages Tab */}
          {selectedTab === 'messages' && (
            <div className="space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`rounded-2xl p-6 shadow-soft border-2 ${
                  !message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-soft">
                        {getMessageTypeIcon(message.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{message.subject}</h4>
                          {message.actionRequired && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 font-semibold mb-2">{message.supplierName}</p>
                        <p className="text-gray-700 font-medium">{message.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 font-semibold">
                        {format(message.timestamp, 'MMM dd, HH:mm')}
                      </p>
                      {!message.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-auto"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Orders Tab */}
          {selectedTab === 'orders' && (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{order.id}</h4>
                      <p className="text-gray-600 font-semibold">{order.supplierName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Expected: {format(order.expectedDelivery, 'MMM dd')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-900">{item.name}</span>
                        <div className="text-right">
                          <span className="font-bold text-gray-900">{item.quantity} {item.unit}</span>
                          <p className="text-sm text-gray-600">${item.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="font-bold text-gray-700">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Catalog Tab */}
          {selectedTab === 'catalog' && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">Supplier Catalog Integration</h3>
              <p className="text-gray-500 font-medium mb-6">
                Browse products directly from your suppliers' catalogs
              </p>
              <button className="px-6 py-3 gradient-primary text-white rounded-xl hover:scale-105 transition-all duration-300 font-bold shadow-soft">
                Connect Supplier Catalogs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}