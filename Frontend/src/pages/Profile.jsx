import React from 'react';

const Profile = () => {
    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#1c130d] text-[32px] font-bold leading-tight">Account settings</p>
                </div>
                <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 min-h-14">
                    <div className="text-[#1c130d] flex items-center justify-center rounded-lg bg-[#f4ece7] size-10">
                        {/* Profile photo icon */}
                    </div>
                    <p className="text-[#1c130d] text-base font-normal flex-1 truncate">Profile photo</p>
                </div>

                {/* Display name */}
                <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">Display name</p>
                        <p className="text-[#9c6d49] text-sm">Your display name will be used...</p>
                    </div>
                    <div>
                        <p className="text-[#1c130d]">Jane</p>
                    </div>
                </div>
                {/* User name */}
                <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">User name</p>
                        <p className="text-[#9c6d49] text-sm">Your username will be used to access your account and log in.</p>
                    </div>
                    <div>
                        <p className="text-[#1c130d]">@janeandrews4</p>
                    </div>
                </div>
                {/* Email Setting */}
                <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">Email</p>
                        <p className="text-[#9c6d49] text-sm"></p>
                    </div>
                    <div>
                        <p className="text-[#1c130d]"> bchjwcbhjs@gmail.com</p>
                    </div>
                </div>
                <div className="flex px-4 py-3 justify-start">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f4ece7] text-[#1c130d] text-sm font-bold leading-normal tracking-[0.015em]">
                        <span className="truncate">Change password</span>
                    </button>
                </div>
                {/*RecipeHub */}
                <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#1c130d] text-[22px] font-bold leading-tight">Your recipe box</p>
                </div>
                <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">Liked Recipes</p>
                        <p className="text-[#9c6d49] text-sm">View all of your liked recipes</p>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                        </svg>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">Submitted recipes</p>
                        <p className="text-[#9c6d49] text-sm">View all of your submitted recipes</p>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                        </svg>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">Add a recipe</p>
                        <p className="text-[#9c6d49] text-sm">Add a new recipe to your</p>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
