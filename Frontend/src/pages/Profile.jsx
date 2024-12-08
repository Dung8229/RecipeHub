import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserImage, changePassword } from '../services/users';
import { updateToken, logout } from '../services/token';
import tokenService from '../services/token'
import { postImage } from '../services/image';

const Profile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showImageDialog, setShowImageDialog] = useState(false); // State quản lý hộp thoại upload ảnh
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await tokenService.getUserInfo();
                console.log('Profile user info:', userInfo)
                setUser(userInfo);

                if (!userInfo) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            console.error('No file selected');
            return;
        }
        try {
            let imageUrl = await postImage(selectedFile);
            imageUrl = 'http://localhost:3000/' + imageUrl;

            setUser((prevUser) => ({
                ...prevUser,
                image: imageUrl,
            }));

            await updateUserImage(user.id, imageUrl);
            setShowImageDialog(false); // Đóng hộp thoại sau khi upload thành công
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        try {
            await changePassword(user.id, currentPassword, newPassword);
            setPasswordSuccess('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordDialog(false); // Đóng hộp thoại sau khi thành công
            //await updateToken();
        } catch (error) {
            setPasswordError('Error changing password. Please try again.');
            console.error('Error changing password:', error);
        }
    };

    const navigateTo = (path) => {
        navigate(path);
    }
    if (!user) {
        return <div>Loading...</div>;
    }



    return (
        <div className="px-40 flex flex-1 justify-center">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1 ">
                <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#1c130d] text-[32px] font-bold leading-tight">Account settings</p>
                </div>

                {/* Profile photo */}
                <div className="flex items-center gap-4  px-4 min-h-14">
                    {user && user.image && (
                        <img
                            src={user.image}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    )}
                    <p className="text-[#1c130d] text-base font-normal flex-1 truncate">Profile photo</p>
                </div>

                {/* Button for uploading image */}
                <div className="flex px-4 py-3 justify-start">
                    <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f4ece7] text-[#1c130d] text-sm font-bold"
                        onClick={() => setShowImageDialog(true)}
                    >
                        Upload image
                    </button>
                </div>

                {/* Upload image dialog */}
                {showImageDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-lg font-bold mb-4">Upload Image</h3>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="mb-4 border border-gray-300 p-2 w-full rounded"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowImageDialog(false)}
                                    className="bg-gray-200 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Display name */}
                {/* <div className="flex items-center gap-4  px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">Display name</p>
                        <p className="text-[#9c6d49] text-sm">Your display name will be used...</p>
                    </div>
                    <div>
                        <p className="text-[#1c130d]">{user.display_name}</p>
                    </div>
                </div> */}
                {/* User name */}
                <div className="flex items-center gap-4  px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">Username</p>
                        <p className="text-[#9c6d49] text-sm">Your username will be used to access your account and log in.</p>
                    </div>
                    <div>
                        <p className="text-[#1c130d]">{user?.username}</p>
                    </div>
                </div>
                {/* Email Setting */}
                <div className="flex items-center gap-4  px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">Email</p>
                        <p className="text-[#9c6d49] text-sm">Your email will be used to access your account and log in.</p>
                    </div>
                    <div>
                        <p className="text-[#1c130d]">{user?.email}</p>
                    </div>
                </div>

                {/* Change password button */}
                <div className="flex px-4 py-3 justify-start">
                    <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f4ece7] text-[#1c130d] text-sm font-bold"
                        onClick={() => setShowPasswordDialog(true)}
                    >
                        Change password
                    </button>
                </div>

                {/* Password dialog */}
                {showPasswordDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-lg font-bold mb-4">Change Password</h3>
                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                            {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}

                            <form onSubmit={handleChangePassword}>
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded mb-2"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordDialog(false)}
                                        className="bg-gray-200 px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/*RecipeHub */}
                <div className="flex flex-wrap justify-between gap-3 p-4">
                    <p className="text-[#1c130d] text-[22px] font-bold leading-tight">Your recipe box</p>
                </div>
                <div onClick={() => navigateTo('/favourite')} className="flex items-center gap-4  px-4 py-2 justify-between">
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
                <div onClick={() => navigateTo('/recipes/my-recipes')} className="flex items-center gap-4  px-4 py-2 justify-between">
                    <div>
                        <p className="text-[#1c130d] text-base font-medium">Submitted recipes</p>
                        <p className="text-[#9c6d49] text-sm">View all of your submitted recipes</p>
                    </div>
                    <div >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                        </svg>
                    </div>
                </div>
                <div onClick={() => navigateTo('/recipes/create')} className="flex items-center gap-4  px-4 py-2 justify-between">
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
