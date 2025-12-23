import React, { useMemo } from 'react';
import { InventoryItem } from '../types/inventory';
import { InventoryItemCard } from './InventoryItemCard';

interface VirtualizedInventoryListProps {
  items: InventoryItem[];
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
  onDeleteItem: (id: string) => void;
  searchTerm: string;
  selectedCategory: string;
}

export function VirtualizedInventoryList({
  items,
  onUpdateItem,
  onDeleteItem,
  searchTerm,
  selectedCategory
}: VirtualizedInventoryListProps) {
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  // Simple grid layout for all list sizes
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map(item => (
        <InventoryItemCard
          key={item.id}
          item={item}
          onUpdate={onUpdateItem}
          onDelete={onDeleteItem}
        />
      ))}
    </div>
  );
}