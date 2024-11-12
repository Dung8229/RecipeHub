import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Banner = ({title, image, description, detailDescription, startDate, endDate}) => {
  const now = new Date()
  const [isDetailVisible, setDetailVisible] = useState(false)

  const toggleDetail = () => {
    setDetailVisible(!isDetailVisible);
  }

  return (
  <div> 
    <div className="relative w-full">
      <img 
        className="w-full mx-auto max-h-64 md:max-h-80 object-cover" 
        src={image} 
        alt="Competition Image" 
      />
      <div className="absolute max-w-6xl mx-auto inset-0 flex flex-col justify-end items-center mb-8">
        <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl">{title}</h1>
        <div className="mt-4 flex gap-4">
          <button 
            className="bg-primary hover:bg-primaryHover text-white font-bold py-1 sm:py-2 md:py-3 px-6 md:px-7 lg:px-8 rounded-full"
            onClick={() => !isDetailVisible && toggleDetail()}
          >
            Learn More
          </button>
          {endDate > now && (
            <button
              className="bg-secondaryBackground hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold py-1 sm:py-2 md:py-3 px-6 md:px-7 lg:px-8 rounded-full"
            >
              Enter Contest
            </button>
          )}
        </div>
      </div>
    </div>
    <div className="flex justify-center items-center cursor-pointer bg-blue-900" onClick={toggleDetail}>
      <span className={`text-center text-sm sm:text-base md:text-lg text-white transition-all duration-300 ease-in-out ${isDetailVisible ? '' : 'hover:underline'}`}>
        {isDetailVisible ? detailDescription : description}
      </span>
      <span className={`ml-2 transition-transform duration-300 ease-in-out bg-primary rounded-full px-1 ${isDetailVisible ? 'rotate-180' : ''}`}>
        <FontAwesomeIcon icon={faChevronDown} className="text-white"/>
      </span>
    </div>
  </div> 
  )
}

export default Banner