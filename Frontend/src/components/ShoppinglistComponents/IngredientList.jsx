import React from 'react';

const IngredientList = ({ ingredients, onEdit, onRemove }) => {
  return (
    <div className="bg-white rounded-xl border border-[#d9d9d9] p-4">
      {/* Table headers */}
      <div className="grid grid-cols-3 p-4 border-b border-[#e5e8ea]">
        <div className="text-[#141414] text-sm font-medium">Item</div>
        <div className="text-[#141414] text-sm font-medium">Quantities</div>
        <div></div>
      </div>

      {/* Table items */}
      {ingredients.map((ingredient) => (
        <div key={ingredient.id} className="grid grid-cols-3 p-4 border-b border-[#e5e8ea]">
          <div className="flex items-center gap-2">
            {ingredient.image && (
              <img src={ingredient.image} alt={ingredient.name} className="w-8 h-8 rounded" />
            )}
            <span className="text-[#141414] text-sm">{ingredient.name}</span>
          </div>
          <div className="text-[#707070] text-sm">
            <input
              type="number"
              value={ingredient.quantity}
              onChange={(e) => onEdit(ingredient.id, e.target.value)}
              className="w-20 p-1 border rounded"
            />
            {ingredient.unit}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => onRemove(ingredient.id)}
              className="px-4 py-2 bg-red-500 rounded-2xl text-white text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IngredientList; 