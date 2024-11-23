import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import competitionService from '../../services/competitions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Banner = ({ competitionId, title, image, description, detailDescription, startDate, endDate }) => {
  const now = new Date();
  const navigate = useNavigate()
  const [isRegistered, setIsRegistered] = useState(false); // Trạng thái đăng ký
  const [isDetailVisible, setDetailVisible] = useState(false);

  const toggleDetail = () => {
    setDetailVisible(!isDetailVisible);
  };

  // Hàm đăng ký tham gia cuộc thi
  const handleEnterContest = async () => {
    try {
      // Gọi API để tham gia cuộc thi, chỉ cần gửi competitionId vì userId đã có trong token được xác thực ở backend
      await competitionService.addParticipant(competitionId); 
      setIsRegistered(true); // Đăng ký thành công, thay đổi trạng thái
    } catch (error) {
      console.error('Đã có lỗi khi đăng ký:', error);
      console.log(error.response.status)
      if (error.response && error.response.status === 403) {
        alert('Please login to join this competitions');
        navigate('/login'); // Chuyển hướng người dùng đến trang đăng nhập
      } else {
        alert('Đã có lỗi xảy ra khi đăng ký tham gia cuộc thi.');
      }
    }
  };

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const registered = await competitionService.checkIsRegistered(competitionId); // Gọi API
      setIsRegistered(registered); // Cập nhật trạng thái đăng ký
    };

    fetchRegistrationStatus();
  }, [competitionId]);

  return (
    <div>
      <div className="relative w-full">
        <img
          className="w-full mx-auto max-h-64 md:max-h-80 object-cover"
          src={image}
          alt="Competition Image"
        />
        <div className="absolute max-w-6xl mx-auto inset-0 flex flex-col justify-end items-center mb-8">
          {/* Nền mờ */}
          <div className="bg-black/50 backdrop-blur-md p-4 rounded-lg">
            <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl">{title}</h1>
          </div>
          <div className="mt-4 flex gap-4">
            <button
              className="bg-primary hover:bg-primaryHover text-white font-bold py-1 sm:py-2 md:py-3 px-6 md:px-7 lg:px-8 rounded-full"
              onClick={() => !isDetailVisible && toggleDetail()}
            >
              Learn More
            </button>
            {new Date(endDate) > now && (
              <button
                className={`font-bold py-1 sm:py-2 md:py-3 px-6 md:px-7 lg:px-8 rounded-full 
                  ${isRegistered ? 'bg-green-500 text-white cursor-not-allowed' : 
                  'bg-secondaryBackground hover:bg-slate-200 text-slate-700 hover:text-slate-900'}`}
                onClick={handleEnterContest}
                disabled={isRegistered}
              >
                {isRegistered ? 'Registered!' : 'Enter Contest'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        className="flex justify-center items-center cursor-pointer bg-blue-900"
        onClick={toggleDetail}
      >
        <span
          className={`text-center text-sm sm:text-base md:text-lg text-white transition-all duration-300 ease-in-out ${
            isDetailVisible ? '' : 'hover:underline'
          }`}
        >
          {isDetailVisible ? detailDescription : description}
        </span>
        <span
          className={`ml-2 transition-transform duration-300 ease-in-out bg-primary rounded-full px-1 ${
            isDetailVisible ? 'rotate-180' : ''
          }`}
        >
          <FontAwesomeIcon icon={faChevronDown} className="text-white" />
        </span>
      </div>
    </div>
  );
};

export default Banner