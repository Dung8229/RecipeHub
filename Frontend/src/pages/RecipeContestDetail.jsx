import React from 'react';

const RecipeContestDetail = () => {
    return (
        <div className="relative flex size-full min-h-screen flex-col bg-[#fcfaf8] group/design-root overflow-x-hidden" style={{ '--checkbox-tick-svg': "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(28,19,13)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')" }}>
            <div className="layout-container flex h-full grow flex-col">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4ece7] px-10 py-3">
                    <div className="flex items-center gap-4 text-[#1c130d]">
                        <div className="size-4">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em]">RecipeHub</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <div className="flex items-center gap-9">
                            <a className="text-[#1c130d] text-sm font-medium leading-normal" href="#">Home</a>
                            <a className="text-[#1c130d] text-sm font-medium leading-normal" href="#">Recipes</a>
                            <a className="text-[#1c130d] text-sm font-medium leading-normal" href="#">Explore</a>
                            <a className="text-[#1c130d] text-sm font-medium leading-normal" href="#">Events</a>
                            <a className="text-[#1c130d] text-sm font-medium leading-normal" href="#">Contests</a>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f47f25] text-[#1c130d] text-sm font-bold leading-normal tracking-[0.015em]">
                                <span className="truncate">Add Recipe</span>
                            </button>
                            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f4ece7] text-[#1c130d] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                                <div className="text-[#1c130d]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
                                    </svg>
                                </div>
                            </button>
                            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f4ece7] text-[#1c130d] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                                <div className="text-[#1c130d]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </header>
                <div className="px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <div className="@container">
                            <div className="@[480px]:p-4">
                                <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url('https://cdn.usegalileo.ai/sdxl10/567906ea-9d24-495a-a188-a90dddd7472e.png')" }}>
                                    <div className="flex flex-col gap-2 text-left">
                                        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">Grilled Chicken Salad</h1>
                                        <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">By Cooks Illustrated</h2>
                                    </div>
                                    <div className="flex-wrap gap-3 flex">
                                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#f47f25] text-[#1c130d] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                                            <span className="truncate">Vote</span>
                                        </button>
                                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#f4ece7] text-[#1c130d] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                                            <span className="truncate">Save Recipe</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex items-stretch p-4 gap-3">
                                {["Ingredients", "Marinated Chicken", "Grilled Chicken", "Mixed Greens", "Assembled Salad"].map((item, index) => (
                                    <div key={index} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                                        <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col" style={{ backgroundImage: `url('https://cdn.usegalileo.ai/sdxl10/${index % 5 === 0 ? 'c95a00b6-e3c8-434e-9ff7-09763f6c7546' : index % 4 === 0 ? '2c1ac3c4-c7d3-4feb-9826-c642e9d92039' : 'b95ed31c-0d3a-43cf-b18c-659db626970f.png'}')` }}>
                                        </div>
                                        <p className="text-[#1c130d] text-base font-medium leading-normal">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <h3 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Ingredients</h3>
                        <div className="px-4">
                            {["2 boneless, skinless chicken breasts", "4 cups mixed greens", "1/2 cup cherry tomatoes, halved", "1/4 red onion, thinly sliced", "1/2 cucumber, sliced", "1/4 cup crumbled feta cheese"].map((ingredient, index) => (
                                <label key={index} className="flex gap-x-3 py-3 flex-row">
                                    <input type="checkbox" className="h-5 w-5 rounded border-[#e8dace] border-2 bg-transparent text-[#f47f25] checked:bg-[#f47f25] checked:border-[#f47f25] focus:ring-0 focus:ring-offset-0 focus:border-[#e8dace] focus:outline-none" checked />
                                    <p className="text-[#1c130d] text-base font-normal leading-normal">{ingredient}</p>
                                </label>
                            ))}
                        </div>
                        <h3 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Directions</h3>
                        <div className="px-4">
                            {["Preheat grill to medium-high heat", "Season chicken breasts with salt and pepper", "Grill chicken for 5-7 minutes per side, or until internal temperature reaches 165°F"].map((step, index) => (
                                <label key={index} className="flex gap-x-3 py-3 flex-row">
                                    <input type="checkbox" className="h-5 w-5 rounded border-[#e8dace] border-2 bg-transparent text-[#f47f25] checked:bg-[#f47f25] checked:border-[#f47f25] focus:ring-0 focus:ring-offset-0 focus:border-[#e8dace] focus:outline-none" checked />
                                    <p className="text-[#1c130d] text-base font-normal leading-normal">{step}</p>
                                </label>
                            ))}
                        </div>
                        <h3 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Nutrition Facts</h3>
                        <div className="p-4">
                            {[
                                { label: "Calories", value: "265" },
                                { label: "Protein", value: "38g" },
                                { label: "Carbs", value: "10g" },
                                { label: "Fat", value: "8g" },
                                { label: "Fiber", value: "3g" }
                            ].map((item, index) => (
                                <div key={index} className="flex justify-between gap-x-6 py-2">
                                    <p className="text-[#9c6d49] text-sm font-normal leading-normal">{item.label}</p>
                                    <p className="text-[#1c130d] text-sm font-normal leading-normal text-right">{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <h3 className="text-[#1c130d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Comments</h3>
                        <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0" style={{ backgroundImage: "url('https://cdn.usegalileo.ai/stability/f1fbbb2c-4991-4c1c-bfd6-6fb5fe85bb77.png')" }}></div>
                            <div className="flex h-full flex-1 flex-col items-start justify-start">
                                <div className="flex w-full flex-row items-start justify-start gap-x-3">
                                    <p className="text-[#1c130d] text-sm font-bold leading-normal tracking-[0.015em]">Emily Watson</p>
                                    <p className="text-[#9c6d49] text-sm font-normal leading-normal">1 hour ago</p>
                                </div>
                                <p className="text-[#1c130d] text-sm font-normal leading-normal">This was so easy to make, and the flavors were delicious!</p>
                                <div className="flex w-full flex-row items-center justify-start gap-9 pt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="text-[#9c6d49]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z" />
                                            </svg>
                                        </div>
                                        <p className="text-[#9c6d49] text-sm font-normal leading-normal">12</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-[#9c6d49]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center px-4 py-3 gap-3 @container">
                            <label className="flex flex-col min-w-40 h-12 flex-1">
                                <input placeholder="Add a public comment..." className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c130d] focus:outline-0 focus:ring-0 border-none bg-[#f4ece7] focus:border-none h-full placeholder:text-[#9c6d49] px-4 text-base font-normal leading-normal" />
                            </label>
                        </div>
                        <h2 className="text-[#1c130d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">More Contest Entries</h2>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                            {[
                                { title: "Classic Margherita Pizza", author: "By RecipeHub", image: "5ad7c2d0-d5ba-4e64-b528-bb09ec65b6c3" },
                                { title: "Chocolate Chip Cookies", author: "By Bon Appétit", image: "7a0b6a70-806c-4560-9f43-923648b7870a" },
                                { title: "Chicken Parmesan", author: "By Food Network", image: "fe492ab7-0bb0-43ab-b031-72bba31cae77" }
                            ].map((entry, index) => (
                                <div key={index} className="flex flex-col gap-3 pb-3">
                                    <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" style={{ backgroundImage: `url('https://cdn.usegalileo.ai/stability/${entry.image}.png')` }}></div>
                                    <div>
                                        <p className="text-[#1c130d] text-base font-medium leading-normal">{entry.title}</p>
                                        <p className="text-[#9c6d49] text-sm font-normal leading-normal">{entry.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeContestDetail;
