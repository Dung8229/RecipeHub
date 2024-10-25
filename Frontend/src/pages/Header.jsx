import React from 'react';

const Header = () => {
    return (
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
    );
};

export default Header;
