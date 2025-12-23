import React, { useState } from 'react';
import { Calculator, ChefHat, Users, Clock, Utensils } from 'lucide-react';
import { InventoryItem } from '../types/inventory';

interface RecipeCalculatorProps {
  items: InventoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

interface RecipeIngredient {
  itemId: string;
  name: string;
  amountNeeded: number;
  unit: string;
  available: number;
  sufficient: boolean;
}

const popularRecipes = [
  {
    name: 'Fried Rice (100 servings)',
    ingredients: [
      { name: 'White Rice (Long Grain)', amount: 12.5, unit: 'cups' },
      { name: 'Vegetable Oil', amount: 0.5, unit: 'cups' },
      { name: 'Soy Sauce', amount: 0.75, unit: 'cups' },
      { name: 'Eggs', amount: 12, unit: 'pieces' }
    ]
  },
  {
    name: 'Bean and Rice Bowl (50 servings)',
    ingredients: [
      { name: 'Brown Rice', amount: 6.25, unit: 'cups' },
      { name: 'Black Beans', amount: 4, unit: 'cups' },
      { name: 'Vegetable Broth', amount: 8, unit: 'cups' }
    ]
  },
  {
    name: 'Flour Tortillas (200 pieces)',
    ingredients: [
      { name: 'All-Purpose Flour', amount: 8, unit: 'cups' },
      { name: 'Salt', amount: 2, unit: 'tablespoons' },
      { name: 'Vegetable Oil', amount: 0.5, unit: 'cups' }
    ]
  },
  {
    name: 'Grilled Salmon (50 servings)',
    ingredients: [
      { name: 'Atlantic Salmon Fillet', amount: 18.75, unit: 'lbs' },
      { name: 'Olive Oil', amount: 0.25, unit: 'cups' },
      { name: 'Lemon', amount: 10, unit: 'pieces' }
    ]
  },
  {
    name: 'Sushi Rice (100 servings)',
    ingredients: [
      { name: 'White Rice', amount: 10, unit: 'cups' },
      { name: 'Rice Vinegar', amount: 0.75, unit: 'cups' },
      { name: 'Sugar', amount: 0.5, unit: 'cups' },
      { name: 'Salt', amount: 2, unit: 'tablespoons' }
    ]
  }
];

export function RecipeCalculator({ items, isOpen, onClose }: RecipeCalculatorProps) {
  const [selectedRecipe, setSelectedRecipe] = useState(popularRecipes[0]);
  const [servings, setServings] = useState(100);

  const calculateIngredientNeeds = (): RecipeIngredient[] => {
    const scaleFactor = servings / 100; // Base recipes are for 100 servings
    
    return selectedRecipe.ingredients.map(ingredient => {
      const scaledAmount = ingredient.amount * scaleFactor;
      
      // Find matching inventory item
      const inventoryItem = items.find(item => 
        item.name.toLowerCase().includes(ingredient.name.toLowerCase()) ||
        ingredient.name.toLowerCase().includes(item.name.toLowerCase())
      );

      let available = 0;
      let sufficient = false;

      if (inventoryItem) {
        if (ingredient.unit === 'cups' && inventoryItem.isDryGood && inventoryItem.densityLbsPerCup) {
          // Convert weight to cups for dry goods
          available = inventoryItem.totalWeightLbs / inventoryItem.densityLbsPerCup;
        } else {
          available = inventoryItem.quantity;
        }
        sufficient = available >= scaledAmount;
      }

      return {
        itemId: inventoryItem?.id || '',
        name: ingredient.name,
        amountNeeded: scaledAmount,
        unit: ingredient.unit,
        available,
        sufficient
      };
    });
  };

  const ingredientNeeds = calculateIngredientNeeds();
  const canMakeRecipe = ingredientNeeds.every(ing => ing.sufficient);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-3xl shadow-elegant w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl shadow-soft">
              <ChefHat className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recipe Calculator</h2>
              <p className="text-sm text-gray-600 font-medium">Check ingredient availability for recipes</p>
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
          {/* Recipe Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Select Recipe</label>
              <select
                value={selectedRecipe.name}
                onChange={(e) => setSelectedRecipe(popularRecipes.find(r => r.name === e.target.value) || popularRecipes[0])}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              >
                {popularRecipes.map(recipe => (
                  <option key={recipe.name} value={recipe.name}>{recipe.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Number of Servings</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm font-medium shadow-soft"
              />
            </div>
          </div>

          {/* Recipe Status */}
          <div className={`p-6 rounded-2xl border-2 shadow-soft ${
            canMakeRecipe 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <Utensils className={`w-6 h-6 ${canMakeRecipe ? 'text-green-600' : 'text-red-600'}`} />
              <h3 className={`text-lg font-bold ${canMakeRecipe ? 'text-green-800' : 'text-red-800'}`}>
                {canMakeRecipe ? 'Recipe Ready to Make!' : 'Insufficient Ingredients'}
              </h3>
            </div>
            <p className={`text-sm font-semibold ${canMakeRecipe ? 'text-green-700' : 'text-red-700'}`}>
              {canMakeRecipe 
                ? `You have all ingredients needed for ${servings} servings of ${selectedRecipe.name}`
                : 'Some ingredients are missing or insufficient. Check the list below.'
              }
            </p>
          </div>

          {/* Ingredient Requirements */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Ingredient Requirements</h4>
            <div className="space-y-3">
              {ingredientNeeds.map((ingredient, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 shadow-soft ${
                  ingredient.sufficient 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{ingredient.name}</p>
                      <p className="text-sm text-gray-600">
                        Need: {ingredient.amountNeeded.toFixed(1)} {ingredient.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${ingredient.sufficient ? 'text-green-700' : 'text-red-700'}`}>
                        {ingredient.sufficient ? '✓ Available' : '✗ Insufficient'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Have: {ingredient.available.toFixed(1)} {ingredient.unit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shopping List */}
          {!canMakeRecipe && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-soft">
              <h4 className="text-lg font-bold text-blue-900 mb-4">Shopping List</h4>
              <div className="space-y-2">
                {ingredientNeeds.filter(ing => !ing.sufficient).map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-soft">
                    <span className="font-semibold text-gray-900">{ingredient.name}</span>
                    <span className="text-blue-700 font-bold">
                      Need {(ingredient.amountNeeded - ingredient.available).toFixed(1)} more {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}