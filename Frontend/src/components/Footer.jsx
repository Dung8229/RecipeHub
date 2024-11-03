import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="bg-gray-100 p-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
            
            {/* Logo */}
            <div>
            <h2 className="text-7xl font-bold text-orange-500">RecipeHub</h2>
            </div>
            
            {/* Các phần con */}
            <div className="flex flex-col space-y-4">
                {/* Join us */}
                <div>
                    <h3 className="font-semibold">Join us</h3>
                    <form className="flex mt-2 space-x-1">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="border w-72 border-gray-300 p-2 rounded-lg"
                        />
                        <button className="bg-primary text-white p-2 rounded-lg hover:bg-primaryHover">
                            SIGN UP
                        </button>
                    </form>
                </div>
                
                {/* Follow us */}
                <div className="container mx-auto flex items-center space-x-4 mt-4">
                    <span className="font-semibold">Follow us</span>
                    <div className="flex space-x-4 mt-2">
                        <a href="#" className="text-black text-2xl hover:text-gray-700">
                            <FontAwesomeIcon icon={faFacebook} className='w-10 h-10 hover:text-blue-500'/>
                        </a>
                        <a href="#" className="text-black text-2xl hover:text-gray-700">
                            <FontAwesomeIcon icon={faInstagram} className='w-10 h-10 hover:text-pink-500'/>
                        </a>
                        <a href="#" className="text-black text-2xl hover:text-gray-700">
                            <FontAwesomeIcon icon={faTwitter} className='w-10 h-10 hover:text-blue-500'/>
                        </a>
                    </div>
                </div>
                
                {/* Contact */}
                <div>
                    <p className="text-gray-600">VNU University of Engineering and Technology – VNU-UET</p>
                </div>
            </div>

            {/* Liên kết */}
            <div className="space-y-2 text-sm text-gray-600">
            <a href="#" className="block hover:underline">Home</a>
            <a href="#" className="block hover:underline">Dinner</a>
            <a href="#" className="block hover:underline">Vegetarian</a>
            <a href="#" className="block hover:underline">Contests</a>
            <a href="#" className="block hover:underline">Shopping List</a>
            <a href="#" className="block hover:underline">Contact</a>
            </div>
            
        </div>
    </footer>
  );
};

export default Footer;
