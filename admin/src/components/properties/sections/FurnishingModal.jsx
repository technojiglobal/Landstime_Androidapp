// admin/src/components/properties/sections/FurnishingModal.jsx
import React from 'react';

const FurnishingModal = ({ isOpen, furnishingType, selectedItems, onClose, onItemToggle }) => {
  if (!isOpen) return null;

  const counterItems = [
    'Light',
    'Fans',
    'AC',
    'TV',
    'Beds',
    'Wardrobe',
    'Geyser',
    'Sofa',
  ];

  const checkboxItems = [
    'Washing Machine',
    'Stove',
    'Fridge',
    'Water Purifier',
    'Microwave',
    'Modular Kitchen',
    'Chimney',
    'Dinning Table',
    'Curtains',
    'Exhaust Fan',
  ];

  // Get count for a specific item
  const getItemCount = (item) => {
    const itemData = selectedItems?.find(i => i.name === item);
    return itemData?.count || 0;
  };

  // Increment count
  const incrementCount = (item) => {
    const currentItems = selectedItems || [];
    const existingItem = currentItems.find(i => i.name === item);
    
    if (existingItem) {
      const updatedItems = currentItems.map(i => 
        i.name === item ? { ...i, count: i.count + 1 } : i
      );
      onItemToggle(updatedItems);
    } else {
      onItemToggle([...currentItems, { name: item, count: 1 }]);
    }
  };

  // Decrement count
  const decrementCount = (item) => {
    const currentItems = selectedItems || [];
    const existingItem = currentItems.find(i => i.name === item);
    
    if (existingItem && existingItem.count > 0) {
      if (existingItem.count === 1) {
        // Remove item if count becomes 0
        onItemToggle(currentItems.filter(i => i.name !== item));
      } else {
        const updatedItems = currentItems.map(i => 
          i.name === item ? { ...i, count: i.count - 1 } : i
        );
        onItemToggle(updatedItems);
      }
    }
  };

  // Toggle checkbox item
  const toggleCheckboxItem = (item) => {
    const currentItems = selectedItems || [];
    const existingItem = currentItems.find(i => i.name === item);
    
    if (existingItem) {
      // Remove item
      onItemToggle(currentItems.filter(i => i.name !== item));
    } else {
      // Add item with count 1
      onItemToggle([...currentItems, { name: item, count: 1 }]);
    }
  };

  // Check if checkbox item is selected
  const isCheckboxSelected = (item) => {
    return selectedItems?.some(i => i.name === item) || false;
  };

  // Count total selected items
  // Clear all selections
  const clearAll = () => {
    onItemToggle([]);
  };

  const totalSelected = selectedItems?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b">
          <div className="flex items-center mb-1">
            <button
              onClick={onClose}
              className="mr-3 text-gray-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Add Furnishings</h2>
              <p className="text-xs text-gray-400">
                Atleast 1 selection is mandatory
              </p>
            </div>
            <button
              onClick={clearAll}
              className="text-green-500 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {/* Counter Items */}
            {counterItems.map((item) => {
              const count = getItemCount(item);
              return (
                <div
                  key={item}
                  className="flex items-center justify-between py-3 border-b border-gray-100"
                >
                  <span className="text-gray-700 text-base">{item}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm min-w-[20px] text-center">
                      {count}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrementCount(item)}
                        disabled={count === 0}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          count === 0
                            ? 'border-gray-200 text-gray-300'
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => incrementCount(item)}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 text-gray-600 hover:border-gray-400 flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Checkbox Items */}
            {checkboxItems.map((item) => {
              const isSelected = isCheckboxSelected(item);
              return (
                <div
                  key={item}
                  className="flex items-center justify-between py-3 border-b border-gray-100"
                >
                  <span className="text-gray-700 text-base">{item}</span>
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCheckboxItem(item)}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={onClose}
            disabled={totalSelected === 0}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              totalSelected === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FurnishingModal;