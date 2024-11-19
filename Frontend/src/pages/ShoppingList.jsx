import React from 'react';

const ShoppingList = () => {
  return (
    <div className="w-[1440px] min-h-screen bg-white">
      {/* Header */}
      <header className="w-full h-[170px] bg-white">
        <div className="w-full h-[106px] flex justify-center items-center gap-20">
          <div className="text-[#ff8c00] text-8xl font-bold font-['Qwitcher Grypen']">
            Recipehub
          </div>
          
          <div className="relative w-[603px] h-[58px]">
            <input 
              type="text"
              placeholder="Find a recipe or ingredient"
              className="w-full h-full px-4 rounded-[10px] border border-black"
            />
            <button className="absolute right-0 w-[58px] h-full bg-[#ff8c00] rounded-tr-[10px] rounded-br-[10px] border border-black">
              {/* Search icon */}
            </button>
          </div>

          <div className="flex items-center gap-[15px]">
            <img className="w-[58px] h-[58px]" src="/login-icon.png" alt="Login" />
            <span className="text-black text-xl font-medium font-['Poppins']">LOG IN</span>
          </div>
        </div>

        <nav className="h-16 flex justify-center items-center gap-[110px]">
          {['HOME', 'DINNER', 'VEGETARIAN', 'CONTESTS', 'SHOPPING LIST', 'CONTACT'].map(item => (
            <a key={item} className="text-black text-xl font-medium font-['Poppins']">{item}</a>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex px-6 py-5 gap-4 bg-neutral-100">
        {/* Shopping List Section */}
        <div className="w-[912px]">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-[#707070] text-[32px] font-medium font-['Poppins']">
              Shopping lists
            </h1>
            <img className="w-[50px] h-[50px]" src="/pdf-icon.png" alt="PDF" />
          </div>

          {/* Shopping List Table */}
          <div className="bg-white rounded-xl border border-[#d9d9d9] mt-6">
            {/* Table headers */}
            <div className="grid grid-cols-3 p-4 border-b border-[#e5e8ea]">
              <div className="text-[#141414] text-sm font-medium">Item</div>
              <div className="text-[#141414] text-sm font-medium">Quantities</div>
              <div></div>
            </div>

            {/* Table items */}
            {/* Repeat this structure for each item */}
            <div className="grid grid-cols-3 p-4 border-b border-[#e5e8ea]">
              <div className="text-[#141414] text-sm">Bananas</div>
              <div className="text-[#707070] text-sm">2</div>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-[#ff8c00] rounded-2xl text-white text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-4">
            <button className="w-[480px] h-12 bg-[#ff8c00] rounded-3xl text-white font-bold">
              Add Items
            </button>
            <button className="w-[480px] h-12 bg-[#e8e8e8] rounded-3xl text-[#141414] font-bold">
              Reset
            </button>
          </div>
        </div>

        {/* Selected Recipes Section */}
        <div className="w-[360px]">
          {/* Component implementation continues... */}
        </div>
      </main>

      {/* Footer component implementation... */}
    </div>
  );
};

export default ShoppingList; 